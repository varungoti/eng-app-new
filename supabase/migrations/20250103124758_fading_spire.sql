-- Add test data for content editor, sales lead, and school leader roles
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
)),
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
    'salesMetrics', jsonb_build_object(
      'monthlyRevenue', 450000,
      'averageDealSize', 35000,
      'pipelineValue', 1200000,
      'closedDeals', 18
    ),
    'teamMembers', ARRAY[
      'John Smith - Senior Sales Executive',
      'Mary Johnson - Sales Executive',
      'David Brown - Sales Executive',
      'Sarah Wilson - Sales Executive'
    ],
    'topDeals', ARRAY[
      'Global Academy - $150,000',
      'Future School - $120,000',
      'Smart Learning Center - $95,000'
    ]
  )
)),
('school_leader', jsonb_build_object(
  'defaultView', 'schools',
  'notifications', jsonb_build_object(
    'email', true,
    'push', true,
    'schoolUpdates', true,
    'staffUpdates', true,
    'performanceAlerts', true
  ),
  'reports', ARRAY['school_performance', 'staff_overview', 'student_progress', 'resource_utilization'],
  'dashboardConfig', jsonb_build_object(
    'quickStats', ARRAY[
      'totalSchools',
      'totalStudents',
      'totalStaff',
      'averagePerformance'
    ],
    'charts', ARRAY[
      'enrollmentTrend',
      'staffDistribution',
      'performanceMetrics',
      'resourceUtilization'
    ],
    'recentActivities', true,
    'schoolOverview', true
  ),
  'testData', jsonb_build_object(
    'totalSchools', 12,
    'totalStudents', 3600,
    'totalStaff', 280,
    'averagePerformance', 88,
    'schoolMetrics', jsonb_build_object(
      'activeSchools', 12,
      'totalClassrooms', 144,
      'studentTeacherRatio', '15:1',
      'resourceUtilization', 82
    ),
    'performanceMetrics', jsonb_build_object(
      'academicProgress', 86,
      'teacherEffectiveness', 92,
      'studentSatisfaction', 89,
      'parentSatisfaction', 87
    ),
    'recentUpdates', ARRAY[
      'New curriculum implemented at North Branch',
      'Staff training completed at Main Campus',
      'Parent-teacher meetings scheduled',
      'Resource allocation updated for Q2'
    ],
    'upcomingEvents', ARRAY[
      'Annual School Review - Next Week',
      'Staff Development Day - In 2 weeks',
      'Curriculum Planning Meeting - Tomorrow'
    ]
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();