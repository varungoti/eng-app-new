-- Drop existing audit_logs table and functions
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP FUNCTION IF EXISTS create_audit_log CASCADE;

-- Create minimal audit_logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create minimal policies
CREATE POLICY "enable_audit_logs_insert"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "enable_audit_logs_select"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (true);

-- Create ultra-simple audit log function
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id uuid,
  p_action text,
  p_details jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Best-effort insert, no error handling
  BEGIN
    INSERT INTO audit_logs (user_id, action, details)
    VALUES (p_user_id, p_action, p_details);
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END;
$$;