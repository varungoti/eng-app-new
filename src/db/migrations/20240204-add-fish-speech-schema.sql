-- Migration: Add Fish Speech Schema
-- Timestamp: 2024-02-04

-- Up Migration
---------------------------------------------------------------------------

BEGIN;

-- Create voices table for managing TTS voices
CREATE TABLE IF NOT EXISTS voices (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  language text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  sample_url text NOT NULL,
  is_default boolean DEFAULT false,
  school_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT voices_pkey PRIMARY KEY (id),
  CONSTRAINT voices_school_id_fkey FOREIGN KEY (school_id) REFERENCES schools(id)
);

-- Add partial unique index to ensure only one default voice per school
CREATE UNIQUE INDEX IF NOT EXISTS idx_voices_school_default 
ON voices (school_id) 
WHERE is_default = true;

-- Create indexes for voices
CREATE INDEX IF NOT EXISTS idx_voices_school_id ON voices(school_id);
CREATE INDEX IF NOT EXISTS idx_voices_is_default ON voices(is_default);

-- Add voice_id to lessons table
ALTER TABLE lessons 
ADD COLUMN IF NOT EXISTS voice_id uuid REFERENCES voices(id);

-- Add voice_id to activities table
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS voice_id uuid REFERENCES voices(id);

-- Add voice_id to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS voice_id uuid REFERENCES voices(id);

-- Add voice_id to exercise_prompts table
ALTER TABLE exercise_prompts 
ADD COLUMN IF NOT EXISTS voice_id uuid REFERENCES voices(id);

-- Create function to ensure only one default voice per school
DROP FUNCTION IF EXISTS ensure_single_default_voice() CASCADE;
CREATE OR REPLACE FUNCTION ensure_single_default_voice()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE voices
    SET is_default = false
    WHERE school_id = NEW.school_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for voices table
DROP TRIGGER IF EXISTS ensure_single_default_voice_trigger ON voices;
CREATE TRIGGER ensure_single_default_voice_trigger
BEFORE INSERT OR UPDATE ON voices
FOR EACH ROW
EXECUTE FUNCTION ensure_single_default_voice();

-- Create voice_settings table for additional voice configuration
CREATE TABLE IF NOT EXISTS voice_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  voice_id uuid NOT NULL,
  pitch_adjustment float DEFAULT 1.0,
  speed_adjustment float DEFAULT 1.0,
  volume_adjustment float DEFAULT 1.0,
  effects jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT voice_settings_pkey PRIMARY KEY (id),
  CONSTRAINT voice_settings_voice_id_fkey FOREIGN KEY (voice_id) REFERENCES voices(id) ON DELETE CASCADE,
  CONSTRAINT voice_settings_voice_id_key UNIQUE (voice_id)
);

-- Create voice_usage_logs table for tracking and analytics
CREATE TABLE IF NOT EXISTS voice_usage_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  voice_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('lesson', 'activity', 'question', 'exercise')),
  content_id uuid NOT NULL,
  duration integer, -- in seconds
  characters_processed integer,
  performance_metrics jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT voice_usage_logs_pkey PRIMARY KEY (id),
  CONSTRAINT voice_usage_logs_voice_id_fkey FOREIGN KEY (voice_id) REFERENCES voices(id),
  CONSTRAINT voice_usage_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create index for voice usage analytics
CREATE INDEX IF NOT EXISTS idx_voice_usage_logs_voice_id ON voice_usage_logs(voice_id);
CREATE INDEX IF NOT EXISTS idx_voice_usage_logs_user_id ON voice_usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_usage_logs_created_at ON voice_usage_logs(created_at);

-- Add voice preference to user_preferences
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS preferred_voice_id uuid REFERENCES voices(id);

-- Create function to log voice usage
DROP FUNCTION IF EXISTS log_voice_usage(uuid, uuid, text, uuid, integer, integer, jsonb);
CREATE OR REPLACE FUNCTION log_voice_usage(
  p_voice_id uuid,
  p_user_id uuid,
  p_content_type text,
  p_content_id uuid,
  p_duration integer,
  p_characters_processed integer,
  p_performance_metrics jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO voice_usage_logs (
    voice_id,
    user_id,
    content_type,
    content_id,
    duration,
    characters_processed,
    performance_metrics
  ) VALUES (
    p_voice_id,
    p_user_id,
    p_content_type,
    p_content_id,
    p_duration,
    p_characters_processed,
    p_performance_metrics
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE voices IS 'Stores TTS voices available in the system';
COMMENT ON TABLE voice_settings IS 'Stores configuration settings for each voice';
COMMENT ON TABLE voice_usage_logs IS 'Tracks usage of TTS voices for analytics';
COMMENT ON FUNCTION ensure_single_default_voice() IS 'Ensures only one default voice exists per school';
COMMENT ON FUNCTION log_voice_usage(uuid, uuid, text, uuid, integer, integer, jsonb) IS 'Helper function to log voice usage with performance metrics';

COMMIT;

-- Down Migration
---------------------------------------------------------------------------

BEGIN;

-- Drop comments
COMMENT ON FUNCTION log_voice_usage(uuid, uuid, text, uuid, integer, integer, jsonb) IS NULL;
COMMENT ON FUNCTION ensure_single_default_voice() IS NULL;
COMMENT ON TABLE voice_usage_logs IS NULL;
COMMENT ON TABLE voice_settings IS NULL;
COMMENT ON TABLE voices IS NULL;

-- Drop functions and triggers
DROP FUNCTION IF EXISTS log_voice_usage(uuid, uuid, text, uuid, integer, integer, jsonb);
DROP TRIGGER IF EXISTS ensure_single_default_voice_trigger ON voices;
DROP FUNCTION IF EXISTS ensure_single_default_voice();

-- Drop indexes
DROP INDEX IF EXISTS idx_voice_usage_logs_created_at;
DROP INDEX IF EXISTS idx_voice_usage_logs_user_id;
DROP INDEX IF EXISTS idx_voice_usage_logs_voice_id;
DROP INDEX IF EXISTS idx_voices_is_default;
DROP INDEX IF EXISTS idx_voices_school_id;
DROP INDEX IF EXISTS idx_voices_school_default;

-- Remove voice_id columns
ALTER TABLE exercise_prompts DROP COLUMN IF EXISTS voice_id;
ALTER TABLE questions DROP COLUMN IF EXISTS voice_id;
ALTER TABLE activities DROP COLUMN IF EXISTS voice_id;
ALTER TABLE lessons DROP COLUMN IF EXISTS voice_id;
ALTER TABLE user_preferences DROP COLUMN IF EXISTS preferred_voice_id;

-- Drop tables
DROP TABLE IF EXISTS voice_usage_logs;
DROP TABLE IF EXISTS voice_settings;
DROP TABLE IF EXISTS voices;

COMMIT; 