-- Update role settings for Sales Lead and Content Editor with complete dashboard configurations
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
    'teamOverview', true,
    'widgets', jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'stats',
        'title', 'Sales Overview',
        'config', jsonb_build_object(
          'metrics', ARRAY['totalLeads', 'qualifiedLeads', 'conversionRate', 'pipelineValue']
        ),
        'position', jsonb_build_object('x', 0, 'y', 0, 'w', 6, 'h', 2)
      ),
      jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'chart',
        'title', 'Pipeline Trend',
        'config', jsonb_build_object(
          'type', 'line',
          'metric', 'pipelineValue'
        ),
        'position', jsonb_build_object('x', 0, 'y', 2, 'w', 6, 'h', 4)
      ),
      jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'list',
        'title', 'Recent Activities',
        'config', jsonb_build_object(
          'type', 'activities',
          'limit', 5
        ),
        'position', jsonb_build_object('x', 6, 'y', 0, 'w', 6, 'h', 6)
      )
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
    'contentOverview', true,
    'widgets', jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'stats',
        'title', 'Content Overview',
        'config', jsonb_build_object(
          'metrics', ARRAY['contentCreated', 'pendingReviews', 'contentQuality', 'userEngagement']
        ),
        'position', jsonb_build_object('x', 0, 'y', 0, 'w', 6, 'h', 2)
      ),
      jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'chart',
        'title', 'Content Quality Metrics',
        'config', jsonb_build_object(
          'type', 'bar',
          'metric', 'qualityScores'
        ),
        'position', jsonb_build_object('x', 0, 'y', 2, 'w', 6, 'h', 4)
      ),
      jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'list',
        'title', 'Recent Updates',
        'config', jsonb_build_object(
          'type', 'contentUpdates',
          'limit', 5
        ),
        'position', jsonb_build_object('x', 6, 'y', 0, 'w', 6, 'h', 6)
      )
    )
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();