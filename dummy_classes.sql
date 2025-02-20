-- First, insert dummy grades if they don't exist
INSERT INTO grades (id, name, level) VALUES
('450e8400-e29b-41d4-a716-446655440001', 'PP1', 1),
('450e8400-e29b-41d4-a716-446655440002', 'PP2', 2),
('450e8400-e29b-41d4-a716-446655440003', 'Grade 1', 3),
('450e8400-e29b-41d4-a716-446655440004', 'Grade 2', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert dummy school if it doesn't exist
INSERT INTO schools (
    id, 
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
    school_type, 
    school_level,
    operating_hours,
    academic_calendar,
    grade_structure,
    academic_programs,
    assessment_system,
    class_size_limits
) VALUES (
    '350e8400-e29b-41d4-a716-446655440001',
    'Demo School',
    'main',
    '123 School Street',
    0,
    0,
    '1234567890',
    'school@example.com',
    'active',
    1000,
    'Principal Demo',
    'public'::school_category,
    'elementary'::school_level,
    '{"friday": {"open": "8:00 AM", "close": "3:00 PM"}, "monday": {"open": "8:00 AM", "close": "3:00 PM"}, "sunday": {"open": "Closed", "close": "Closed", "isHoliday": true}, "tuesday": {"open": "8:00 AM", "close": "3:00 PM"}, "saturday": {"open": "8:00 AM", "close": "12:00 PM"}, "thursday": {"open": "8:00 AM", "close": "3:00 PM"}, "wednesday": {"open": "8:00 AM", "close": "3:00 PM"}}'::jsonb,
    '{"terms": [], "events": [], "holidays": []}'::jsonb,
    '{"high": {"grades": [], "sections": []}, "middle": {"grades": [], "sections": []}, "elementary": {"grades": [], "sections": []}}'::jsonb,
    '{"gifted": false, "regular": true, "vocational": false, "specialNeeds": false}'::jsonb,
    '{"grading": "percentage", "passingScore": 40, "assessmentTypes": []}'::jsonb,
    '{"max": 30, "min": 15}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Insert dummy students with proper schema fields
INSERT INTO students (id, first_name, last_name, roll_number, school_id, grade_id, gender, date_of_birth, contact_number, email, guardian_name, guardian_contact) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'John', 'Doe', 'PP1-001', '350e8400-e29b-41d4-a716-446655440001', '450e8400-e29b-41d4-a716-446655440001', 'Male', '2018-01-01', '1234567890', 'parent1@example.com', 'Parent One', '9876543210'),
('660e8400-e29b-41d4-a716-446655440002', 'Jane', 'Smith', 'PP1-002', '350e8400-e29b-41d4-a716-446655440001', '450e8400-e29b-41d4-a716-446655440001', 'Female', '2018-02-15', '2345678901', 'parent2@example.com', 'Parent Two', '8765432109'),
('660e8400-e29b-41d4-a716-446655440003', 'Mike', 'Johnson', 'PP2-001', '350e8400-e29b-41d4-a716-446655440001', '450e8400-e29b-41d4-a716-446655440002', 'Male', '2017-06-20', '3456789012', 'parent3@example.com', 'Parent Three', '7654321098'),
('660e8400-e29b-41d4-a716-446655440004', 'Sarah', 'Williams', 'G1-001', '350e8400-e29b-41d4-a716-446655440001', '450e8400-e29b-41d4-a716-446655440003', 'Female', '2016-11-30', '4567890123', 'parent4@example.com', 'Parent Four', '6543210987'),
('660e8400-e29b-41d4-a716-446655440005', 'Tom', 'Brown', 'G2-001', '350e8400-e29b-41d4-a716-446655440001', '450e8400-e29b-41d4-a716-446655440004', 'Male', '2015-09-10', '5678901234', 'parent5@example.com', 'Parent Five', '5432109876')
ON CONFLICT (id) DO NOTHING;

-- Insert dummy classes with grade_id
INSERT INTO classes (id, name, description, grade_id, created_by, section) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'English PP1-A', 'Primary English Class for PP1', '450e8400-e29b-41d4-a716-446655440001', '39a4bf91-f52d-4996-aadd-a21a17cec9b4', 'Section A'),
('550e8400-e29b-41d4-a716-446655440001', 'English PP1-B', 'Primary English Class for PP1', '450e8400-e29b-41d4-a716-446655440001', '39a4bf91-f52d-4996-aadd-a21a17cec9b4', 'Section B'),
('550e8400-e29b-41d4-a716-446655440002', 'English PP2-A', 'Primary English Class for PP2', '450e8400-e29b-41d4-a716-446655440002', '39a4bf91-f52d-4996-aadd-a21a17cec9b4', 'Section A'),
('550e8400-e29b-41d4-a716-446655440003', 'English Grade 1-A', 'English Class for Grade 1', '450e8400-e29b-41d4-a716-446655440003', '39a4bf91-f52d-4996-aadd-a21a17cec9b4', 'Section A'),
('550e8400-e29b-41d4-a716-446655440004', 'English Grade 2-B', 'English Class for Grade 2', '450e8400-e29b-41d4-a716-446655440004', '39a4bf91-f52d-4996-aadd-a21a17cec9b4', 'Section B')
ON CONFLICT (id) DO NOTHING;

