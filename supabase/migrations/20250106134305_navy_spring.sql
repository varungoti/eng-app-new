-- Drop all existing calendar event policies
DROP POLICY IF EXISTS "enable_read_all_events" ON calendar_events;
DROP POLICY IF EXISTS "enable_insert_own_events" ON calendar_events;
DROP POLICY IF EXISTS "enable_update_own_events" ON calendar_events;
DROP POLICY IF EXISTS "enable_delete_own_events" ON calendar_events;

-- Create new simplified policies without recursion
CREATE POLICY "calendar_read_policy"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "calendar_insert_policy"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "calendar_update_policy"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "calendar_delete_policy"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());