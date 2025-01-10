-- Drop existing objects
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_default_dashboard CASCADE;
DROP TABLE IF EXISTS dashboards CASCADE;

-- Create dashboards table with proper structure
CREATE TABLE dashboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  layout jsonb NOT NULL DEFAULT '[]',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "dashboard_select_policy"
  ON dashboards FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "dashboard_insert_policy"
  ON dashboards FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "dashboard_update_policy"
  ON dashboards FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "dashboard_delete_policy"
  ON dashboards FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to create default dashboard
CREATE OR REPLACE FUNCTION create_default_dashboard()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO dashboards (
    user_id,
    name,
    layout,
    is_default
  ) VALUES (
    NEW.id,
    'Default Dashboard',
    '[]'::jsonb,
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_dashboard();