-- Add test data for accounts role
INSERT INTO role_settings (role_key, settings) VALUES
('accounts_head', jsonb_build_object(
  'defaultView', 'finance',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'financialAlerts', true,
    'taxDeadlines', true,
    'budgetAlerts', true
  ),
  'reports', ARRAY[
    'financial_statements',
    'tax_reports',
    'budget_analysis',
    'cash_flow',
    'revenue_reports'
  ],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'totalRevenue',
      'totalExpenses',
      'netProfit',
      'cashFlow'
    ],
    'charts', ARRAY[
      'revenueExpense',
      'profitMargin',
      'cashFlowTrend',
      'budgetUtilization'
    ],
    'recentActivities', true,
    'financialMetrics', true
  ),
  'testData', jsonb_build_object(
    'revenue', 1250000,
    'expenses', 850000,
    'profit', 400000,
    'cashFlow', 350000,
    'pendingPayments', 75000,
    'outstandingInvoices', 120000,
    'recentTransactions', jsonb_build_array(
      jsonb_build_object(
        'type', 'income',
        'amount', 25000,
        'description', 'School fee payment'
      ),
      jsonb_build_object(
        'type', 'expense',
        'amount', 15000,
        'description', 'Equipment purchase'
      ),
      jsonb_build_object(
        'type', 'income',
        'amount', 30000,
        'description', 'Course registration'
      )
    ),
    'alerts', ARRAY[
      'Monthly financial report due',
      'Tax filing deadline approaching',
      'Budget review meeting scheduled'
    ]
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();