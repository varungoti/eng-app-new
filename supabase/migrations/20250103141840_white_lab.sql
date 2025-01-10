-- Create health check table
CREATE TABLE IF NOT EXISTS _health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  last_check timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE _health ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow reads
CREATE POLICY "Allow health check reads"
  ON _health FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial health check record
INSERT INTO _health DEFAULT VALUES;