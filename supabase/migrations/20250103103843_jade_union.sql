-- Add more test schools with diverse characteristics
INSERT INTO schools (
  name,
  type,
  address,
  latitude,
  longitude,
  contact_number,
  email,
  status,
  capacity,
  principal_name,
  website,
  established_year,
  accreditation_status,
  facilities,
  operating_hours,
  social_media,
  emergency_contact,
  tax_id,
  license_number,
  student_count,
  staff_count,
  classroom_count,
  is_boarding,
  transportation_provided,
  curriculum_type,
  languages_offered,
  extracurricular_activities
) VALUES
  (
    'Global International School',
    'main',
    '789 Education Park, Mumbai',
    19.0760,
    72.8777,
    '022-555-0101',
    'info@globalschool.edu',
    'active',
    2000,
    'Dr. Rajesh Kumar',
    'www.globalschool.edu',
    1995,
    'Fully Accredited',
    '{"library": true, "sports_complex": true, "science_labs": 4, "computer_labs": 3, "auditorium": true, "cafeteria": true}',
    '{"monday": {"open": "07:30", "close": "16:30"}, "tuesday": {"open": "07:30", "close": "16:30"}, "wednesday": {"open": "07:30", "close": "16:30"}, "thursday": {"open": "07:30", "close": "16:30"}, "friday": {"open": "07:30", "close": "16:30"}}',
    '{"facebook": "globalschool", "instagram": "globalschool_edu", "twitter": "globalschool"}',
    '022-555-9999',
    'GSTIN123456789',
    'SCH2023-001',
    1850,
    120,
    60,
    true,
    true,
    ARRAY['CBSE', 'International'],
    ARRAY['English', 'Hindi', 'French'],
    ARRAY['Sports', 'Music', 'Dance', 'Robotics', 'Debate']
  ),
  (
    'New Age Academy',
    'branch',
    '456 Learning Road, Delhi',
    28.6139,
    77.2090,
    '011-555-0202',
    'contact@newageacademy.edu',
    'active',
    1500,
    'Mrs. Priya Sharma',
    'www.newageacademy.edu',
    2005,
    'Fully Accredited',
    '{"library": true, "sports_ground": true, "science_labs": 3, "computer_labs": 2, "auditorium": true}',
    '{"monday": {"open": "08:00", "close": "15:30"}, "tuesday": {"open": "08:00", "close": "15:30"}, "wednesday": {"open": "08:00", "close": "15:30"}, "thursday": {"open": "08:00", "close": "15:30"}, "friday": {"open": "08:00", "close": "15:30"}}',
    '{"facebook": "newageacademy", "instagram": "newage_academy"}',
    '011-555-8888',
    'GSTIN987654321',
    'SCH2023-002',
    1200,
    80,
    40,
    false,
    true,
    ARRAY['CBSE'],
    ARRAY['English', 'Hindi'],
    ARRAY['Sports', 'Art', 'Yoga']
  ),
  (
    'Future Kids School',
    'main',
    '123 Innovation Street, Bangalore',
    12.9716,
    77.5946,
    '080-555-0303',
    'info@futurekids.edu',
    'active',
    1200,
    'Dr. Anita Reddy',
    'www.futurekids.edu',
    2010,
    'Fully Accredited',
    '{"library": true, "maker_space": true, "science_labs": 2, "computer_labs": 3, "smart_classrooms": true}',
    '{"monday": {"open": "08:30", "close": "16:00"}, "tuesday": {"open": "08:30", "close": "16:00"}, "wednesday": {"open": "08:30", "close": "16:00"}, "thursday": {"open": "08:30", "close": "16:00"}, "friday": {"open": "08:30", "close": "16:00"}}',
    '{"facebook": "futurekids", "instagram": "futurekids_edu", "youtube": "FutureKidsEdu"}',
    '080-555-7777',
    'GSTIN456789123',
    'SCH2023-003',
    1000,
    70,
    35,
    false,
    true,
    ARRAY['ICSE', 'International'],
    ARRAY['English', 'Kannada', 'Spanish'],
    ARRAY['Coding', 'Robotics', 'Music', 'Sports']
  ),
  (
    'Heritage Public School',
    'main',
    '567 Culture Avenue, Chennai',
    13.0827,
    80.2707,
    '044-555-0404',
    'contact@heritageschool.edu',
    'active',
    1800,
    'Mr. Venkatesh Iyer',
    'www.heritageschool.edu',
    1985,
    'Fully Accredited',
    '{"library": true, "sports_complex": true, "science_labs": 3, "computer_labs": 2, "auditorium": true, "music_room": true}',
    '{"monday": {"open": "07:45", "close": "15:45"}, "tuesday": {"open": "07:45", "close": "15:45"}, "wednesday": {"open": "07:45", "close": "15:45"}, "thursday": {"open": "07:45", "close": "15:45"}, "friday": {"open": "07:45", "close": "15:45"}}',
    '{"facebook": "heritageschool", "instagram": "heritage_school"}',
    '044-555-6666',
    'GSTIN789123456',
    'SCH2023-004',
    1600,
    100,
    50,
    true,
    true,
    ARRAY['State Board', 'CBSE'],
    ARRAY['English', 'Tamil', 'Sanskrit'],
    ARRAY['Classical Dance', 'Music', 'Sports', 'Art']
  ),
  (
    'Digital Age School',
    'branch',
    '890 Tech Park, Hyderabad',
    17.3850,
    78.4867,
    '040-555-0505',
    'info@digitalage.edu',
    'active',
    1000,
    'Dr. Srinivas Rao',
    'www.digitalage.edu',
    2015,
    'Fully Accredited',
    '{"library": true, "innovation_lab": true, "science_labs": 2, "computer_labs": 4, "smart_classrooms": true}',
    '{"monday": {"open": "08:15", "close": "16:15"}, "tuesday": {"open": "08:15", "close": "16:15"}, "wednesday": {"open": "08:15", "close": "16:15"}, "thursday": {"open": "08:15", "close": "16:15"}, "friday": {"open": "08:15", "close": "16:15"}}',
    '{"facebook": "digitalage", "instagram": "digitalage_edu", "linkedin": "digital-age-school"}',
    '040-555-5555',
    'GSTIN321654987',
    'SCH2023-005',
    900,
    60,
    30,
    false,
    true,
    ARRAY['CBSE', 'International'],
    ARRAY['English', 'Telugu', 'French'],
    ARRAY['Coding', 'Robotics', 'AI Club', 'Sports']
  );

