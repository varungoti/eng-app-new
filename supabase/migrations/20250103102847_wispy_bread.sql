-- Insert test schools
INSERT INTO schools (name, type, address, latitude, longitude, contact_number, email, status, capacity, principal_name)
VALUES
  ('Main Academy', 'main', '123 Education St, City', 51.5074, -0.1278, '555-0100', 'main@academy.edu', 'active', 1000, 'Dr. Sarah Johnson'),
  ('North Branch', 'branch', '456 Learning Ave, City', 51.5204, -0.1298, '555-0101', 'north@academy.edu', 'active', 500, 'Prof. Michael Brown'),
  ('South Campus', 'branch', '789 Knowledge Rd, City', 51.4944, -0.1258, '555-0102', 'south@academy.edu', 'active', 750, 'Dr. Emily Wilson');

-- Insert test sales leads
INSERT INTO sales_leads (company_name, contact_name, email, phone, status, estimated_value, probability)
VALUES
  ('Future School Inc', 'John Smith', 'john@futureschool.com', '555-0201', 'new', 50000, 60),
  ('Education Plus', 'Mary Johnson', 'mary@eduplus.com', '555-0202', 'qualified', 75000, 80),
  ('Smart Learning', 'David Brown', 'david@smartlearn.com', '555-0203', 'proposal', 100000, 90);

-- Insert test sales activities
INSERT INTO sales_activities (lead_id, type, subject, description, performed_by)
VALUES
  ((SELECT id FROM sales_leads WHERE company_name = 'Future School Inc'), 'call', 'Initial Contact', 'Discussed requirements', (SELECT id FROM auth.users LIMIT 1)),
  ((SELECT id FROM sales_leads WHERE company_name = 'Education Plus'), 'meeting', 'Product Demo', 'Demonstrated platform features', (SELECT id FROM auth.users LIMIT 1)),
  ((SELECT id FROM sales_leads WHERE company_name = 'Smart Learning'), 'email', 'Proposal Follow-up', 'Sent additional information', (SELECT id FROM auth.users LIMIT 1));

-- Insert test sales opportunities
INSERT INTO sales_opportunities (lead_id, name, stage, amount, probability)
VALUES
  ((SELECT id FROM sales_leads WHERE company_name = 'Future School Inc'), 'Basic Package', 'discovery', 25000, 40),
  ((SELECT id FROM sales_leads WHERE company_name = 'Education Plus'), 'Premium Solution', 'proposal', 50000, 70),
  ((SELECT id FROM sales_leads WHERE company_name = 'Smart Learning'), 'Enterprise Deal', 'negotiation', 100000, 90);

-- Insert test content (grades, topics, etc. already added in previous migration)
INSERT INTO topics (grade_id, title, description, "order")
SELECT 
  (SELECT id FROM grades WHERE name = 'Grade 1'),
  'Advanced Communication',
  'Complex conversation scenarios',
  3
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE title = 'Advanced Communication');

-- Insert test sub-topics
INSERT INTO sub_topics (topic_id, title, description, "order")
SELECT 
  (SELECT id FROM topics WHERE title = 'Advanced Communication'),
  'Business Talk',
  'Professional communication skills',
  1
WHERE NOT EXISTS (SELECT 1 FROM sub_topics WHERE title = 'Business Talk');

-- Insert test lessons
INSERT INTO lessons (sub_topic_id, title, description, "order", teacher_script, teacher_prompt, sample_answer)
SELECT 
  (SELECT id FROM sub_topics WHERE title = 'Business Talk'),
  'Meeting Etiquette',
  'Learn proper business meeting behavior',
  1,
  'Guide students through common meeting scenarios',
  'Practice formal introductions and meeting participation',
  'Good morning everyone, shall we begin the meeting?'
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Meeting Etiquette');

-- Insert test exercises
INSERT INTO exercises (lesson_id, prompt, media_url, media_type, say_text)
SELECT 
  (SELECT id FROM lessons WHERE title = 'Meeting Etiquette'),
  'Practice starting a business meeting',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800',
  'image',
  'Welcome everyone, thank you for joining today''s meeting.'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE prompt = 'Practice starting a business meeting');

-- Insert school grades associations
INSERT INTO school_grades (school_id, grade_id)
SELECT s.id, g.id
FROM schools s
CROSS JOIN grades g
WHERE NOT EXISTS (
  SELECT 1 FROM school_grades sg 
  WHERE sg.school_id = s.id AND sg.grade_id = g.id
);

-- Insert onboarding progress for schools
INSERT INTO onboarding_progress (school_id, task_id, status, notes)
SELECT 
  s.id,
  t.id,
  CASE WHEN random() < 0.7 THEN 'completed' ELSE 'in_progress' END,
  'Progress note for ' || t.title
FROM schools s
CROSS JOIN onboarding_tasks t
WHERE NOT EXISTS (
  SELECT 1 FROM onboarding_progress op 
  WHERE op.school_id = s.id AND op.task_id = t.id
);

-- Insert school documents
INSERT INTO school_documents (school_id, type, name, url, status, uploaded_by)
SELECT 
  s.id,
  'license',
  s.name || ' Operating License',
  'https://example.com/license.pdf',
  'pending',
  (SELECT id FROM auth.users LIMIT 1)
FROM schools s
WHERE NOT EXISTS (
  SELECT 1 FROM school_documents sd 
  WHERE sd.school_id = s.id AND sd.type = 'license'
);