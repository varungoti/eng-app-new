-- Drop existing audit tables and functions
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP FUNCTION IF EXISTS create_audit_log CASCADE;

-- Create minimal audit_logs table
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

-- Create simple audit function that never fails
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_audit_log TO authenticated;

-- Create function to handle role changes
CREATE OR REPLACE FUNCTION handle_role_change(
  p_user_id uuid,
  p_new_role text,
  p_old_role text DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update user metadata
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('role', p_new_role)
      ELSE 
        raw_user_meta_data || jsonb_build_object('role', p_new_role)
    END,
    raw_app_meta_data = 
    CASE 
      WHEN raw_app_meta_data IS NULL THEN 
        jsonb_build_object('role', p_new_role)
      ELSE 
        raw_app_meta_data || jsonb_build_object('role', p_new_role)
    END
  WHERE id = p_user_id;

  -- Best-effort audit log
  PERFORM create_audit_log(
    p_user_id,
    'role_change',
    jsonb_build_object(
      'old_role', p_old_role,
      'new_role', p_new_role
    )
  );
EXCEPTION WHEN OTHERS THEN
  NULL; -- Never fail
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION handle_role_change TO authenticated;