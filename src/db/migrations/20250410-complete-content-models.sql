-- Migration: Complete Content Models
-- Timestamp: 2025-04-10

-- Up Migration
---------------------------------------------------------------------------

BEGIN;

-- Add content versioning support
CREATE TABLE IF NOT EXISTS content_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  version_number integer NOT NULL,
  content_data jsonb NOT NULL,
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_versions_pkey PRIMARY KEY (id),
  CONSTRAINT content_versions_content_id_fkey FOREIGN KEY (content_id) REFERENCES lessons(id) ON DELETE CASCADE,
  CONSTRAINT content_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(id),
  CONSTRAINT content_versions_content_version_key UNIQUE (content_id, version_number)
);

-- Create indexes for content versions
CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_created_by ON content_versions(created_by);

-- Add content metadata table
CREATE TABLE IF NOT EXISTS content_metadata (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  metadata_type text NOT NULL,
  metadata_value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_metadata_pkey PRIMARY KEY (id),
  CONSTRAINT content_metadata_content_id_fkey FOREIGN KEY (content_id) REFERENCES lessons(id) ON DELETE CASCADE,
  CONSTRAINT content_metadata_content_type_key UNIQUE (content_id, metadata_type)
);

-- Create indexes for content metadata
CREATE INDEX IF NOT EXISTS idx_content_metadata_content_id ON content_metadata(content_id);
CREATE INDEX IF NOT EXISTS idx_content_metadata_type ON content_metadata(metadata_type);

-- Add content tags table
CREATE TABLE IF NOT EXISTS content_tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_tags_pkey PRIMARY KEY (id),
  CONSTRAINT content_tags_name_key UNIQUE (name)
);

-- Create content-tag relationship table
CREATE TABLE IF NOT EXISTS content_tag_relations (
  content_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_tag_relations_pkey PRIMARY KEY (content_id, tag_id),
  CONSTRAINT content_tag_relations_content_id_fkey FOREIGN KEY (content_id) REFERENCES lessons(id) ON DELETE CASCADE,
  CONSTRAINT content_tag_relations_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES content_tags(id) ON DELETE CASCADE
);

-- Create indexes for content tag relations
CREATE INDEX IF NOT EXISTS idx_content_tag_relations_content_id ON content_tag_relations(content_id);
CREATE INDEX IF NOT EXISTS idx_content_tag_relations_tag_id ON content_tag_relations(tag_id);

-- Add content approval workflow tables
CREATE TABLE IF NOT EXISTS content_approvals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  requested_by uuid NOT NULL,
  reviewed_by uuid,
  review_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_approvals_pkey PRIMARY KEY (id),
  CONSTRAINT content_approvals_content_id_fkey FOREIGN KEY (content_id) REFERENCES lessons(id) ON DELETE CASCADE,
  CONSTRAINT content_approvals_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES users(id),
  CONSTRAINT content_approvals_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Create indexes for content approvals
CREATE INDEX IF NOT EXISTS idx_content_approvals_content_id ON content_approvals(content_id);
CREATE INDEX IF NOT EXISTS idx_content_approvals_status ON content_approvals(status);
CREATE INDEX IF NOT EXISTS idx_content_approvals_requested_by ON content_approvals(requested_by);
CREATE INDEX IF NOT EXISTS idx_content_approvals_reviewed_by ON content_approvals(reviewed_by);

-- Add content analytics table
CREATE TABLE IF NOT EXISTS content_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  view_count integer DEFAULT 0,
  completion_count integer DEFAULT 0,
  average_completion_time integer,
  difficulty_rating float,
  engagement_score float,
  last_updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT content_analytics_pkey PRIMARY KEY (id),
  CONSTRAINT content_analytics_content_id_fkey FOREIGN KEY (content_id) REFERENCES lessons(id) ON DELETE CASCADE,
  CONSTRAINT content_analytics_content_id_key UNIQUE (content_id)
);

-- Create indexes for content analytics
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON content_analytics(content_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_engagement_score ON content_analytics(engagement_score);

-- Add comments for documentation
COMMENT ON TABLE content_versions IS 'Tracks version history of content';
COMMENT ON TABLE content_metadata IS 'Stores additional metadata for content';
COMMENT ON TABLE content_tags IS 'Manages content categorization tags';
COMMENT ON TABLE content_tag_relations IS 'Maps content to tags';
COMMENT ON TABLE content_approvals IS 'Manages content approval workflow';
COMMENT ON TABLE content_analytics IS 'Tracks content usage and performance metrics';

-- Create function to update content analytics
CREATE OR REPLACE FUNCTION update_content_analytics(
  p_content_id uuid,
  p_view_count integer DEFAULT NULL,
  p_completion_count integer DEFAULT NULL,
  p_completion_time integer DEFAULT NULL,
  p_difficulty_rating float DEFAULT NULL,
  p_engagement_score float DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO content_analytics (
    content_id,
    view_count,
    completion_count,
    average_completion_time,
    difficulty_rating,
    engagement_score
  ) VALUES (
    p_content_id,
    COALESCE(p_view_count, 0),
    COALESCE(p_completion_count, 0),
    p_completion_time,
    p_difficulty_rating,
    p_engagement_score
  )
  ON CONFLICT (content_id) DO UPDATE
  SET
    view_count = content_analytics.view_count + COALESCE(p_view_count, 0),
    completion_count = content_analytics.completion_count + COALESCE(p_completion_count, 0),
    average_completion_time = CASE 
      WHEN p_completion_time IS NOT NULL 
      THEN (content_analytics.average_completion_time + p_completion_time) / 2
      ELSE content_analytics.average_completion_time
    END,
    difficulty_rating = COALESCE(p_difficulty_rating, content_analytics.difficulty_rating),
    engagement_score = COALESCE(p_engagement_score, content_analytics.engagement_score),
    last_updated_at = now();
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- Down Migration
---------------------------------------------------------------------------

BEGIN;

-- Drop functions
DROP FUNCTION IF EXISTS update_content_analytics(uuid, integer, integer, integer, float, float);

-- Drop comments
COMMENT ON TABLE content_analytics IS NULL;
COMMENT ON TABLE content_approvals IS NULL;
COMMENT ON TABLE content_tag_relations IS NULL;
COMMENT ON TABLE content_tags IS NULL;
COMMENT ON TABLE content_metadata IS NULL;
COMMENT ON TABLE content_versions IS NULL;

-- Drop indexes
DROP INDEX IF EXISTS idx_content_analytics_engagement_score;
DROP INDEX IF EXISTS idx_content_analytics_content_id;
DROP INDEX IF EXISTS idx_content_approvals_reviewed_by;
DROP INDEX IF EXISTS idx_content_approvals_requested_by;
DROP INDEX IF EXISTS idx_content_approvals_status;
DROP INDEX IF EXISTS idx_content_approvals_content_id;
DROP INDEX IF EXISTS idx_content_tag_relations_tag_id;
DROP INDEX IF EXISTS idx_content_tag_relations_content_id;
DROP INDEX IF EXISTS idx_content_metadata_type;
DROP INDEX IF EXISTS idx_content_metadata_content_id;
DROP INDEX IF EXISTS idx_content_versions_created_by;
DROP INDEX IF EXISTS idx_content_versions_content_id;

-- Drop tables
DROP TABLE IF EXISTS content_analytics;
DROP TABLE IF EXISTS content_approvals;
DROP TABLE IF EXISTS content_tag_relations;
DROP TABLE IF EXISTS content_tags;
DROP TABLE IF EXISTS content_metadata;
DROP TABLE IF EXISTS content_versions;

COMMIT; 