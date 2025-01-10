-- Update role settings for sales_lead with comprehensive test data
INSERT INTO role_settings (role_key, settings) VALUES
('sales_lead', jsonb_build_object(
  'defaultView', 'sales',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'leadUpdates', true,
    'teamPerformance', true,
    'dealAlerts', true
  ),
  'reports', ARRAY['pipeline', 'team_leads', 'conversion_rates', 'revenue_forecast'],
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
      'conversionFunnel',
      'revenueProjection'
    ],
    'recentActivities', true,
    'teamOverview', true
  ),
  'testData', jsonb_build_object(
    -- Quick Stats Data
    'totalLeads', 245,
    'qualifiedLeads', 128,
    'teamPerformance', 94,
    'conversionRate', 32,
    
    -- Chart Data
    'leadsTrend', jsonb_build_object(
      'labels', ARRAY['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      'data', ARRAY[150, 180, 210, 245, 280, 320]
    ),
    'teamMetrics', jsonb_build_object(
      'members', ARRAY['John', 'Sarah', 'Mike', 'Lisa'],
      'metrics', jsonb_build_object(
        'deals_closed', ARRAY[12, 15, 10, 14],
        'conversion_rates', ARRAY[35, 42, 38, 40],
        'revenue_generated', ARRAY[180000, 225000, 150000, 210000]
      )
    ),
    'conversionFunnel', jsonb_build_object(
      'stages', ARRAY['Leads', 'Qualified', 'Proposal', 'Negotiation', 'Closed'],
      'values', ARRAY[245, 128, 85, 42, 28]
    ),
    'revenueProjection', jsonb_build_object(
      'months', ARRAY['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      'projected', ARRAY[350000, 380000, 420000, 450000, 490000, 520000],
      'actual', ARRAY[360000, 385000, null, null, null, null]
    ),
    
    -- Recent Activities
    'recentActivities', jsonb_build_array(
      jsonb_build_object(
        'type', 'lead_qualification',
        'description', 'New lead qualified: International School of Excellence',
        'timestamp', CURRENT_TIMESTAMP - interval '2 hours'
      ),
      jsonb_build_object(
        'type', 'deal_closed',
        'description', 'Closed deal with Premier Academy - $250,000',
        'timestamp', CURRENT_TIMESTAMP - interval '1 day'
      ),
      jsonb_build_object(
        'type', 'proposal_sent',
        'description', 'Proposal sent to Global Learning Institute',
        'timestamp', CURRENT_TIMESTAMP - interval '2 days'
      ),
      jsonb_build_object(
        'type', 'meeting_scheduled',
        'description', 'Demo scheduled with Future Education Center',
        'timestamp', CURRENT_TIMESTAMP - interval '3 days'
      )
    ),
    
    -- Team Performance
    'teamPerformanceMetrics', jsonb_build_object(
      'overall_score', 94,
      'metrics', jsonb_build_object(
        'lead_response_time', 85,
        'qualification_accuracy', 92,
        'deal_closure_rate', 88,
        'customer_satisfaction', 95
      ),
      'top_performers', ARRAY[
        'Sarah Johnson - 15 deals closed',
        'Mike Chen - 12 deals closed',
        'Lisa Rodriguez - 10 deals closed'
      ]
    )
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();