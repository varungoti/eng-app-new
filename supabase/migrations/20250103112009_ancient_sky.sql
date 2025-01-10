-- Add test data for all roles
INSERT INTO role_settings (role_key, settings) VALUES
('technical_head', jsonb_build_object(
  'defaultView', 'infrastructure',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'systemAlerts', true
  ),
  'reports', ARRAY['system_health', 'infrastructure_status', 'security_logs'],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY['systemUptime', 'activeServers', 'incidents', 'backups'],
    'charts', ARRAY['serverLoad', 'networkTraffic', 'errorRates'],
    'recentActivities', true
  ),
  'testData', jsonb_build_object(
    'systemUptime', 99.99,
    'activeServers', 24,
    'totalServers', 24,
    'databaseHealth', 'Good',
    'responseTime', 45,
    'activeIncidents', 0,
    'systemMetrics', jsonb_build_object(
      'cpuUsage', 45,
      'memoryUsage', 62,
      'diskUsage', 58,
      'networkBandwidth', 35
    ),
    'recentAlerts', ARRAY[
      'Database backup completed successfully',
      'Server maintenance scheduled for next week',
      'SSL certificates renewed',
      'Security patches applied to all servers'
    ]
  )
)),
('developer', jsonb_build_object(
  'defaultView', 'development',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'codeReviews', true
  ),
  'reports', ARRAY['code_quality', 'test_coverage', 'sprint_progress'],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY['openPRs', 'activeIssues', 'codeCoverage', 'buildStatus'],
    'charts', ARRAY['commitActivity', 'testResults', 'codeQuality'],
    'recentActivities', true
  ),
  'testData', jsonb_build_object(
    'openPRs', 12,
    'needsReview', 4,
    'activeIssues', 8,
    'highPriorityIssues', 3,
    'codeCoverage', 87,
    'coverageChange', 2,
    'buildStatus', 'Passing',
    'lastBuild', '5m ago',
    'sprintTasks', jsonb_build_array(
      jsonb_build_object(
        'name', 'Feature: User Authentication',
        'progress', 75,
        'status', 'in_progress'
      ),
      jsonb_build_object(
        'name', 'Bug Fix: Dashboard Loading',
        'progress', 90,
        'status', 'review'
      ),
      jsonb_build_object(
        'name', 'API Integration',
        'progress', 45,
        'status', 'in_progress'
      ),
      jsonb_build_object(
        'name', 'Unit Tests',
        'progress', 60,
        'status', 'in_progress'
      )
    ),
    'codeMetrics', jsonb_build_object(
      'coverage', 87,
      'passRate', 95,
      'duplication', 12,
      'technicalDebt', 24
    )
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();