-- Add comprehensive role settings for all roles
INSERT INTO role_settings (role_key, settings) VALUES
('technical_head', jsonb_build_object(
  'defaultView', 'infrastructure',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'systemAlerts', true,
    'securityAlerts', true,
    'performanceAlerts', true
  ),
  'reports', ARRAY['system_health', 'infrastructure_status', 'security_logs'],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'systemUptime',
      'activeServers',
      'incidents',
      'backups'
    ],
    'charts', ARRAY[
      'serverLoad',
      'networkTraffic',
      'errorRates'
    ],
    'recentActivities', true,
    'systemMonitoring', true
  )
)),
('developer', jsonb_build_object(
  'defaultView', 'development',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'codeReviews', true,
    'buildAlerts', true,
    'deploymentAlerts', true
  ),
  'reports', ARRAY['code_quality', 'test_coverage', 'sprint_progress'],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'openPRs',
      'activeIssues',
      'codeCoverage',
      'buildStatus'
    ],
    'charts', ARRAY[
      'commitActivity',
      'testResults',
      'codeQuality'
    ],
    'recentActivities', true,
    'codeMetrics', true
  )
)),
('sales_lead', jsonb_build_object(
  'defaultView', 'sales',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'leadUpdates', true,
    'teamPerformance', true
  ),
  'reports', ARRAY['pipeline', 'team_leads', 'conversion_rates'],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'totalLeads',
      'qualifiedLeads',
      'teamPerformance',
      'conversionRate'
    ],
    'charts', ARRAY[
      'leadsTrend',
      'teamMetrics',
      'conversionFunnel'
    ],
    'recentActivities', true,
    'teamOverview', true
  )
)),
('accounts_executive', jsonb_build_object(
  'defaultView', 'finance',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'paymentAlerts', true,
    'invoiceAlerts', true
  ),
  'reports', ARRAY['transactions', 'payments', 'invoices'],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'pendingPayments',
      'processedInvoices',
      'outstandingAmount',
      'dailyTransactions'
    ],
    'charts', ARRAY[
      'paymentTrends',
      'invoiceStatus',
      'cashFlow'
    ],
    'recentActivities', true,
    'transactionLog', true
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();