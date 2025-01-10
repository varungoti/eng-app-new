-- Update role settings for Sales Lead and Content Editor
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
    'totalLeads', 245,
    'qualifiedLeads', 128,
    'teamPerformance', 94,
    'conversionRate', 32,
    'pipelineValue', 1480000,
    'metrics', jsonb_build_object(
      'leadResponse', 85,
      'qualificationRate', 92,
      'proposalWinRate', 78,
      'avgDealSize', 295000
    ),
    'leadsTrend', jsonb_build_array(
      jsonb_build_object('month', 'Jan', 'value', 150),
      jsonb_build_object('month', 'Feb', 'value', 180),
      jsonb_build_object('month', 'Mar', 'value', 210),
      jsonb_build_object('month', 'Apr', 'value', 245),
      jsonb_build_object('month', 'May', 'value', 280),
      jsonb_build_object('month', 'Jun', 'value', 320)
    ),
    'teamMetrics', jsonb_build_array(
      jsonb_build_object('name', 'John', 'deals', 12, 'value', 180000),
      jsonb_build_object('name', 'Sarah', 'deals', 15, 'value', 225000),
      jsonb_build_object('name', 'Mike', 'deals', 10, 'value', 150000),
      jsonb_build_object('name', 'Lisa', 'deals', 14, 'value', 210000)
    )
  )
)),
('content_editor', jsonb_build_object(
  'defaultView', 'content',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'contentUpdates', true,
    'reviewRequests', true,
    'deadlineAlerts', true
  ),
  'reports', ARRAY['content_metrics', 'review_status', 'content_quality'],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'contentCreated',
      'pendingReviews',
      'contentQuality',
      'userEngagement'
    ],
    'charts', ARRAY[
      'contentProgress',
      'qualityMetrics',
      'userFeedback'
    ],
    'recentActivities', true,
    'contentOverview', true
  ),
  'testData', jsonb_build_object(
    'contentCreated', 150,
    'pendingReviews', 12,
    'contentQuality', 92,
    'userEngagement', 85,
    'contentMetrics', jsonb_build_object(
      'lessonsCreated', 45,
      'exercisesCreated', 180,
      'mediaUploaded', 95,
      'reviewsCompleted', 78
    ),
    'recentActivities', ARRAY[
      'New lesson created: Basic Greetings',
      'Content review completed: Numbers 1-10',
      'Feedback received on: Family Members',
      'Updated content: Colors and Shapes'
    ],
    'upcomingDeadlines', ARRAY[
      'Review Grammar Module - Due Tomorrow',
      'Create Vocabulary Exercises - Due in 3 days',
      'Update Speaking Activities - Due next week'
    ]
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();