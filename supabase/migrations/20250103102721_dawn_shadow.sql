-- Insert test grades if they don't exist
INSERT INTO grades (name, level, description)
SELECT 'Grade 1', 1, 'First grade curriculum'
WHERE NOT EXISTS (SELECT 1 FROM grades WHERE name = 'Grade 1');

INSERT INTO grades (name, level, description)
SELECT 'Grade 2', 2, 'Second grade curriculum'
WHERE NOT EXISTS (SELECT 1 FROM grades WHERE name = 'Grade 2');

-- Insert test topics
INSERT INTO topics (grade_id, title, description, "order")
SELECT 
  (SELECT id FROM grades WHERE name = 'Grade 1'),
  'Basic Conversations',
  'Learn everyday conversations',
  1
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE title = 'Basic Conversations');

INSERT INTO topics (grade_id, title, description, "order")
SELECT 
  (SELECT id FROM grades WHERE name = 'Grade 1'),
  'Grammar Fundamentals',
  'Essential grammar concepts',
  2
WHERE NOT EXISTS (SELECT 1 FROM topics WHERE title = 'Grammar Fundamentals');

-- Insert test sub-topics
INSERT INTO sub_topics (topic_id, title, description, "order")
SELECT 
  (SELECT id FROM topics WHERE title = 'Basic Conversations'),
  'Greetings',
  'Learn common greetings',
  1
WHERE NOT EXISTS (SELECT 1 FROM sub_topics WHERE title = 'Greetings');

INSERT INTO sub_topics (topic_id, title, description, "order")
SELECT 
  (SELECT id FROM topics WHERE title = 'Basic Conversations'),
  'Self Introduction',
  'Learn how to introduce yourself',
  2
WHERE NOT EXISTS (SELECT 1 FROM sub_topics WHERE title = 'Self Introduction');

-- Insert test lessons
INSERT INTO lessons (sub_topic_id, title, description, "order", teacher_script, teacher_prompt, sample_answer)
SELECT 
  (SELECT id FROM sub_topics WHERE title = 'Greetings'),
  'Saying Hello',
  'Learn different ways to say hello',
  1,
  'Start by demonstrating common greetings',
  'Have students practice saying hello in pairs',
  'Hello, how are you?'
WHERE NOT EXISTS (SELECT 1 FROM lessons WHERE title = 'Saying Hello');

-- Insert test exercises
INSERT INTO exercises (lesson_id, prompt, media_url, media_type, say_text)
SELECT 
  (SELECT id FROM lessons WHERE title = 'Saying Hello'),
  'Practice saying hello to your friend',
  'https://images.unsplash.com/photo-1516500896640-0059a0b99eaa?w=800',
  'image',
  'Hello, nice to meet you!'
WHERE NOT EXISTS (SELECT 1 FROM exercises WHERE prompt = 'Practice saying hello to your friend');