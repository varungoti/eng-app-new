/*
  # Role Settings and User Preferences Schema

  1. Tables
    - role_settings: Stores role-specific settings and preferences
    - user_preferences: Stores individual user preferences
    - dashboards: Stores user dashboard layouts
    - dashboard_widgets: Stores widget configurations

  2. Changes
    - Drop and recreate tables with proper constraints
    - Add RLS policies
    - Insert default role settings

  3. Security
    - Enable RLS on all tables
    - Add policies for role-based access
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS dashboard_widgets CASCADE;
DROP TABLE IF EXISTS dashboards CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS role_settings CASCADE;

-- Create role_settings table
CREATE TABLE role_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key text NOT NULL UNIQUE,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_preferences table
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create dashboards table
CREATE TABLE dashboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  layout jsonb DEFAULT '[]',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create dashboard_widgets table
CREATE TABLE dashboard_widgets (
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
DO $$ BEGIN
  -- Role settings policies
  CREATE POLICY "Admins can manage role settings"
    ON role_settings FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin'))
    WITH CHECK (auth.jwt() ->> 'role' IN ('super_admin', 'admin'));

  CREATE POLICY "Users can view their role settings"
    ON role_settings FOR SELECT
    TO authenticated
    USING (role_key = auth.jwt() ->> 'role');

  -- User preferences policies
  CREATE POLICY "Users can manage their own preferences"
    ON user_preferences FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

  -- Dashboard policies
  CREATE POLICY "Users can manage their own dashboards"
    ON dashboards FOR ALL
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

  -- Dashboard widgets policies
  CREATE POLICY "Users can manage their dashboard widgets"
    ON dashboard_widgets FOR ALL
    TO authenticated
    USING (dashboard_id IN (SELECT id FROM dashboards WHERE user_id = auth.uid()))
    WITH CHECK (dashboard_id IN (SELECT id FROM dashboards WHERE user_id = auth.uid()));
END $$;

-- Insert default role settings
INSERT INTO role_settings (role_key, settings) VALUES
  ('sales_head', jsonb_build_object(
    'defaultView', 'pipeline',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'dealUpdates', true,
      'teamPerformance', true
    ),
    'reports', ARRAY['pipeline', 'forecast', 'team_performance', 'conversion_rates']
  )),
  ('sales_executive', jsonb_build_object(
    'defaultView', 'leads',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'leadUpdates', true,
      'taskReminders', true
    ),
    'reports', ARRAY['my_leads', 'my_activities', 'my_performance']
  )),
  ('school_leader', jsonb_build_object(
    'defaultView', 'schools',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'schoolUpdates', true,
      'staffUpdates', true,
      'contentUpdates', true
    ),
    'reports', ARRAY['school_performance', 'staff_overview', 'content_usage']
  )),
  ('school_principal', jsonb_build_object(
    'defaultView', 'dashboard',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'staffUpdates', true,
      'studentUpdates', true
    ),
    'reports', ARRAY['school_metrics', 'staff_attendance', 'class_progress']
  )),
  ('teacher_head', jsonb_build_object(
    'defaultView', 'teachers',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'teacherUpdates', true,
      'contentUpdates', true
    ),
    'reports', ARRAY['teacher_performance', 'class_progress', 'content_effectiveness']
  )),
  ('teacher', jsonb_build_object(
    'defaultView', 'classes',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'classUpdates', true,
      'contentUpdates', true
    ),
    'reports', ARRAY['my_classes', 'student_progress', 'lesson_completion']
  ));