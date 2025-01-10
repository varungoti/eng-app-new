-- Add school_id and department columns to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS school_id uuid REFERENCES schools(id),
ADD COLUMN IF NOT EXISTS department text CHECK (department IN ('academic', 'administrative', 'hr', 'finance', 'other'));

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_events_school_id ON events(school_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);

-- Update RLS policies to include school_id checks
DROP POLICY IF EXISTS "Users can view all events" ON events;
CREATE POLICY "Users can view relevant events"
  ON events FOR SELECT
  TO authenticated
  USING (
    CASE 
      WHEN auth.jwt() ->> 'role' IN ('super_admin', 'admin') THEN true
      WHEN auth.jwt() ->> 'role' IN ('school_principal', 'teacher') THEN school_id = (
        SELECT school_id FROM user_schools WHERE user_id = auth.uid() LIMIT 1
      )
      ELSE false
    END
  );