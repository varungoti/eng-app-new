/*
  # Content Management Schema

  1. New Tables
    - `grades`
      - `id` (uuid, primary key)
      - `name` (text)
      - `level` (integer)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `topics`
      - `id` (uuid, primary key) 
      - `grade_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `sub_topics`
      - `id` (uuid, primary key)
      - `topic_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `lessons`
      - `id` (uuid, primary key)
      - `sub_topic_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `order` (integer)
      - `teacher_script` (text)
      - `teacher_prompt` (text)
      - `sample_answer` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `exercises`
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, foreign key)
      - `prompt` (text)
      - `media_url` (text)
      - `media_type` (text)
      - `say_text` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  level integer NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  grade_id uuid REFERENCES grades(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sub_topics table
CREATE TABLE IF NOT EXISTS sub_topics (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
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
CREATE TABLE IF NOT EXISTS exercises (
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

-- Create policies
DO $$ BEGIN
  -- Grades policies
  CREATE POLICY "Allow read access for authenticated users" ON grades
    FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow write access for authenticated users" ON grades
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

  -- Topics policies
  CREATE POLICY "Allow read access for authenticated users" ON topics
    FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow write access for authenticated users" ON topics
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

  -- Sub_topics policies
  CREATE POLICY "Allow read access for authenticated users" ON sub_topics
    FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow write access for authenticated users" ON sub_topics
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

  -- Lessons policies
  CREATE POLICY "Allow read access for authenticated users" ON lessons
    FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow write access for authenticated users" ON lessons
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

  -- Exercises policies
  CREATE POLICY "Allow read access for authenticated users" ON exercises
    FOR SELECT TO authenticated USING (true);
    
  CREATE POLICY "Allow write access for authenticated users" ON exercises
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
END $$;