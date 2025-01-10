-- Create students table
CREATE TABLE students (
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

-- Create RLS policies
CREATE POLICY "Users can view students in their school"
  ON students FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin') OR
    school_id IN (
      SELECT school_id FROM user_schools WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "School staff can manage their students"
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
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_grade_id ON students(grade_id);
CREATE INDEX idx_students_roll_number ON students(roll_number);

-- Add trigger for updated_at
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON students
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();