-- Add lesson management tables
CREATE TABLE topics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  grade_id UUID REFERENCES grades(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  content JSONB NOT NULL DEFAULT '{
    "objectives": [],
    "materials": [],
    "teacherScript": "",
    "studentInstructions": "",
    "exercises": []
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add exercise prompts table
CREATE TABLE exercise_prompts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  prompt_text TEXT NOT NULL,
  teacher_script TEXT,
  say_text TEXT,
  order_index INTEGER NOT NULL,
  media_urls TEXT[],
  media_types TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add questions table if it doesn't exist
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  type VARCHAR(50) NOT NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  points INTEGER,
  data JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  exercise_prompts JSONB[] DEFAULT ARRAY[]::JSONB[],
  order_index INTEGER,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Only add missing indexes if they don't exist
DO $$ 
BEGIN
  -- Check and create indexes for questions table
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'questions' AND indexname = 'idx_questions_lesson_id'
  ) THEN
    CREATE INDEX idx_questions_lesson_id ON questions(lesson_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'questions' AND indexname = 'idx_questions_type'
  ) THEN
    CREATE INDEX idx_questions_type ON questions(type);
  END IF;

  -- Check and create indexes for exercise_prompts table
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'exercise_prompts' AND indexname = 'idx_exercise_prompts_question_id'
  ) THEN
    CREATE INDEX idx_exercise_prompts_question_id ON exercise_prompts(question_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'exercise_prompts' AND indexname = 'idx_exercise_prompts_order'
  ) THEN
    CREATE INDEX idx_exercise_prompts_order ON exercise_prompts(order_index);
  END IF;
END $$;

-- Check and add exercise_prompts column to questions table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'questions' 
    AND column_name = 'exercise_prompts'
  ) THEN
    ALTER TABLE questions 
    ADD COLUMN exercise_prompts JSONB[] DEFAULT ARRAY[]::JSONB[];
  END IF;
END $$;

-- Add indexes
CREATE INDEX idx_topics_grade_id ON topics(grade_id);
CREATE INDEX idx_lessons_grade_id ON lessons(grade_id);
CREATE INDEX idx_lessons_topic_id ON lessons(topic_id); 