-- Drop existing objects
DROP FUNCTION IF EXISTS update_health_check CASCADE;
DROP TABLE IF EXISTS _health CASCADE;

-- Create health check table
CREATE TABLE _health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  last_check timestamptz DEFAULT now(),
  status text DEFAULT 'healthy'
);

-- Enable RLS
ALTER TABLE _health ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "health_check_read_policy_v5"
  ON _health FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "health_check_update_policy_v5"
  ON _health FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial health check record
INSERT INTO _health (status) VALUES ('healthy');

-- Create improved health check update function
CREATE OR REPLACE FUNCTION update_health_check()
RETURNS jsonb AS $$
DECLARE
  result jsonb;
  health_record _health%ROWTYPE;
BEGIN
  -- Get or create health record
  SELECT * INTO health_record FROM _health LIMIT 1;
  
  IF health_record IS NULL THEN
    INSERT INTO _health (status) VALUES ('healthy')
    RETURNING * INTO health_record;
  END IF;

  -- Update the record with WHERE clause
  UPDATE _health 
  SET 
    last_check = now(),
    status = 'healthy'
  WHERE id = health_record.id
  RETURNING jsonb_build_object(
    'last_check', last_check,
    'status', status
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;