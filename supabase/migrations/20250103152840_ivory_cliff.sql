-- Create students table if not exists
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  roll_number text NOT NULL,
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  grade_id uuid REFERENCES grades(id) ON DELETE CASCADE,
  gender text CHECK (gender IN ('Male', 'Female', 'Other')),
  date_of_birth date,
  contact_number text,
  email text,
  address text,
  guardian_name text,
  guardian_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(school_id, roll_number)
);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create RLS policies with unique names
CREATE POLICY "students_view_policy_v3"
  ON students FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin') OR
    school_id IN (
      SELECT school_id FROM user_schools WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "students_manage_policy_v3"
  ON students FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader', 'school_principal') AND
    school_id IN (
      SELECT school_id FROM user_schools WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader', 'school_principal') AND
    school_id IN (
      SELECT school_id FROM user_schools WHERE user_id = auth.uid()
    )
  );

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_students_school_id ON students(school_id);
CREATE INDEX IF NOT EXISTS idx_students_grade_id ON students(grade_id);
CREATE INDEX IF NOT EXISTS idx_students_roll_number ON students(roll_number);

-- Add updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for updated_at if it doesn't exist
DO $$ BEGIN
  CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;