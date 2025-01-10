-- Insert test sales leads if they don't exist
INSERT INTO sales_leads (company_name, contact_name, email, phone, status, estimated_value, probability)
SELECT 'Future School Inc', 'John Smith', 'john@futureschool.com', '555-0201', 'new', 50000, 60
WHERE NOT EXISTS (SELECT 1 FROM sales_leads WHERE company_name = 'Future School Inc');

INSERT INTO sales_leads (company_name, contact_name, email, phone, status, estimated_value, probability)
SELECT 'Education Plus', 'Mary Johnson', 'mary@eduplus.com', '555-0202', 'qualified', 75000, 80
WHERE NOT EXISTS (SELECT 1 FROM sales_leads WHERE company_name = 'Education Plus');

INSERT INTO sales_leads (company_name, contact_name, email, phone, status, estimated_value, probability)
SELECT 'Smart Learning', 'David Brown', 'david@smartlearn.com', '555-0203', 'proposal', 100000, 90
WHERE NOT EXISTS (SELECT 1 FROM sales_leads WHERE company_name = 'Smart Learning');

-- Insert test sales activities
INSERT INTO sales_activities (lead_id, type, subject, description)
SELECT 
  id,
  'call',
  'Initial Contact',
  'Discussed requirements'
FROM sales_leads
WHERE company_name = 'Future School Inc'
AND NOT EXISTS (
  SELECT 1 FROM sales_activities 
  WHERE lead_id = sales_leads.id AND subject = 'Initial Contact'
);

-- Insert test sales opportunities
INSERT INTO sales_opportunities (lead_id, name, stage, amount, probability)
SELECT 
  id,
  'Basic Package',
  'discovery',
  25000,
  40
FROM sales_leads
WHERE company_name = 'Future School Inc'
AND NOT EXISTS (
  SELECT 1 FROM sales_opportunities 
  WHERE lead_id = sales_leads.id AND name = 'Basic Package'
);

INSERT INTO sales_opportunities (lead_id, name, stage, amount, probability)
SELECT 
  id,
  'Premium Solution',
  'proposal',
  50000,
  70
FROM sales_leads
WHERE company_name = 'Education Plus'
AND NOT EXISTS (
  SELECT 1 FROM sales_opportunities 
  WHERE lead_id = sales_leads.id AND name = 'Premium Solution'
);