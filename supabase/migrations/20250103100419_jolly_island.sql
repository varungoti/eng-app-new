-- Drop and recreate role_settings table with proper structure
DROP TABLE IF EXISTS role_settings CASCADE;

CREATE TABLE role_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key text NOT NULL UNIQUE,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE role_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
  ON role_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable write access for admins"
  ON role_settings FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('super_admin', 'admin'));

-- Insert default settings for each role including admin
INSERT INTO role_settings (role_key, settings) VALUES
  ('admin', jsonb_build_object(
    'defaultView', 'dashboard',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'systemAlerts', true
    ),
    'reports', ARRAY['system_health', 'user_activity', 'audit_logs'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalUsers', 'activeUsers', 'systemHealth', 'errorRate'],
      'charts', ARRAY['userGrowth', 'systemMetrics', 'errorDistribution'],
      'recentActivities', true,
      'notifications', true,
      'auditLog', true
    )
  )),
  ('user', jsonb_build_object(
    'defaultView', 'dashboard',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true
    ),
    'reports', ARRAY['my_activity'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalTasks', 'completedTasks', 'upcomingDeadlines'],
      'charts', ARRAY['activityTimeline', 'taskDistribution'],
      'recentActivities', true,
      'notifications', true
    )
  )),
  ('super_admin', jsonb_build_object(
    'defaultView', 'dashboard',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'systemAlerts', true
    ),
    'reports', ARRAY['system_health', 'user_activity', 'audit_logs'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalUsers', 'activeUsers', 'systemHealth', 'errorRate'],
      'charts', ARRAY['userGrowth', 'systemMetrics', 'errorDistribution'],
      'recentActivities', true,
      'notifications', true,
      'auditLog', true
    )
  ))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();