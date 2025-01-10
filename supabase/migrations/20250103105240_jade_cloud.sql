/*
  # Create test admin user and role settings
  
  1. Creates test admin user with proper credentials
  2. Adds role settings for super_admin role
*/

-- Create test admin user if not exists
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  raw_user_meta_data,
  raw_app_meta_data,
  aud,
  role
) 
SELECT 
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@example.com',
  crypt('admin123', gen_salt('bf')),
  jsonb_build_object(
    'name', 'Admin User',
    'role', 'super_admin'
  ),
  jsonb_build_object(
    'role', 'super_admin',
    'provider', 'email'
  ),
  'authenticated',
  'authenticated'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@example.com'
);

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