-- Associate schools with grades
INSERT INTO school_grades (school_id, grade_id)
SELECT s.id, g.id
FROM schools s
CROSS JOIN grades g
WHERE s.name IN (
  'Global International School',
  'New Age Academy',
  'Future Kids School',
  'Heritage Public School',
  'Digital Age School'
)
AND NOT EXISTS (
  SELECT 1 FROM school_grades sg 
  WHERE sg.school_id = s.id AND sg.grade_id = g.id
);

-- Add onboarding progress for new schools
INSERT INTO onboarding_progress (school_id, task_id, status, notes)
SELECT 
  s.id,
  t.id,
  CASE 
    WHEN random() < 0.6 THEN 'completed'
    WHEN random() < 0.8 THEN 'in_progress'
    ELSE 'pending'
  END,
  'Onboarding progress for ' || s.name || ' - ' || t.title
FROM schools s
CROSS JOIN onboarding_tasks t
WHERE s.name IN (
  'Global International School',
  'New Age Academy',
  'Future Kids School',
  'Heritage Public School',
  'Digital Age School'
)
AND NOT EXISTS (
  SELECT 1 FROM onboarding_progress op 
  WHERE op.school_id = s.id AND op.task_id = t.id
);

-- Add documents for new schools
INSERT INTO school_documents (
  school_id,
  type,
  name,
  url,
  status,
  notes,
  uploaded_by
)
SELECT 
  s.id,
  unnest(ARRAY['license', 'registration', 'tax', 'insurance']),
  s.name || ' - ' || unnest(ARRAY['Operating License', 'Registration Certificate', 'Tax Document', 'Insurance Certificate']),
  'https://example.com/documents/' || s.id || '/' || unnest(ARRAY['license.pdf', 'registration.pdf', 'tax.pdf', 'insurance.pdf']),
  CASE 
    WHEN random() < 0.7 THEN 'approved'
    WHEN random() < 0.9 THEN 'pending'
    ELSE 'rejected'
  END,
  'Document for ' || s.name,
  (SELECT id FROM auth.users LIMIT 1)
FROM schools s
WHERE s.name IN (
  'Global International School',
  'New Age Academy',
  'Future Kids School',
  'Heritage Public School',
  'Digital Age School'
);