-- Drop all existing audit tables and functions
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS _audit_logs CASCADE;
DROP FUNCTION IF EXISTS create_audit_log CASCADE;
DROP FUNCTION IF EXISTS process_failed_audit_logs CASCADE;

-- Create ultra-minimal audit_logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
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

-- Create fire-and-forget audit function
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
  -- Best-effort insert with no error propagation
  BEGIN
    INSERT INTO audit_logs (user_id, action, details)
    VALUES (p_user_id, p_action, p_details);
  EXCEPTION WHEN OTHERS THEN
    NULL; -- Silently continue on any error
  END;
END;
$$;