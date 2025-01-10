/*
  # Add test data for super admin role
  
  1. Test Data
    - Super admin user with test credentials
    - Role settings for super admin dashboard
    - Sample system metrics and activity data
*/

-- Insert test super admin user if not exists
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
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
  crypt('admin123', gen_salt('bf')),
  now(),
  jsonb_build_object(
    'name', 'Super Admin',
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

-- Update role settings for super admin with test data
INSERT INTO role_settings (role_key, settings) VALUES
('super_admin', jsonb_build_object(
  'defaultView', 'dashboard',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'systemAlerts', true,
    'userActivity', true,
    'securityAlerts', true
  ),
  'reports', ARRAY[
    'system_health',
    'user_activity',
    'audit_logs',
    'security_logs',
    'performance_metrics'
  ],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'totalUsers',
      'activeUsers',
      'systemHealth',
      'errorRate',
      'storageUsage',
      'apiRequests'
    ],
    'charts', ARRAY[
      'userGrowth',
      'systemMetrics',
      'errorDistribution',
      'resourceUsage',
      'apiPerformance'
    ],
    'recentActivities', true,
    'notifications', true,
    'auditLog', true,
    'systemMonitoring', true,
    'userManagement', true,
    'backupStatus', true
  ),
  'systemMetrics', jsonb_build_object(
    'cpuUsage', 45,
    'memoryUsage', 62,
    'diskUsage', 58,
    'networkLatency', 24,
    'errorRate', 0.5,
    'uptime', 99.99
  ),
  'testData', jsonb_build_object(
    'totalUsers', 1250,
    'activeUsers', 850,
    'newUsersToday', 25,
    'totalSchools', 45,
    'totalTeachers', 320,
    'totalStudents', 8500,
    'storageUsed', '2.1 TB',
    'backupStatus', 'completed',
    'lastBackup', now() - interval '2 hours',
    'systemAlerts', ARRAY[
      'Storage usage approaching 80% threshold',
      'New security patch available',
      'Backup completed successfully'
    ],
    'recentActivities', ARRAY[
      'User account created: teacher@school.com',
      'New school onboarded: Global Academy',
      'System backup completed',
      'Security scan completed'
    ]
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();