/*
  # Create Schools Tables and Policies

  1. New Tables:
    - schools
    - school_grades
    - user_schools

  2. Security:
    - Enable RLS on all tables
    - Create granular policies for different user roles
*/

-- Create schools table if it doesn't exist
CREATE TABLE IF NOT EXISTS schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('main', 'branch')),
  parent_id uuid REFERENCES schools(id),
  address text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'inactive')),
  capacity integer NOT NULL,
  principal_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create school_grades junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS school_grades (
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  grade_id uuid REFERENCES grades(id) ON DELETE CASCADE,
  PRIMARY KEY (school_id, grade_id)
);

-- Create user_schools junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_schools (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, school_id)
);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_schools ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON schools;
DROP POLICY IF EXISTS "Allow write access for authenticated users" ON schools;
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON school_grades;
DROP POLICY IF EXISTS "Allow write access for authenticated users" ON school_grades;

-- Schools table policies
-- View policies
CREATE POLICY "Super admins and admins can view all schools"
  ON schools FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader')
  );

CREATE POLICY "Users can view their assigned school"
  ON schools FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT school_id 
      FROM user_schools 
      WHERE user_id = auth.uid()
    )
  );

-- Insert policies
CREATE POLICY "Super admins and admins can create schools"
  ON schools FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader')
  );

-- Update policies
CREATE POLICY "Super admins and admins can update any school"
  ON schools FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader')
  )
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader')
  );

CREATE POLICY "Users can update their assigned school"
  ON schools FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT school_id 
      FROM user_schools 
      WHERE user_id = auth.uid()
    )
    AND
    auth.jwt() ->> 'role' IN ('school_principal')
  )
  WITH CHECK (
    id IN (
      SELECT school_id 
      FROM user_schools 
      WHERE user_id = auth.uid()
    )
    AND
    auth.jwt() ->> 'role' IN ('school_principal')
  );

-- Delete policies
CREATE POLICY "Super admins and admins can delete schools"
  ON schools FOR DELETE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin')
  );

-- School grades junction table policies
CREATE POLICY "Super admins and admins can manage school grades"
  ON school_grades FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader')
  )
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader')
  );

CREATE POLICY "Users can view their school grades"
  ON school_grades FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id 
      FROM user_schools 
      WHERE user_id = auth.uid()
    )
  );

-- User schools policies
CREATE POLICY "Super admins and admins can manage user school assignments"
  ON user_schools FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin')
  )
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin')
  );

CREATE POLICY "Users can view their own school assignments"
  ON user_schools FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
  );