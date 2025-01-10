/*
  # Add schools table

  1. New Tables
    - `schools`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text: 'main' or 'branch')
      - `parent_id` (uuid, references schools)
      - `address` (text)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `contact_number` (text)
      - `email` (text)
      - `status` (text)
      - `capacity` (integer)
      - `principal_name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Junction Tables
    - `school_grades` (many-to-many relationship between schools and grades)
      - `school_id` (uuid)
      - `grade_id` (uuid)

  3. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create schools table
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

-- Create school_grades junction table
CREATE TABLE IF NOT EXISTS school_grades (
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  grade_id uuid REFERENCES grades(id) ON DELETE CASCADE,
  PRIMARY KEY (school_id, grade_id)
);

-- Enable Row Level Security
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_grades ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ BEGIN
  -- Schools policies
  CREATE POLICY "Allow read access for authenticated users" ON schools
    FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow write access for authenticated users" ON schools
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

  -- School grades policies
  CREATE POLICY "Allow read access for authenticated users" ON school_grades
    FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow write access for authenticated users" ON school_grades
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
END $$;