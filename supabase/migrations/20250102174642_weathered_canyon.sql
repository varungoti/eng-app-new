/*
  # Add schools table indexes and constraints

  1. Changes
    - Add indexes for frequently queried columns
    - Add constraints for data integrity
    - Add trigger for updated_at

  2. Security
    - Maintain existing RLS policies
*/

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_schools_type ON schools(type);
CREATE INDEX IF NOT EXISTS idx_schools_status ON schools(status);
CREATE INDEX IF NOT EXISTS idx_schools_parent_id ON schools(parent_id);
CREATE INDEX IF NOT EXISTS idx_school_grades_school_id ON school_grades(school_id);
CREATE INDEX IF NOT EXISTS idx_school_grades_grade_id ON school_grades(grade_id);

-- Add check constraints
ALTER TABLE schools 
  ADD CONSTRAINT check_latitude CHECK (latitude BETWEEN -90 AND 90),
  ADD CONSTRAINT check_longitude CHECK (longitude BETWEEN -180 AND 180),
  ADD CONSTRAINT check_capacity CHECK (capacity >= 0),
  ADD CONSTRAINT check_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp ON schools;
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON schools
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();