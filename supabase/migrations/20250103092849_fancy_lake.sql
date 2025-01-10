/*
  # Role Settings Migration

  1. Create Tables
    - role_settings: Store role-specific settings and preferences
    - user_preferences: Store user-specific preferences
    - dashboards: Store user dashboard configurations
    - dashboard_widgets: Store individual dashboard widgets

  2. Enable RLS and create policies
    - Role-based access control for settings
    - User-specific access control for preferences
    - Dashboard management permissions
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage role settings" ON role_settings;
DROP POLICY IF EXISTS "Users can view their role settings" ON role_settings;
DROP POLICY IF EXISTS "Users can manage their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can manage their own dashboards" ON dashboards;
DROP POLICY IF EXISTS "Users can manage their dashboard widgets" ON dashboard_widgets;

-- Create role_settings table if not exists
CREATE TABLE IF NOT EXISTS role_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(role)
);

-- Create user_preferences table if not exists
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create dashboards table if not exists
CREATE TABLE IF NOT EXISTS dashboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  layout jsonb DEFAULT '[]',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dashboard_widgets table if not exists
CREATE TABLE IF NOT EXISTS dashboard_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id uuid REFERENCES dashboards(id) ON DELETE CASCADE,
  widget_type text NOT NULL,
  title text NOT NULL,
  config jsonb DEFAULT '{}',
  position jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE role_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  -- Role settings policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'role_settings' AND policyname = 'Admins can manage role settings'
  ) THEN
    CREATE POLICY "Admins can manage role settings"
      ON role_settings FOR ALL
      TO authenticated
      USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin'))
      WITH CHECK (auth.jwt() ->> 'role' IN ('super_admin', 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'role_settings' AND policyname = 'Users can view their role settings'
  ) THEN
    CREATE POLICY "Users can view their role settings"
      ON role_settings FOR SELECT
      TO authenticated
      USING (role = auth.jwt() ->> 'role');
  END IF;

  -- User preferences policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_preferences' AND policyname = 'Users can manage their own preferences'
  ) THEN
    CREATE POLICY "Users can manage their own preferences"
      ON user_preferences FOR ALL
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;

  -- Dashboard policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'dashboards' AND policyname = 'Users can manage their own dashboards'
  ) THEN
    CREATE POLICY "Users can manage their own dashboards"
      ON dashboards FOR ALL
      TO authenticated
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;

  -- Dashboard widgets policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'dashboard_widgets' AND policyname = 'Users can manage their dashboard widgets'
  ) THEN
    CREATE POLICY "Users can manage their dashboard widgets"
      ON dashboard_widgets FOR ALL
      TO authenticated
      USING (dashboard_id IN (SELECT id FROM dashboards WHERE user_id = auth.uid()))
      WITH CHECK (dashboard_id IN (SELECT id FROM dashboards WHERE user_id = auth.uid()));
  END IF;
END $$;