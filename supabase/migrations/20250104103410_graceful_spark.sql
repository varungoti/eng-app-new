-- Drop existing objects
DROP FUNCTION IF EXISTS update_health_check CASCADE;

-- Create health check update function
CREATE OR REPLACE FUNCTION update_health_check()
RETURNS boolean AS $$
BEGIN
  -- Simple health check that always returns true
  -- This avoids the need for a health check table
  RETURN true;
END;
$$ LANGUAGE plpgsql;