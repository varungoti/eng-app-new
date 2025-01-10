-- Drop existing policies
DROP POLICY IF EXISTS "calendar_read_policy" ON calendar_events;
DROP POLICY IF EXISTS "calendar_insert_policy" ON calendar_events;
DROP POLICY IF EXISTS "calendar_update_policy" ON calendar_events;
DROP POLICY IF EXISTS "calendar_delete_policy" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_select" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_insert" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_update" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_delete" ON calendar_events;
DROP POLICY IF EXISTS "enable_read_all_events" ON calendar_events;
DROP POLICY IF EXISTS "enable_insert_own_events" ON calendar_events;
DROP POLICY IF EXISTS "enable_update_own_events" ON calendar_events;
DROP POLICY IF EXISTS "enable_delete_own_events" ON calendar_events;

-- Create simplified policies without recursion
CREATE POLICY "calendar_events_read"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "calendar_events_insert"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "calendar_events_update"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "calendar_events_delete"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);