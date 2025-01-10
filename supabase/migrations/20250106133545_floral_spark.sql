-- Drop all existing calendar event policies
DROP POLICY IF EXISTS "calendar_events_view_all" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_insert_own" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_update_own" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_delete_own" ON calendar_events;

-- Create new simplified policies
CREATE POLICY "enable_read_all_events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "enable_insert_own_events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "enable_update_own_events"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "enable_delete_own_events"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Add index for user_id if not exists
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);