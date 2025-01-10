-- Create audit_logs table with improved structure
CREATE TABLE _audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  status text DEFAULT 'success' CHECK (status IN ('success', 'error', 'pending')),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Enable RLS
ALTER TABLE _audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies with better permissions
CREATE POLICY "audit_logs_insert_policy"
  ON _audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "audit_logs_select_policy"
  ON _audit_logs FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin') OR
    user_id = auth.uid()
  );

-- Add indexes for better performance
CREATE INDEX idx_audit_logs_user_id ON _audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON _audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON _audit_logs(created_at);
CREATE INDEX idx_audit_logs_status ON _audit_logs(status);

-- Create function to handle audit log failures
CREATE OR REPLACE FUNCTION handle_failed_audit_log() 
RETURNS trigger AS $$
BEGIN
  -- Update status to error if insert fails
  NEW.status := 'error';
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and continue
    RAISE WARNING 'Failed to handle audit log failure: %', SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for handling failures
CREATE TRIGGER audit_log_error_handler
  BEFORE INSERT ON _audit_logs
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION handle_failed_audit_log();