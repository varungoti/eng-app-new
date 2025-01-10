-- Drop and recreate role_settings table with proper structure
DROP TABLE IF EXISTS role_settings CASCADE;

CREATE TABLE role_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_key text NOT NULL UNIQUE,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE role_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
  ON role_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable write access for admins"
  ON role_settings FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('super_admin', 'admin'));

-- Insert default settings for all roles
INSERT INTO role_settings (role_key, settings) VALUES
  ('admin', jsonb_build_object(
    'defaultView', 'dashboard',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'systemAlerts', true
    ),
    'reports', ARRAY['system_health', 'user_activity', 'audit_logs'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalUsers', 'activeUsers', 'systemHealth', 'errorRate'],
      'charts', ARRAY['userGrowth', 'systemMetrics', 'errorDistribution'],
      'recentActivities', true,
      'notifications', true,
      'auditLog', true
    )
  )),
  ('user', jsonb_build_object(
    'defaultView', 'dashboard',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true
    ),
    'reports', ARRAY['my_activity'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalTasks', 'completedTasks', 'upcomingDeadlines'],
      'charts', ARRAY['activityTimeline', 'taskDistribution'],
      'recentActivities', true,
      'notifications', true
    )
  )),
  ('super_admin', jsonb_build_object(
    'defaultView', 'dashboard',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'systemAlerts', true
    ),
    'reports', ARRAY['system_health', 'user_activity', 'audit_logs'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalUsers', 'activeUsers', 'systemHealth', 'errorRate'],
      'charts', ARRAY['userGrowth', 'systemMetrics', 'errorDistribution'],
      'recentActivities', true,
      'notifications', true,
      'auditLog', true
    )
  )),
  ('sales_head', jsonb_build_object(
    'defaultView', 'pipeline',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'dealUpdates', true,
      'teamPerformance', true
    ),
    'reports', ARRAY['pipeline', 'forecast', 'team_performance', 'conversion_rates'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalRevenue', 'pipelineValue', 'wonDeals', 'conversionRate'],
      'charts', ARRAY['salesTrend', 'pipelineStages', 'teamPerformance'],
      'recentDeals', true,
      'teamActivities', true
    )
  )),
  ('sales_lead', jsonb_build_object(
    'defaultView', 'leads',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'leadUpdates', true,
      'teamPerformance', true
    ),
    'reports', ARRAY['pipeline', 'team_leads', 'conversion_rates'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalLeads', 'qualifiedLeads', 'teamPerformance', 'conversionRate'],
      'charts', ARRAY['leadsTrend', 'teamMetrics', 'conversionFunnel'],
      'recentLeads', true,
      'teamActivities', true
    )
  )),
  ('sales_executive', jsonb_build_object(
    'defaultView', 'leads',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'leadUpdates', true,
      'taskReminders', true
    ),
    'reports', ARRAY['my_leads', 'my_activities', 'my_performance'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['activeLeads', 'qualifiedLeads', 'meetings', 'proposals'],
      'charts', ARRAY['leadStatus', 'activityMetrics'],
      'upcomingTasks', true,
      'recentLeads', true
    )
  )),
  ('school_leader', jsonb_build_object(
    'defaultView', 'schools',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'schoolUpdates', true,
      'staffUpdates', true,
      'contentUpdates', true
    ),
    'reports', ARRAY['school_performance', 'staff_overview', 'content_usage'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalSchools', 'totalStudents', 'totalStaff', 'averagePerformance'],
      'charts', ARRAY['schoolPerformance', 'studentEnrollment', 'staffDistribution'],
      'recentUpdates', true,
      'alerts', true
    )
  )),
  ('school_principal', jsonb_build_object(
    'defaultView', 'dashboard',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'staffUpdates', true,
      'studentUpdates', true
    ),
    'reports', ARRAY['school_metrics', 'staff_attendance', 'class_progress'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalStudents', 'totalTeachers', 'attendance', 'performance'],
      'charts', ARRAY['attendanceTrend', 'performanceMetrics', 'classDistribution'],
      'upcomingEvents', true,
      'staffAttendance', true
    )
  )),
  ('teacher_head', jsonb_build_object(
    'defaultView', 'teachers',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'teacherUpdates', true,
      'contentUpdates', true
    ),
    'reports', ARRAY['teacher_performance', 'class_progress', 'content_effectiveness'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalTeachers', 'activeClasses', 'averageRating', 'contentUsage'],
      'charts', ARRAY['teacherPerformance', 'contentEffectiveness', 'studentProgress'],
      'teacherActivities', true,
      'contentUpdates', true
    )
  )),
  ('teacher', jsonb_build_object(
    'defaultView', 'classes',
    'notifications', jsonb_build_object(
      'email', true,
      'push', true,
      'classUpdates', true,
      'contentUpdates', true
    ),
    'reports', ARRAY['my_classes', 'student_progress', 'lesson_completion'],
    'dashboardConfig', jsonb_build_object(
      'quickStats', ARRAY['totalStudents', 'averageProgress', 'completedLessons', 'upcomingTests'],
      'charts', ARRAY['studentProgress', 'lessonCompletion', 'classPerformance'],
      'upcomingClasses', true,
      'studentActivities', true
    )
  ))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();