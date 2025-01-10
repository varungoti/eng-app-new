-- Update role settings for Content Editor with complete dashboard configuration
INSERT INTO role_settings (role_key, settings) VALUES
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
          'metric', 'qualityScores',
          'data', jsonb_build_object(
            'labels', ARRAY['Grammar', 'Vocabulary', 'Pronunciation', 'Engagement'],
            'values', ARRAY[85, 92, 88, 90]
          )
        ),
        'position', jsonb_build_object('x', 0, 'y', 2, 'w', 6, 'h', 4)
      ),
      jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'list',
        'title', 'Recent Updates',
        'config', jsonb_build_object(
          'type', 'contentUpdates',
          'limit', 5,
          'showMetadata', true
        ),
        'position', jsonb_build_object('x', 6, 'y', 0, 'w', 6, 'h', 6)
      ),
      jsonb_build_object(
        'id', gen_random_uuid(),
        'type', 'stats',
        'title', 'Review Status',
        'config', jsonb_build_object(
          'metrics', ARRAY['pendingReviews', 'completedReviews', 'averageReviewTime']
        ),
        'position', jsonb_build_object('x', 6, 'y', 6, 'w', 6, 'h', 2)
      )
    )
  ),
  'testData', jsonb_build_object(
    'contentMetrics', jsonb_build_object(
      'contentCreated', 150,
      'pendingReviews', 12,
      'contentQuality', 92,
      'userEngagement', 85,
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
    ],
    'qualityMetrics', jsonb_build_object(
      'grammar', 85,
      'vocabulary', 92,
      'pronunciation', 88,
      'engagement', 90
    )
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();