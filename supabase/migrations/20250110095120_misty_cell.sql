-- Drop existing audit logs table and functions
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP FUNCTION IF EXISTS create_audit_log CASCADE;
DROP FUNCTION IF EXISTS process_failed_audit_logs CASCADE;

-- Create improved audit_logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error')),
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz NOT NULL DEFAULT now(),
  retry_count integer NOT NULL DEFAULT 0,
  CONSTRAINT audit_logs_details_check CHECK (jsonb_typeof(details) = 'object')
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "audit_logs_insert"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "audit_logs_select"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin') OR
    user_id = auth.uid()
  );

-- Add indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_status ON audit_logs(status);
CREATE INDEX idx_audit_logs_details ON audit_logs USING gin(details);

-- Create stored procedure for audit log creation with retries
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id uuid,
  p_action text,
  p_details jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_retry_count integer := 0;
  v_max_retries constant integer := 3;
  v_retry_delay constant float := 0.1; -- 100ms
BEGIN
  <<retry_loop>>
  LOOP
    BEGIN
      -- Clean up old failed logs before inserting new ones
      DELETE FROM audit_logs
      WHERE 
        status = 'error' AND
        created_at < (now() - interval '30 days');

      -- Insert new log
      INSERT INTO audit_logs (
        user_id,
        action,
        details,
        retry_count
      ) VALUES (
        p_user_id,
        p_action,
        p_details,
        v_retry_count
      )
      RETURNING id INTO v_id;

      -- Success - exit loop
      EXIT retry_loop;

    EXCEPTION 
      WHEN OTHERS THEN
        -- Increment retry counter
        v_retry_count := v_retry_count + 1;
        
        IF v_retry_count >= v_max_retries THEN
          -- Insert error record
          INSERT INTO audit_logs (
            user_id,
            action,
            details,
            status,
            retry_count
          ) VALUES (
            p_user_id,
            p_action || '_failed',
            jsonb_build_object(
              'original_details', p_details,
              'error', SQLERRM,
              'attempts', v_max_retries
            ),
            'error',
            v_max_retries
          );
          
          RETURN NULL;
        END IF;

        -- Wait before retrying
        PERFORM pg_sleep(v_retry_delay * v_retry_count);
        
        CONTINUE retry_loop;
    END;
  END LOOP;
  
  RETURN v_id;
END;
$$;

-- Grant execute permission on function
GRANT EXECUTE ON FUNCTION create_audit_log TO authenticated;

-- Create function to process failed logs
CREATE OR REPLACE FUNCTION process_failed_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update status of failed logs
  UPDATE audit_logs
  SET 
    status = 'error',
    processed_at = now()
  WHERE 
    status = 'success' AND
    retry_count >= 3 AND
    created_at < (now() - interval '5 minutes');

  -- Delete old failed logs
  DELETE FROM audit_logs
  WHERE 
    status = 'error' AND
    created_at < (now() - interval '30 days');
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION process_failed_audit_logs TO authenticated;