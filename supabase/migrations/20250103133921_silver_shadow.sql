-- Drop existing objects first
DROP POLICY IF EXISTS "Users can manage their own dashboards" ON dashboards;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_default_dashboard();
DROP TABLE IF EXISTS dashboards CASCADE;

-- Create dashboards table
CREATE TABLE dashboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  widgets jsonb DEFAULT '[]',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "dashboard_user_policy"
  ON dashboards FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create function to create default dashboard
CREATE OR REPLACE FUNCTION create_default_dashboard()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO dashboards (user_id, name, widgets, is_default)
  VALUES (
    NEW.id,
    'Default Dashboard',
    '[]'::jsonb,
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to create default dashboard for new users
CREATE TRIGGER create_default_dashboard_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_dashboard();