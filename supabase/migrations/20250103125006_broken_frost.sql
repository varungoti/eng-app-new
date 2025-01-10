-- Add test data for sales leads
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
  ('Premier International School', 'Jennifer Adams', 'jadams@premier.edu', '555-0401', 'qualified', 'referral', 250000, 80, CURRENT_DATE + INTERVAL '30 days', 'Interested in complete platform rollout'),
  ('Bright Minds Academy', 'Thomas Wright', 'twright@brightminds.edu', '555-0402', 'proposal', 'website', 180000, 75, CURRENT_DATE + INTERVAL '45 days', 'Custom implementation requested'),
  ('Excellence Education Center', 'Maria Garcia', 'mgarcia@excellence.edu', '555-0403', 'negotiation', 'conference', 320000, 90, CURRENT_DATE + INTERVAL '15 days', 'Final contract negotiations'),
  ('Modern Learning Institute', 'Richard Lee', 'rlee@modernlearning.edu', '555-0404', 'contacted', 'linkedin', 150000, 45, CURRENT_DATE + INTERVAL '60 days', 'Follow-up demo scheduled'),
  ('Knowledge Hub', 'Amanda Foster', 'afoster@khub.edu', '555-0405', 'new', 'marketing', 200000, 30, CURRENT_DATE + INTERVAL '90 days', 'Initial contact made');

-- Add test sales activities
INSERT INTO sales_activities (
  lead_id,
  type,
  subject,
  description,
  status,
  due_date,
  performed_by
)
SELECT 
  id,
  'meeting',
  'Platform Demo',
  'Comprehensive platform demonstration and Q&A session',
  'completed',
  CURRENT_TIMESTAMP - INTERVAL '2 days',
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)
FROM sales_leads
WHERE company_name = 'Premier International School';

INSERT INTO sales_activities (
  lead_id,
  type,
  subject,
  description,
  status,
  due_date,
  performed_by
)
SELECT 
  id,
  'call',
  'Requirements Discussion',
  'Detailed discussion of implementation requirements and timeline',
  'completed',
  CURRENT_TIMESTAMP - INTERVAL '1 day',
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)
FROM sales_leads
WHERE company_name = 'Bright Minds Academy';

-- Add test sales opportunities
INSERT INTO sales_opportunities (
  lead_id,
  name,
  stage,
  amount,
  close_date,
  probability,
  next_step,
  competition,
  notes
)
SELECT 
  id,
  'Premium Implementation Package',
  'proposal',
  250000,
  CURRENT_DATE + INTERVAL '30 days',
  80,
  'Contract review meeting',
  'Legacy Provider',
  'Custom implementation with extended support and training'
FROM sales_leads
WHERE company_name = 'Premier International School';

INSERT INTO sales_opportunities (
  lead_id,
  name,
  stage,
  amount,
  close_date,
  probability,
  next_step,
  competition,
  notes
)
SELECT 
  id,
  'Advanced Learning Suite',
  'negotiation',
  180000,
  CURRENT_DATE + INTERVAL '45 days',
  75,
  'Final proposal presentation',
  'None',
  'Comprehensive learning management system with analytics'
FROM sales_leads
WHERE company_name = 'Bright Minds Academy';

-- Add test sales contacts
INSERT INTO sales_contacts (
  lead_id,
  name,
  title,
  email,
  phone,
  is_primary,
  department,
  notes
)
SELECT 
  id,
  'Jennifer Adams',
  'Director of Operations',
  'jadams@premier.edu',
  '555-0401',
  true,
  'Operations',
  'Key decision maker, prefers email communication'
FROM sales_leads
WHERE company_name = 'Premier International School';

INSERT INTO sales_contacts (
  lead_id,
  name,
  title,
  email,
  phone,
  is_primary,
  department,
  notes
)
SELECT 
  id,
  'Thomas Wright',
  'Technology Director',
  'twright@brightminds.edu',
  '555-0402',
  true,
  'IT',
  'Technical evaluator, interested in integration capabilities'
FROM sales_leads
WHERE company_name = 'Bright Minds Academy';