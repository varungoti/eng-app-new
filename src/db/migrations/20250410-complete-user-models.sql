-- Migration: Complete User Models
-- Timestamp: 2025-04-10

-- Up Migration
---------------------------------------------------------------------------

BEGIN;

-- Add missing user-related columns and constraints
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS theme text DEFAULT 'light',
ADD COLUMN IF NOT EXISTS language text DEFAULT 'en',
ADD COLUMN IF NOT EXISTS timezone text DEFAULT 'UTC',
ADD COLUMN IF NOT EXISTS notification_settings jsonb DEFAULT '{
  "email": true,
  "push": true,
  "sms": false,
  "frequency": "daily"
}'::jsonb;

-- Create user_activity_logs table for tracking user actions
CREATE TABLE IF NOT EXISTS user_activity_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT user_activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for user activity logs
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_action_type ON user_activity_logs(action_type);

-- Add user roles table if not exists
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL,
  school_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT user_roles_school_id_fkey FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
  CONSTRAINT user_roles_role_check CHECK (role IN ('admin', 'teacher', 'student', 'parent', 'staff')),
  CONSTRAINT user_roles_user_school_role_key UNIQUE (user_id, school_id, role)
);

-- Create indexes for user roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_school_id ON user_roles(school_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Add user sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_token text NOT NULL,
  device_info jsonb DEFAULT '{}',
  last_active_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT user_sessions_session_token_key UNIQUE (session_token)
);

-- Create indexes for user sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_active_at ON user_sessions(last_active_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Add comments for documentation
COMMENT ON TABLE user_activity_logs IS 'Tracks user actions and activities for auditing and analytics';
COMMENT ON TABLE user_roles IS 'Manages user roles and permissions across different schools';
COMMENT ON TABLE user_sessions IS 'Tracks active user sessions and authentication state';

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql;

-- Create function to log user activity
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id uuid,
  p_action_type text,
  p_entity_type text,
  p_entity_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO user_activity_logs (
    user_id,
    action_type,
    entity_type,
    entity_id,
    metadata
  ) VALUES (
    p_user_id,
    p_action_type,
    p_entity_type,
    p_entity_id,
    p_metadata
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- Down Migration
---------------------------------------------------------------------------

BEGIN;

-- Drop functions
DROP FUNCTION IF EXISTS cleanup_expired_sessions();
DROP FUNCTION IF EXISTS log_user_activity(uuid, text, text, uuid, jsonb);

-- Drop comments
COMMENT ON TABLE user_sessions IS NULL;
COMMENT ON TABLE user_roles IS NULL;
COMMENT ON TABLE user_activity_logs IS NULL;

-- Drop indexes
DROP INDEX IF EXISTS idx_user_sessions_expires_at;
DROP INDEX IF EXISTS idx_user_sessions_last_active_at;
DROP INDEX IF EXISTS idx_user_sessions_user_id;
DROP INDEX IF EXISTS idx_user_roles_role;
DROP INDEX IF EXISTS idx_user_roles_school_id;
DROP INDEX IF EXISTS idx_user_roles_user_id;
DROP INDEX IF EXISTS idx_user_activity_logs_action_type;
DROP INDEX IF EXISTS idx_user_activity_logs_created_at;
DROP INDEX IF EXISTS idx_user_activity_logs_user_id;

-- Drop tables
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS user_activity_logs;

-- Remove added columns from user_preferences
ALTER TABLE user_preferences
DROP COLUMN IF EXISTS theme,
DROP COLUMN IF EXISTS language,
DROP COLUMN IF EXISTS timezone,
DROP COLUMN IF EXISTS notification_settings;

COMMIT; 