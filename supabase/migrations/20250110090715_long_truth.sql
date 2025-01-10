-- Drop existing staff table and policies
DROP TABLE IF EXISTS staff CASCADE;

-- Recreate staff table with proper relationships
CREATE TABLE staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  role text NOT NULL,
  school_id uuid REFERENCES schools(id) ON DELETE SET NULL,
  department text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "staff_view_policy"
  ON staff FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "staff_manage_policy"
  ON staff FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader') OR
    (auth.jwt() ->> 'role' = 'school_principal' AND school_id IN (
      SELECT school_id FROM user_schools WHERE user_id = auth.uid()
    ))
  )
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader') OR
    (auth.jwt() ->> 'role' = 'school_principal' AND school_id IN (
      SELECT school_id FROM user_schools WHERE user_id = auth.uid()
    ))
  );

-- Add indexes
CREATE INDEX idx_staff_school_id ON staff(school_id);
CREATE INDEX idx_staff_role ON staff(role);
CREATE INDEX idx_staff_email ON staff(email);

-- Add trigger for updated_at
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON staff
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Insert some test data
INSERT INTO staff (name, email, role, department, status)
VALUES 
  ('John Smith', 'john@example.com', 'teacher', 'English', 'active'),
  ('Sarah Johnson', 'sarah@example.com', 'admin', 'Administration', 'active'),
  ('Michael Brown', 'michael@example.com', 'teacher', 'Mathematics', 'active')
ON CONFLICT (email) DO NOTHING;