-- Assign students to classes through class_students junction table
INSERT INTO class_students (class_id, student_id, assigned_by) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440001', '39a4bf91-f52d-4996-aadd-a21a17cec9b4'),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440002', '39a4bf91-f52d-4996-aadd-a21a17cec9b4'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '39a4bf91-f52d-4996-aadd-a21a17cec9b4'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440004', '39a4bf91-f52d-4996-aadd-a21a17cec9b4'),
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', '39a4bf91-f52d-4996-aadd-a21a17cec9b4')
ON CONFLICT DO NOTHING;

-- Insert topics for each grade
INSERT INTO topics (id, title, description, grade_id, order_index) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Basic English', 'Foundational English concepts for PP1', '450e8400-e29b-41d4-a716-446655440001', 1),
('990e8400-e29b-41d4-a716-446655440002', 'Basic English', 'Foundational English concepts for PP2', '450e8400-e29b-41d4-a716-446655440002', 1),
('990e8400-e29b-41d4-a716-446655440003', 'Basic English', 'Foundational English concepts for Grade 1', '450e8400-e29b-41d4-a716-446655440003', 1),
('990e8400-e29b-41d4-a716-446655440004', 'Basic English', 'Foundational English concepts for Grade 2', '450e8400-e29b-41d4-a716-446655440004', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert subtopics for each topic
INSERT INTO subtopics (id, title, description, topic_id, order_index) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'Alphabets', 'Learning the English alphabet', '990e8400-e29b-41d4-a716-446655440001', 1),
('aa0e8400-e29b-41d4-a716-446655440002', 'Phonics', 'Basic phonics concepts', '990e8400-e29b-41d4-a716-446655440001', 2),
('aa0e8400-e29b-41d4-a716-446655440003', 'Simple Words', 'Basic word formation', '990e8400-e29b-41d4-a716-446655440002', 1),
('aa0e8400-e29b-41d4-a716-446655440004', 'Basic Sentences', 'Simple sentence construction', '990e8400-e29b-41d4-a716-446655440003', 1),
('aa0e8400-e29b-41d4-a716-446655440005', 'Reading', 'Basic reading skills', '990e8400-e29b-41d4-a716-446655440004', 1)
ON CONFLICT (id) DO NOTHING;

-- Insert dummy lessons with subtopic_id
INSERT INTO lessons (id, title, description, grade_id, topic_id, subtopic_id, status) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Introduction to Alphabets', 'Learning the English alphabet', '450e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440001', 'published'),
('880e8400-e29b-41d4-a716-446655440002', 'Phonics Basics', 'Introduction to phonics', '450e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440001', 'aa0e8400-e29b-41d4-a716-446655440002', 'published'),
('880e8400-e29b-41d4-a716-446655440003', 'Simple Words', 'Learning simple three-letter words', '450e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440002', 'aa0e8400-e29b-41d4-a716-446655440003', 'published'),
('880e8400-e29b-41d4-a716-446655440004', 'Basic Sentences', 'Forming simple sentences', '450e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440003', 'aa0e8400-e29b-41d4-a716-446655440004', 'published'),
('880e8400-e29b-41d4-a716-446655440005', 'Reading Comprehension', 'Basic reading comprehension', '450e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440004', 'aa0e8400-e29b-41d4-a716-446655440005', 'published')
ON CONFLICT (id) DO NOTHING;

-- Assign lessons to classes through assigned_content
INSERT INTO assigned_content (id, class_id, content_type, content_id, assigned_by) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'LESSON', '880e8400-e29b-41d4-a716-446655440001', '39a4bf91-f52d-4996-aadd-a21a17cec9b4'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'LESSON', '880e8400-e29b-41d4-a716-446655440002', '39a4bf91-f52d-4996-aadd-a21a17cec9b4'),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'LESSON', '880e8400-e29b-41d4-a716-446655440003', '39a4bf91-f52d-4996-aadd-a21a17cec9b4'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'LESSON', '880e8400-e29b-41d4-a716-446655440004', '39a4bf91-f52d-4996-aadd-a21a17cec9b4'),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'LESSON', '880e8400-e29b-41d4-a716-446655440005', '39a4bf91-f52d-4996-aadd-a21a17cec9b4')
ON CONFLICT (id) DO NOTHING; 