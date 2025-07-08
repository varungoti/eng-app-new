-- Migration: Complete School Models
-- Timestamp: 2025-04-10

-- Up Migration
---------------------------------------------------------------------------

BEGIN;

-- Add school settings table
CREATE TABLE IF NOT EXISTS school_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  setting_key text NOT NULL,
  setting_value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT school_settings_pkey PRIMARY KEY (id),
  CONSTRAINT school_settings_school_id_fkey FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  CONSTRAINT school_settings_school_key_key UNIQUE (school_id, setting_key)
);

-- Create indexes for school settings
CREATE INDEX IF NOT EXISTS idx_school_settings_school_id ON school_settings(school_id);
CREATE INDEX IF NOT EXISTS idx_school_settings_key ON school_settings(setting_key);

-- Add school analytics table
CREATE TABLE IF NOT EXISTS school_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  total_students integer DEFAULT 0,
  active_students integer DEFAULT 0,
  total_teachers integer DEFAULT 0,
  active_teachers integer DEFAULT 0,
  total_lessons integer DEFAULT 0,
  completed_lessons integer DEFAULT 0,
  average_engagement_score float,
  last_updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT school_analytics_pkey PRIMARY KEY (id),
  CONSTRAINT school_analytics_school_id_fkey FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  CONSTRAINT school_analytics_school_id_key UNIQUE (school_id)
);

-- Create indexes for school analytics
CREATE INDEX IF NOT EXISTS idx_school_analytics_school_id ON school_analytics(school_id);
CREATE INDEX IF NOT EXISTS idx_school_analytics_engagement_score ON school_analytics(average_engagement_score);

-- Add school departments table
CREATE TABLE IF NOT EXISTS school_departments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  head_teacher_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT school_departments_pkey PRIMARY KEY (id),
  CONSTRAINT school_departments_school_id_fkey FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  CONSTRAINT school_departments_head_teacher_id_fkey FOREIGN KEY (head_teacher_id) REFERENCES users(id),
  CONSTRAINT school_departments_school_name_key UNIQUE (school_id, name)
);

-- Create indexes for school departments
CREATE INDEX IF NOT EXISTS idx_school_departments_school_id ON school_departments(school_id);
CREATE INDEX IF NOT EXISTS idx_school_departments_head_teacher_id ON school_departments(head_teacher_id);

-- Add school events table
CREATE TABLE IF NOT EXISTS school_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  event_type text NOT NULL,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  location text,
  organizer_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT school_events_pkey PRIMARY KEY (id),
  CONSTRAINT school_events_school_id_fkey FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  CONSTRAINT school_events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES users(id),
  CONSTRAINT school_events_event_type_check CHECK (event_type IN ('academic', 'cultural', 'sports', 'other'))
);

-- Create indexes for school events
CREATE INDEX IF NOT EXISTS idx_school_events_school_id ON school_events(school_id);
CREATE INDEX IF NOT EXISTS idx_school_events_organizer_id ON school_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_school_events_start_date ON school_events(start_date);
CREATE INDEX IF NOT EXISTS idx_school_events_event_type ON school_events(event_type);

-- Add school announcements table
CREATE TABLE IF NOT EXISTS school_announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  priority text NOT NULL DEFAULT 'normal',
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT school_announcements_pkey PRIMARY KEY (id),
  CONSTRAINT school_announcements_school_id_fkey FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  CONSTRAINT school_announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT school_announcements_priority_check CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Create indexes for school announcements
CREATE INDEX IF NOT EXISTS idx_school_announcements_school_id ON school_announcements(school_id);
CREATE INDEX IF NOT EXISTS idx_school_announcements_created_by ON school_announcements(created_by);
CREATE INDEX IF NOT EXISTS idx_school_announcements_priority ON school_announcements(priority);
CREATE INDEX IF NOT EXISTS idx_school_announcements_start_date ON school_announcements(start_date);

