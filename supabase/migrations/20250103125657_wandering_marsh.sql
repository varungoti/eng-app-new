-- Add test data for sales leads with comprehensive metrics
INSERT INTO sales_leads (
  company_name,
  contact_name,
  email,
  phone,
  status,
  source,
  estimated_value,
  probability,
  expected_close_date,
  notes
) VALUES
  ('Elite International School', 'David Chen', 'dchen@eliteschool.edu', '555-0601', 'qualified', 'referral', 450000, 75, CURRENT_DATE + INTERVAL '30 days', 'Multi-campus implementation opportunity'),
  ('Smart Kids Academy', 'Emma Watson', 'ewatson@smartkids.edu', '555-0602', 'proposal', 'conference', 280000, 85, CURRENT_DATE + INTERVAL '15 days', 'Interested in full platform rollout'),
  ('Future Leaders Institute', 'Michael Brown', 'mbrown@futureleaders.edu', '555-0603', 'negotiation', 'website', 350000, 90, CURRENT_DATE + INTERVAL '7 days', 'Contract review in progress'),
  ('Bright Horizons School', 'Sarah Miller', 'smiller@brighthorizons.edu', '555-0604', 'qualified', 'marketing', 220000, 65, CURRENT_DATE + INTERVAL '45 days', 'Demo scheduled for next week'),
  ('Global Education Center', 'James Wilson', 'jwilson@globaledu.com', '555-0605', 'contacted', 'linkedin', 180000, 40, CURRENT_DATE + INTERVAL '60 days', 'Initial requirements gathering');

-- Add detailed sales activities
INSERT INTO sales_activities (
  lead_id,
  type,
  subject,
  description,
  status,
  performed_by
)
SELECT 
  id,
  'meeting',
  'Platform Demonstration',
  'Comprehensive demo of all platform features',
  'completed',
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)
FROM sales_leads
WHERE company_name = 'Elite International School';

INSERT INTO sales_activities (
  lead_id,
  type,
  subject,
  description,
  status,
  performed_by
)
SELECT 
  id,
  'call',
  'Proposal Discussion',
  'Reviewed proposal details and pricing structure',
  'completed',
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)
FROM sales_leads
WHERE company_name = 'Smart Kids Academy';

-- Add sales opportunities
INSERT INTO sales_opportunities (
  lead_id,
  name,
  stage,
  amount,
  probability,
  next_step,
  competition,
  notes
)
SELECT 
  id,
  'Enterprise Solution Package',
  'proposal',
  450000,
  75,
  'Executive presentation',
  'Traditional providers',
  'Customized solution with advanced analytics'
FROM sales_leads
WHERE company_name = 'Elite International School';

INSERT INTO sales_opportunities (
  lead_id,
  name,
  stage,
  amount,
  probability,
  next_step,
  competition,
  notes
)
SELECT 
  id,
  'Complete Learning Platform',
  'negotiation',
  280000,
  85,
  'Contract finalization',
  'Online learning platforms',
  'Full platform implementation with training'
FROM sales_leads
WHERE company_name = 'Smart Kids Academy';

-- Update role settings with comprehensive test data
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
    ),
    'conversionFunnel', jsonb_build_array(
      jsonb_build_object('stage', 'Leads', 'count', 245),
      jsonb_build_object('stage', 'Qualified', 'count', 128),
      jsonb_build_object('stage', 'Proposal', 'count', 85),
      jsonb_build_object('stage', 'Negotiation', 'count', 42),
      jsonb_build_object('stage', 'Closed', 'count', 28)
    ),
    'recentActivities', jsonb_build_array(
      'New lead qualified: International School of Excellence',
      'Closed deal with Premier Academy - $250,000',
      'Proposal sent to Global Learning Institute',
      'Demo scheduled with Future Education Center'
    )
  )
))
ON CONFLICT (role_key) DO UPDATE SET
  settings = EXCLUDED.settings,
  updated_at = now();