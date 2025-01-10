/*
  # Fix Initial Database Setup

  1. Tables
    - Recreates all necessary tables with proper constraints
    - Adds indexes for better performance
    - Sets up RLS policies
  
  2. Initial Data
    - Adds default grade levels
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS sub_topics CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS grades CASCADE;

-- Create grades table
CREATE TABLE grades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  level integer NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(level)
);

-- Create topics table
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade_id uuid REFERENCES grades(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sub_topics table
CREATE TABLE sub_topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE lessons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_topic_id uuid REFERENCES sub_topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  "order" integer NOT NULL DEFAULT 0,
  teacher_script text,
  teacher_prompt text,
  sample_answer text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exercises table
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  prompt text NOT NULL,
  media_url text,
  media_type text CHECK (media_type IN ('image', 'video', 'gif')),
  say_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sub_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Enable read for authenticated users"
  ON grades FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read for authenticated users"
  ON topics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read for authenticated users"
  ON sub_topics FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read for authenticated users"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable read for authenticated users"
  ON exercises FOR SELECT
  TO authenticated
  USING (true);

-- Insert initial grades
INSERT INTO grades (name, level, description) VALUES 
  ('PP1', 0, 'Pre-Primary 1'),
  ('PP2', 1, 'Pre-Primary 2'),
  ('Grade 1', 2, 'First Grade'),
  ('Grade 2', 3, 'Second Grade'),
  ('Grade 3', 4, 'Third Grade'),
  ('Grade 4', 5, 'Fourth Grade'),
  ('Grade 5', 6, 'Fifth Grade'),
  ('Grade 6', 7, 'Sixth Grade')
ON CONFLICT (level) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX idx_topics_grade_id ON topics(grade_id);
CREATE INDEX idx_sub_topics_topic_id ON sub_topics(topic_id);
CREATE INDEX idx_lessons_sub_topic_id ON lessons(sub_topic_id);
CREATE INDEX idx_exercises_lesson_id ON exercises(lesson_id);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_grades_updated_at
  BEFORE UPDATE ON grades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sub_topics_updated_at
  BEFORE UPDATE ON sub_topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();