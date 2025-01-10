-- Drop existing audit_logs table and functions
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP FUNCTION IF EXISTS create_audit_log CASCADE;
DROP FUNCTION IF EXISTS process_failed_audit_logs CASCADE;

-- Create improved audit_logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error', 'pending')),
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  retry_count integer NOT NULL DEFAULT 0,
  error_details jsonb,
  CONSTRAINT audit_logs_details_check CHECK (jsonb_typeof(details) = 'object')
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
CREATE POLICY "audit_logs_insert"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "audit_logs_select"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (true);

-- Add indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);

-- Create simplified audit log function
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id uuid,
  p_action text,
  p_details jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Simple insert without retries
  INSERT INTO audit_logs (
    user_id,
    action,
    details,
    status,
    processed_at
  ) VALUES (
    p_user_id,
    p_action,
    p_details,
    'success',
    now()
  )
  RETURNING id INTO v_id;
  
  RETURN v_id;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail
  INSERT INTO audit_logs (
    user_id,
    action,
    details,
    status,
    error_details,
    processed_at
  ) VALUES (
    p_user_id,
    p_action || '_failed',
    p_details,
    'error',
    jsonb_build_object(
      'error', SQLERRM,
      'timestamp', now()
    ),
    now()
  );
  
  RETURN NULL;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_audit_log TO authenticated;

-- Update role settings for Content Editor and Sales Lead
INSERT INTO role_settings (role_key, settings) VALUES
('content_editor', jsonb_build_object(
  'defaultView', 'content',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'contentUpdates', true,
    'reviewRequests', true
  ),
  'reports', ARRAY['content_metrics', 'review_status', 'content_quality'],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'contentCreated',
      'pendingReviews',
      'contentQuality',
      'userEngagement'
    ],
    'charts', ARRAY[
      'contentProgress',
      'qualityMetrics',
      'userFeedback'
    ],
    'recentActivities', true,
    'contentOverview', true
  )
)),
('sales_lead', jsonb_build_object(
  'defaultView', 'sales',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'leadUpdates', true,
    'teamPerformance', true
  ),
  'reports', ARRAY['pipeline', 'team_leads', 'conversion_rates'],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'totalLeads',
      'qualifiedLeads',
      'teamPerformance',
      'conversionRate'
    ],
    'charts', ARRAY[
      'leadsTrend',
      'teamMetrics',
      'conversionFunnel'
    ],
    'recentActivities', true,
    'teamOverview', true
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();