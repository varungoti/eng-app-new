-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_topics_grade_id ON topics(grade_id);
CREATE INDEX IF NOT EXISTS idx_sub_topics_topic_id ON sub_topics(topic_id);
CREATE INDEX IF NOT EXISTS idx_lessons_sub_topic_id ON lessons(sub_topic_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON exercises(lesson_id);

-- Add cascade delete to ensure referential integrity
ALTER TABLE topics
  DROP CONSTRAINT IF EXISTS topics_grade_id_fkey,
  ADD CONSTRAINT topics_grade_id_fkey 
    FOREIGN KEY (grade_id) 
    REFERENCES grades(id) 
    ON DELETE CASCADE;

ALTER TABLE sub_topics
  DROP CONSTRAINT IF EXISTS sub_topics_topic_id_fkey,
  ADD CONSTRAINT sub_topics_topic_id_fkey 
    FOREIGN KEY (topic_id) 
    REFERENCES topics(id) 
    ON DELETE CASCADE;

ALTER TABLE lessons
  DROP CONSTRAINT IF EXISTS lessons_sub_topic_id_fkey,
  ADD CONSTRAINT lessons_sub_topic_id_fkey 
    FOREIGN KEY (sub_topic_id) 
    REFERENCES sub_topics(id) 
    ON DELETE CASCADE;

ALTER TABLE exercises
  DROP CONSTRAINT IF EXISTS exercises_lesson_id_fkey,
  ADD CONSTRAINT exercises_lesson_id_fkey 
    FOREIGN KEY (lesson_id) 
    REFERENCES lessons(id) 
    ON DELETE CASCADE;

-- Drop existing policies first
DROP POLICY IF EXISTS "Enable read for authenticated users" ON grades;
DROP POLICY IF EXISTS "Enable write for authenticated users" ON grades;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON topics;
DROP POLICY IF EXISTS "Enable write for authenticated users" ON topics;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON sub_topics;
DROP POLICY IF EXISTS "Enable write for authenticated users" ON sub_topics;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON lessons;
DROP POLICY IF EXISTS "Enable write for authenticated users" ON lessons;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON exercises;
DROP POLICY IF EXISTS "Enable write for authenticated users" ON exercises;

-- Add RLS policies for all operations
DO $$ BEGIN
  -- Grades policies
  CREATE POLICY "Enable read for authenticated users"
    ON grades FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable write for authenticated users"
    ON grades FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

  -- Topics policies  
  CREATE POLICY "Enable read for authenticated users"
    ON topics FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable write for authenticated users"
    ON topics FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

  -- Sub-topics policies
  CREATE POLICY "Enable read for authenticated users"
    ON sub_topics FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable write for authenticated users"
    ON sub_topics FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

  -- Lessons policies
  CREATE POLICY "Enable read for authenticated users"
    ON lessons FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable write for authenticated users"
    ON lessons FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

  -- Exercises policies
  CREATE POLICY "Enable read for authenticated users"
    ON exercises FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable write for authenticated users"
    ON exercises FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
END $$;