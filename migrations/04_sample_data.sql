-- First, create the questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  type VARCHAR(50) NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  metadata JSONB,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sample Grades
INSERT INTO grades (id, name, level) VALUES
  (gen_random_uuid(), 'PP1', 1),
  (gen_random_uuid(), 'PP2', 2),
  (gen_random_uuid(), 'Grade 1', 3),
  (gen_random_uuid(), 'Grade 2', 4),
  (gen_random_uuid(), 'Grade 3', 5),
  (gen_random_uuid(), 'Grade 4', 6),
  (gen_random_uuid(), 'Grade 5', 7),
  (gen_random_uuid(), 'Grade 6', 8),
  (gen_random_uuid(), 'Grade 7', 9),
  (gen_random_uuid(), 'Grade 8', 10),
  (gen_random_uuid(), 'Grade 9', 11);

-- Sample Topics for PP1
WITH pp1 AS (SELECT id FROM grades WHERE name = 'PP1')
INSERT INTO topics (id, title, description, grade_id, order_index) VALUES
  (gen_random_uuid(), 'Basic Phonics', 'Introduction to letter sounds', (SELECT id FROM pp1), 1),
  (gen_random_uuid(), 'Simple Words', 'Basic three-letter words', (SELECT id FROM pp1), 2),
  (gen_random_uuid(), 'Numbers 1-5', 'Counting and number recognition', (SELECT id FROM pp1), 3);

-- Sample Topics for PP2
WITH pp2 AS (SELECT id FROM grades WHERE name = 'PP2')
INSERT INTO topics (id, title, description, grade_id, order_index) VALUES
  (gen_random_uuid(), 'Advanced Phonics', 'Blending sounds', (SELECT id FROM pp2), 1),
  (gen_random_uuid(), 'Sight Words', 'Common sight words', (SELECT id FROM pp2), 2),
  (gen_random_uuid(), 'Numbers 1-10', 'Extended number work', (SELECT id FROM pp2), 3);

-- Sample Topics for Grade 1
WITH grade1 AS (SELECT id FROM grades WHERE name = 'Grade 1')
INSERT INTO topics (id, title, description, grade_id, order_index) VALUES
  (gen_random_uuid(), 'Reading Basics', 'Fundamental reading skills', (SELECT id FROM grade1), 1),
  (gen_random_uuid(), 'Writing Skills', 'Basic sentence formation', (SELECT id FROM grade1), 2),
  (gen_random_uuid(), 'Numbers to 20', 'Number operations', (SELECT id FROM grade1), 3);

-- Sample Subtopics for "Reading Basics"
WITH reading_topic AS (SELECT id FROM topics WHERE title = 'Reading Basics')
INSERT INTO subtopics (id, title, description, topic_id, order_index) VALUES
  (gen_random_uuid(), 'Letter Recognition', 'Identifying letters', (SELECT id FROM reading_topic), 1),
  (gen_random_uuid(), 'Sound Blending', 'Combining letter sounds', (SELECT id FROM reading_topic), 2),
  (gen_random_uuid(), 'Simple Words', 'Reading basic words', (SELECT id FROM reading_topic), 3);

-- Sample Lessons for "Letter Recognition"
WITH letter_subtopic AS (SELECT id FROM subtopics WHERE title = 'Letter Recognition')
INSERT INTO lessons (id, title, content, subtopic_id, order_index, status) VALUES
  (gen_random_uuid(), 'Vowels Introduction', 'Learning about A, E, I, O, U', (SELECT id FROM letter_subtopic), 1, 'published'),
  (gen_random_uuid(), 'Consonants Part 1', 'Learning B, C, D, F, G', (SELECT id FROM letter_subtopic), 2, 'published'),
  (gen_random_uuid(), 'Letter Sounds', 'Basic letter sounds', (SELECT id FROM letter_subtopic), 3, 'published');

-- Sample Questions for "Vowels Introduction"
WITH vowels_lesson AS (SELECT id FROM lessons WHERE title = 'Vowels Introduction')
INSERT INTO questions (id, title, content, type, lesson_id, points, metadata) VALUES
  (gen_random_uuid(), 'Identify Vowels', 'Circle all the vowels you see', 'multiple_choice', 
   (SELECT id FROM vowels_lesson), 5, '{"options": ["A", "B", "E", "C", "I"], "correct": ["A","E","I"]}'::jsonb),
  (gen_random_uuid(), 'Match Sounds', 'Match the vowel to its sound', 'matching', 
   (SELECT id FROM vowels_lesson), 10, '{"pairs": [{"a": "/eɪ/"}, {"e": "/iː/"}, {"i": "/aɪ/"}]}'::jsonb),
  (gen_random_uuid(), 'Write Vowels', 'Fill in the missing vowels', 'fill_blanks', 
   (SELECT id FROM vowels_lesson), 8, '{"words": ["c_t", "d_g", "p_n"], "answers": ["a", "o", "e"]}'::jsonb);

-- Sample Lesson Content
WITH vowels_lesson AS (SELECT id FROM lessons WHERE title = 'Vowels Introduction')
INSERT INTO lesson_content (id, lesson_id, content_type, content, metadata, order_index) VALUES
  (gen_random_uuid(), (SELECT id FROM vowels_lesson), 'video', 'https://example.com/vowels-intro.mp4', 
   '{"duration": "5:00", "transcript": "Today we will learn about vowels..."}'::jsonb, 1),
  (gen_random_uuid(), (SELECT id FROM vowels_lesson), 'audio', 'https://example.com/vowel-sounds.mp3',
   '{"duration": "2:30", "transcript": "Listen to each vowel sound..."}'::jsonb, 2),
  (gen_random_uuid(), (SELECT id FROM vowels_lesson), 'practice', 'https://example.com/vowel-practice',
   '{"type": "interactive", "attempts": 3, "passing_score": 80}'::jsonb, 3); 