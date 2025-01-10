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
  ('International Grammar School', 'Rachel Chen', 'rchen@igs.edu', '555-0501', 'qualified', 'conference', 350000, 75, CURRENT_DATE + INTERVAL '45 days', 'Interested in full curriculum implementation with custom content'),
  ('City Montessori Academy', 'Marcus Thompson', 'mthompson@citymontessori.edu', '555-0502', 'proposal', 'referral', 280000, 85, CURRENT_DATE + INTERVAL '30 days', 'Proposal for comprehensive language program'),
  ('Sunshine Valley School', 'Diana Patel', 'dpatel@sunshinevalley.edu', '555-0503', 'negotiation', 'website', 420000, 90, CURRENT_DATE + INTERVAL '15 days', 'Final stage negotiations for multi-campus deployment'),
  ('Progressive Learning Center', 'James Wilson', 'jwilson@plc.edu', '555-0504', 'contacted', 'marketing', 180000, 40, CURRENT_DATE + INTERVAL '60 days', 'Initial demo completed, awaiting feedback'),
  ('Elite Prep Institute', 'Sophia Rodriguez', 'srodriguez@eliteprep.edu', '555-0505', 'new', 'linkedin', 250000, 25, CURRENT_DATE + INTERVAL '90 days', 'Expressed interest in language learning platform');

-- Add detailed sales activities
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
  'Executive Presentation',
  'Presented full platform capabilities to board members',
  'completed',
  CURRENT_TIMESTAMP - INTERVAL '3 days',
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)
FROM sales_leads
WHERE company_name = 'International Grammar School';

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
  'Technical Requirements Review',
  'Detailed discussion of integration requirements and customization options',
  'completed',
  CURRENT_TIMESTAMP - INTERVAL '2 days',
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)
FROM sales_leads
WHERE company_name = 'City Montessori Academy';

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
  'email',
  'Proposal Follow-up',
  'Sent additional information about implementation timeline',
  'completed',
  CURRENT_TIMESTAMP - INTERVAL '1 day',
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)
FROM sales_leads
WHERE company_name = 'Sunshine Valley School';

-- Add comprehensive sales opportunities
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
  'Enterprise Language Learning Solution',
  'proposal',
  350000,
  CURRENT_DATE + INTERVAL '45 days',
  75,
  'Board presentation scheduled for next week',
  'Traditional language schools',
  'Complete platform solution including custom content development and teacher training'
FROM sales_leads
WHERE company_name = 'International Grammar School';

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
  'Comprehensive Language Program',
  'negotiation',
  280000,
  CURRENT_DATE + INTERVAL '30 days',
  85,
  'Contract review meeting',
  'Online learning platforms',
  'Tailored solution for Montessori methodology integration'
FROM sales_leads
WHERE company_name = 'City Montessori Academy';

-- Add detailed contact information
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
  'Rachel Chen',
  'Academic Director',
  'rchen@igs.edu',
  '555-0501',
  true,
  'Academic Affairs',
  'Key decision maker for curriculum matters, prefers morning meetings'
FROM sales_leads
WHERE company_name = 'International Grammar School';

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
  'Marcus Thompson',
  'Head of Languages',
  'mthompson@citymontessori.edu',
  '555-0502',
  true,
  'Language Department',
  'Technical champion, interested in methodology integration'
FROM sales_leads
WHERE company_name = 'City Montessori Academy';

-- Add secondary contacts
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
  'Sarah Lee',
  'IT Director',
  'slee@igs.edu',
  '555-0506',
  false,
  'IT',
  'Technical decision maker, focused on integration capabilities'
FROM sales_leads
WHERE company_name = 'International Grammar School';

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
  'John Davis',
  'Finance Manager',
  'jdavis@citymontessori.edu',
  '555-0507',
  false,
  'Finance',
  'Budget approval authority, requires detailed ROI analysis'
FROM sales_leads
WHERE company_name = 'City Montessori Academy';