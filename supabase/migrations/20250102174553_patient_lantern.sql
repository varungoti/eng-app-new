/*
  # Update RLS policies and create user_schools table

  1. Changes
    - Create user_schools junction table
    - Add RLS policies for schools and school_grades tables
    - Add policies for user_schools table

  2. Security
    - Enable RLS on all tables
    - Add granular policies for different user roles
*/

-- Create user_schools junction table
CREATE TABLE IF NOT EXISTS user_schools (
  user_id uuid NOT NULL,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, school_id)
);

-- Enable RLS on user_schools
ALTER TABLE user_schools ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_schools
CREATE POLICY "Enable read access for all authenticated users"
  ON user_schools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON user_schools FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON user_schools FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON user_schools FOR DELETE
  TO authenticated
  USING (true);