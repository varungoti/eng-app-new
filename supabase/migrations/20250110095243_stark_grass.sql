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
  status text NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'error', 'pending')),
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  retry_count integer NOT NULL DEFAULT 0,
  error_details jsonb,
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

-- Create stored procedure for audit log creation with improved error handling
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id uuid,
  p_action text,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_status text DEFAULT 'success'
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
  v_error_details jsonb;
BEGIN
  -- Validate input
  IF p_user_id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  -- Clean up old logs
  DELETE FROM audit_logs
  WHERE status = 'error' 
  AND created_at < (now() - interval '30 days');

  <<retry_loop>>
  LOOP
    BEGIN
      -- Insert new log
      INSERT INTO audit_logs (
        user_id,
        action,
        details,
        status,
        retry_count,
        error_details
      ) VALUES (
        p_user_id,
        p_action,
        p_details,
        CASE 
          WHEN v_retry_count = 0 THEN p_status
          ELSE 'pending'
        END,
        v_retry_count,
        v_error_details
      )
      RETURNING id INTO v_id;

      -- Success - exit loop
      EXIT retry_loop;

    EXCEPTION WHEN OTHERS THEN
      -- Store error details
      v_error_details := jsonb_build_object(
        'error', SQLERRM,
        'detail', SQLSTATE,
        'context', jsonb_build_object(
          'retry_count', v_retry_count,
          'timestamp', now()
        )
      );

      -- Increment retry counter
      v_retry_count := v_retry_count + 1;
      
      IF v_retry_count >= v_max_retries THEN
        -- Insert error record after max retries
        INSERT INTO audit_logs (
          user_id,
          action,
          details,
          status,
          retry_count,
          error_details,
          processed_at
        ) VALUES (
          p_user_id,
          p_action || '_failed',
          jsonb_build_object(
            'original_details', p_details,
            'error', SQLERRM,
            'attempts', v_max_retries
          ),
          'error',
          v_max_retries,
          v_error_details,
          now()
        );
        
        -- Return null to indicate failure
        RETURN NULL;
      END IF;

      -- Exponential backoff
      PERFORM pg_sleep(v_retry_delay * power(2, v_retry_count - 1));
      
      CONTINUE retry_loop;
    END;
  END LOOP;
  
  RETURN v_id;
END;
$$;

-- Grant execute permission on function
GRANT EXECUTE ON FUNCTION create_audit_log TO authenticated;

-- Create function to process pending logs
CREATE OR REPLACE FUNCTION process_pending_audit_logs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update status of pending logs
  UPDATE audit_logs
  SET 
    status = 'error',
    processed_at = now(),
    error_details = jsonb_build_object(
      'error', 'Timed out waiting for processing',
      'timestamp', now()
    )
  WHERE 
    status = 'pending' AND
    created_at < (now() - interval '5 minutes');

  -- Clean up old error logs
  DELETE FROM audit_logs
  WHERE 
    status = 'error' AND
    created_at < (now() - interval '30 days');
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION process_pending_audit_logs TO authenticated;