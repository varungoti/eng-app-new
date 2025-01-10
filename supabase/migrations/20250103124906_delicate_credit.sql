-- Add test data for sales lead role
INSERT INTO sales_leads (
  company_name,
  contact_name,
  email,
  phone,
  status,
  estimated_value,
  probability,
  notes
) VALUES
  ('Enterprise Academy', 'Michael Chen', 'mchen@enterprise.edu', '555-0301', 'qualified', 200000, 75, 'Interested in full platform implementation'),
  ('Innovation School', 'Sarah Miller', 'sarah@innovation.edu', '555-0302', 'proposal', 150000, 85, 'Proposal review scheduled next week'),
  ('Global Learning Center', 'James Wilson', 'jwilson@globallearn.com', '555-0303', 'negotiation', 300000, 90, 'Final contract review in progress'),
  ('Tech Academy', 'Lisa Brown', 'lisa@techacademy.edu', '555-0304', 'new', 80000, 40, 'Initial meeting scheduled'),
  ('Future Education', 'Robert Taylor', 'robert@future-edu.com', '555-0305', 'contacted', 120000, 55, 'Follow-up call needed');

-- Add test sales activities
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
  'Initial Consultation',
  'Discussed platform requirements and pricing',
  'completed',
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)
FROM sales_leads
WHERE company_name = 'Enterprise Academy';

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
  'Follow-up Call',
  'Addressed questions about implementation timeline',
  'completed',
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1)
FROM sales_leads
WHERE company_name = 'Innovation School';

-- Add test sales opportunities
INSERT INTO sales_opportunities (
  lead_id,
  name,
  stage,
  amount,
  probability,
  next_step,
  notes
)
SELECT 
  id,
  'Enterprise Package',
  'proposal',
  200000,
  75,
  'Schedule final presentation',
  'Custom implementation with additional training modules'
FROM sales_leads
WHERE company_name = 'Enterprise Academy';

INSERT INTO sales_opportunities (
  lead_id,
  name,
  stage,
  amount,
  probability,
  next_step,
  notes
)
SELECT 
  id,
  'Standard Package',
  'negotiation',
  150000,
  85,
  'Review contract terms',
  'Standard implementation with 1-year support'
FROM sales_leads
WHERE company_name = 'Innovation School';

-- Add test sales contacts
INSERT INTO sales_contacts (
  lead_id,
  name,
  title,
  email,
  phone,
  is_primary,
  department
)
SELECT 
  id,
  'Michael Chen',
  'Director of Education',
  'mchen@enterprise.edu',
  '555-0301',
  true,
  'Administration'
FROM sales_leads
WHERE company_name = 'Enterprise Academy';

INSERT INTO sales_contacts (
  lead_id,
  name,
  title,
  email,
  phone,
  is_primary,
  department
)
SELECT 
  id,
  'Sarah Miller',
  'Principal',
  'sarah@innovation.edu',
  '555-0302',
  true,
  'Management'
FROM sales_leads
WHERE company_name = 'Innovation School';