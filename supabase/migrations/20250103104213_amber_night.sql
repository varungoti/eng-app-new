-- Create test users with different roles
DO $$
BEGIN
  -- Create test admin user if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
  ) THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      raw_app_meta_data
    ) VALUES (
      gen_random_uuid(),
      'admin@example.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      jsonb_build_object(
        'name', 'Admin User',
        'role', 'super_admin'
      ),
      jsonb_build_object(
        'role', 'super_admin',
        'provider', 'email'
      )
    );
  END IF;

  -- Update role settings for super_admin
  INSERT INTO role_settings (role_key, settings) VALUES
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

END $$;