-- Create test admin user if not exists
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  raw_user_meta_data,
  raw_app_meta_data,
  aud,
  role,
  created_at,
  updated_at,
  last_sign_in_at,
  is_super_admin
) 
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  jsonb_build_object(
    'name', 'Admin User',
    'role', 'super_admin'
  ),
  jsonb_build_object(
    'role', 'super_admin',
    'provider', 'email'
  ),
  'authenticated',
  'authenticated',
  now(),
  now(),
  now(),
  true
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
);

-- Set password for admin user
UPDATE auth.users 
SET encrypted_password = crypt('admin123', gen_salt('bf'))
WHERE email = 'admin@example.com';

-- Ensure role settings exist for super_admin
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