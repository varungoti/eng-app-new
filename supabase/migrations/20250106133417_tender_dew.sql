-- Drop existing policies
DROP POLICY IF EXISTS "calendar_events_view" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_create" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_modify" ON calendar_events;
DROP POLICY IF EXISTS "calendar_events_remove" ON calendar_events;

-- Create new simplified policies
CREATE POLICY "calendar_events_view_all"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "calendar_events_insert_own"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "calendar_events_update_own"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "calendar_events_delete_own"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);