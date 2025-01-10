/*
  # Fix schools table and policies

  1. Changes
    - Drop and recreate schools table with all columns
    - Add proper RLS policies
    - Fix school_grades table
*/

-- Recreate schools table with all columns
DROP TABLE IF EXISTS schools CASCADE;

CREATE TABLE schools (
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
  website text,
  established_year integer,
  accreditation_status text,
  facilities jsonb DEFAULT '{}',
  operating_hours jsonb DEFAULT '{}',
  social_media jsonb DEFAULT '{}',
  emergency_contact text,
  tax_id text,
  license_number text,
  last_inspection_date date,
  student_count integer DEFAULT 0,
  staff_count integer DEFAULT 0,
  classroom_count integer DEFAULT 0,
  is_boarding boolean DEFAULT false,
  transportation_provided boolean DEFAULT false,
  curriculum_type text[] DEFAULT '{}',
  languages_offered text[] DEFAULT '{}',
  extracurricular_activities text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recreate school_grades junction table
DROP TABLE IF EXISTS school_grades CASCADE;

CREATE TABLE school_grades (
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  grade_id uuid REFERENCES grades(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (school_id, grade_id)
);

-- Enable RLS
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_grades ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for schools
CREATE POLICY "Enable read access for all authenticated users"
  ON schools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON schools FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON schools FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON schools FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for school_grades
CREATE POLICY "Enable read access for all authenticated users"
  ON school_grades FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON school_grades FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON school_grades FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete for authenticated users"
  ON school_grades FOR DELETE
  TO authenticated
  USING (true);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to schools table
DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;
CREATE TRIGGER update_schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();