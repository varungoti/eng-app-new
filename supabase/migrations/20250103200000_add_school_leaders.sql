/*
  # Add school_leaders table

  1. New Table:
    - `school_leaders`
      - `id` (uuid, primary key)
      - `school_id` (uuid, references schools)
      - `name` (text)
      - `role` (text)
      - `email` (text)
      - `phone` (text)
      - `designation` (text)
      - `bio` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security:
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create school_leaders table
CREATE TABLE IF NOT EXISTS school_leaders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'director', 'trustee', 'board_member')),
  email text NOT NULL,
  phone text NOT NULL,
  designation text NOT NULL,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE school_leaders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON school_leaders;
DROP POLICY IF EXISTS "Allow write access for authenticated users" ON school_leaders;

-- Create RLS policies for school_leaders
CREATE POLICY "Super admins and admins can manage school leaders"
  ON school_leaders FOR ALL
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader')
  )
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader')
  );

CREATE POLICY "School principals can view their school's leaders"
  ON school_leaders FOR SELECT
  TO authenticated
  USING (
    school_id IN (
      SELECT school_id 
      FROM user_schools 
      WHERE user_id = auth.uid()
    )
  );

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_school_leaders_school_id ON school_leaders(school_id);
CREATE INDEX IF NOT EXISTS idx_school_leaders_email ON school_leaders(email);
CREATE INDEX IF NOT EXISTS idx_school_leaders_role ON school_leaders(role); 
