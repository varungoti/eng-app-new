-- Update role settings for Content Editor and Sales Lead with improved permissions
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
  ),
  'permissions', jsonb_build_object(
    'content', true,
    'schools', false,
    'staff', false,
    'schedule', false,
    'settings', false,
    'sales', false,
    'accounts', false,
    'reports', true,
    'create', true,
    'edit', true,
    'delete', false,
    'approve', false,
    'view', true
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
  ),
  'permissions', jsonb_build_object(
    'content', false,
    'schools', true,
    'staff', false,
    'schedule', false,
    'settings', false,
    'sales', true,
    'accounts', false,
    'reports', true,
    'create', true,
    'edit', true,
    'delete', false,
    'approve', true,
    'view', true
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();

-- Create function to validate role permissions
CREATE OR REPLACE FUNCTION validate_role_permissions()
RETURNS trigger AS $$
BEGIN
  -- Ensure settings contains permissions object
  IF NOT (NEW.settings ? 'permissions') THEN
    RAISE EXCEPTION 'Role settings must contain permissions object';
  END IF;

  -- Ensure required permission fields exist
  IF NOT (
    NEW.settings->'permissions' ? 'content' AND
    NEW.settings->'permissions' ? 'schools' AND
    NEW.settings->'permissions' ? 'staff' AND
    NEW.settings->'permissions' ? 'schedule' AND
    NEW.settings->'permissions' ? 'settings' AND
    NEW.settings->'permissions' ? 'sales' AND
    NEW.settings->'permissions' ? 'accounts' AND
    NEW.settings->'permissions' ? 'reports' AND
    NEW.settings->'permissions' ? 'create' AND
    NEW.settings->'permissions' ? 'edit' AND
    NEW.settings->'permissions' ? 'delete' AND
    NEW.settings->'permissions' ? 'approve' AND
    NEW.settings->'permissions' ? 'view'
  ) THEN
    RAISE EXCEPTION 'Missing required permission fields';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for role settings validation
DROP TRIGGER IF EXISTS validate_role_settings ON role_settings;
CREATE TRIGGER validate_role_settings
  BEFORE INSERT OR UPDATE ON role_settings
  FOR EACH ROW
  EXECUTE FUNCTION validate_role_permissions();