-- Add content_editor role settings
INSERT INTO role_settings (role_key, settings) VALUES
('content_editor', jsonb_build_object(
  'defaultView', 'content',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'contentUpdates', true,
    'reviewRequests', true
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
    'recentActivities', ARRAY[
      'New lesson created: Basic Greetings',
      'Content review completed: Numbers 1-10',
      'Feedback received on: Family Members',
      'Updated content: Colors and Shapes'
    ]
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();