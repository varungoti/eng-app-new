-- Add test data for admin roles
INSERT INTO role_settings (role_key, settings) VALUES
('admin', jsonb_build_object(
  'defaultView', 'dashboard',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'systemAlerts', true,
    'companyUpdates', true,
    'employeeAlerts', true
  ),
  'reports', ARRAY[
    'company_performance',
    'employee_metrics',
    'financial_reports',
    'department_analytics',
    'growth_metrics'
  ],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'totalRevenue',
      'employeeCount',
      'departmentMetrics',
      'growthRate'
    ],
    'charts', ARRAY[
      'revenueGrowth',
      'employeePerformance',
      'departmentEfficiency',
      'costAnalysis'
    ],
    'recentActivities', true,
    'companyMetrics', true,
    'employeeManagement', true
  ),
  'testData', jsonb_build_object(
    'companyMetrics', jsonb_build_object(
      'totalRevenue', 1250000,
      'revenueGrowth', 15.5,
      'operatingCosts', 850000,
      'profitMargin', 32,
      'employeeCount', 150,
      'departmentCount', 8,
      'activeProjects', 25
    ),
    'departmentMetrics', jsonb_build_array(
      jsonb_build_object(
        'name', 'Sales',
        'headcount', 35,
        'performance', 92,
        'budget', 250000
      ),
      jsonb_build_object(
        'name', 'Technology',
        'headcount', 45,
        'performance', 88,
        'budget', 350000
      ),
      jsonb_build_object(
        'name', 'Content',
        'headcount', 30,
        'performance', 90,
        'budget', 200000
      ),
      jsonb_build_object(
        'name', 'Operations',
        'headcount', 40,
        'performance', 85,
        'budget', 300000
      )
    ),
    'recentActivities', ARRAY[
      'New department budget approved',
      'Quarterly performance review completed',
      'Employee training program launched',
      'New hiring plan approved'
    ],
    'keyProjects', jsonb_build_array(
      jsonb_build_object(
        'name', 'Digital Transformation',
        'progress', 65,
        'status', 'on_track',
        'budget', 500000
      ),
      jsonb_build_object(
        'name', 'Market Expansion',
        'progress', 40,
        'status', 'in_progress',
        'budget', 750000
      ),
      jsonb_build_object(
        'name', 'Employee Development',
        'progress', 80,
        'status', 'on_track',
        'budget', 300000
      )
    ),
    'financialMetrics', jsonb_build_object(
      'quarterlyRevenue', 450000,
      'yearlyGrowth', 25,
      'operatingExpenses', 280000,
      'profitability', 38
    )
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();