-- Add comments for documentation
COMMENT ON TABLE school_settings IS 'Stores school-specific configuration settings';
COMMENT ON TABLE school_analytics IS 'Tracks school-wide usage and performance metrics';
COMMENT ON TABLE school_departments IS 'Manages school departments and their heads';
COMMENT ON TABLE school_events IS 'Tracks school events and activities';
COMMENT ON TABLE school_announcements IS 'Manages school-wide announcements';

-- Create function to update school analytics
CREATE OR REPLACE FUNCTION update_school_analytics(
  p_school_id uuid,
  p_total_students integer DEFAULT NULL,
  p_active_students integer DEFAULT NULL,
  p_total_teachers integer DEFAULT NULL,
  p_active_teachers integer DEFAULT NULL,
  p_total_lessons integer DEFAULT NULL,
  p_completed_lessons integer DEFAULT NULL,
  p_engagement_score float DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO school_analytics (
    school_id,
    total_students,
    active_students,
    total_teachers,
    active_teachers,
    total_lessons,
    completed_lessons,
    average_engagement_score
  ) VALUES (
    p_school_id,
    COALESCE(p_total_students, 0),
    COALESCE(p_active_students, 0),
    COALESCE(p_total_teachers, 0),
    COALESCE(p_active_teachers, 0),
    COALESCE(p_total_lessons, 0),
    COALESCE(p_completed_lessons, 0),
    p_engagement_score
  )
  ON CONFLICT (school_id) DO UPDATE
  SET
    total_students = COALESCE(p_total_students, school_analytics.total_students),
    active_students = COALESCE(p_active_students, school_analytics.active_students),
    total_teachers = COALESCE(p_total_teachers, school_analytics.total_teachers),
    active_teachers = COALESCE(p_active_teachers, school_analytics.active_teachers),
    total_lessons = COALESCE(p_total_lessons, school_analytics.total_lessons),
    completed_lessons = COALESCE(p_completed_lessons, school_analytics.completed_lessons),
    average_engagement_score = COALESCE(p_engagement_score, school_analytics.average_engagement_score),
    last_updated_at = now();
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- Down Migration
---------------------------------------------------------------------------

BEGIN;

-- Drop functions
DROP FUNCTION IF EXISTS update_school_analytics(uuid, integer, integer, integer, integer, integer, integer, float);

-- Drop comments
COMMENT ON TABLE school_announcements IS NULL;
COMMENT ON TABLE school_events IS NULL;
COMMENT ON TABLE school_departments IS NULL;
COMMENT ON TABLE school_analytics IS NULL;
COMMENT ON TABLE school_settings IS NULL;

-- Drop indexes
DROP INDEX IF EXISTS idx_school_announcements_start_date;
DROP INDEX IF EXISTS idx_school_announcements_priority;
DROP INDEX IF EXISTS idx_school_announcements_created_by;
DROP INDEX IF EXISTS idx_school_announcements_school_id;
DROP INDEX IF EXISTS idx_school_events_event_type;
DROP INDEX IF EXISTS idx_school_events_start_date;
DROP INDEX IF EXISTS idx_school_events_organizer_id;
DROP INDEX IF EXISTS idx_school_events_school_id;
DROP INDEX IF EXISTS idx_school_departments_head_teacher_id;
DROP INDEX IF EXISTS idx_school_departments_school_id;
DROP INDEX IF EXISTS idx_school_analytics_engagement_score;
DROP INDEX IF EXISTS idx_school_analytics_school_id;
DROP INDEX IF EXISTS idx_school_settings_key;
DROP INDEX IF EXISTS idx_school_settings_school_id;

-- Drop tables
DROP TABLE IF EXISTS school_announcements;
DROP TABLE IF EXISTS school_events;
DROP TABLE IF EXISTS school_departments;
DROP TABLE IF EXISTS school_analytics;
DROP TABLE IF EXISTS school_settings;

COMMIT; 