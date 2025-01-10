-- Drop existing policies
DROP POLICY IF EXISTS "users_manage_own_events" ON calendar_events;
DROP POLICY IF EXISTS "users_own_events" ON calendar_events;
DROP POLICY IF EXISTS "users_can_view_invited_events" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_view_policy" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_manage_policy" ON calendar_events;

-- Create simplified policies without recursion
CREATE POLICY "calendar_events_select"
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
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "calendar_events_delete"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());