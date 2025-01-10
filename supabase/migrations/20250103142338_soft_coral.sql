-- Create health check table if not exists
CREATE TABLE IF NOT EXISTS _health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  last_check timestamptz DEFAULT now()
);

-- Enable RLS if not already enabled
ALTER TABLE _health ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow health check reads" ON _health;
DROP POLICY IF EXISTS "Allow health check updates" ON _health;
DROP POLICY IF EXISTS "health_check_read_policy" ON _health;
DROP POLICY IF EXISTS "health_check_update_policy" ON _health;

-- Create new policies with unique names
CREATE POLICY "health_check_read_policy_v2"
  ON _health FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "health_check_update_policy_v2"
  ON _health FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert initial health check record if none exists
INSERT INTO _health DEFAULT VALUES
ON CONFLICT DO NOTHING;

-- Create or replace health check update function
CREATE OR REPLACE FUNCTION update_health_check()
RETURNS timestamptz AS $$
DECLARE
  updated_time timestamptz;
BEGIN
  UPDATE _health 
  SET last_check = now()
  RETURNING last_check INTO updated_time;
  
  RETURN updated_time;
END;
$$ LANGUAGE plpgsql;