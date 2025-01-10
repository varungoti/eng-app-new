-- Add content_head role settings
INSERT INTO role_settings (role_key, settings) VALUES
  ('content_head', jsonb_build_object(
    'defaultView', 'content',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'contentUpdates', true,
      'teamPerformance', true
    ),
    'reports', ARRAY['content_performance', 'team_progress', 'curriculum_coverage'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY[
        'totalContent',
        'activeTeachers',
        'contentUsage',
        'studentEngagement'
      ],
      'charts', ARRAY[
        'contentProgress',
        'teacherPerformance',
        'studentAchievement'
      ],
      'recentUpdates', true,
      'teamActivities', true,
      'curriculumOverview', true
    )
  ))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();