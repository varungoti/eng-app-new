-- Drop existing objects
DROP FUNCTION IF EXISTS update_health_check CASCADE;
DROP TABLE IF EXISTS _health CASCADE;

-- Create health check table
CREATE TABLE _health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  last_check timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE _health ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "health_check_read_policy_v2" ON _health;
DROP POLICY IF EXISTS "health_check_update_policy_v2" ON _health;

-- Create new policies
CREATE POLICY "health_check_read_policy_v3"
  ON _health FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "health_check_update_policy_v3"
  ON _health FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial health check record
INSERT INTO _health DEFAULT VALUES;

-- Create health check update function with WHERE clause
CREATE OR REPLACE FUNCTION update_health_check()
RETURNS timestamptz AS $$
DECLARE
  updated_time timestamptz;
  health_id uuid;
BEGIN
  -- Get the ID of the health check record
  SELECT id INTO health_id FROM _health LIMIT 1;
  
  -- Update the record with WHERE clause
  UPDATE _health 
  SET last_check = now()
  WHERE id = health_id
  RETURNING last_check INTO updated_time;
  
  RETURN updated_time;
END;
$$ LANGUAGE plpgsql;