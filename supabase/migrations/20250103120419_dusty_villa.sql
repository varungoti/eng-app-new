-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view relevant events" ON events;
DROP POLICY IF EXISTS "Users with create permission can add events" ON events;
DROP POLICY IF EXISTS "Users with edit permission can update their events" ON events;
DROP POLICY IF EXISTS "Users with delete permission can delete events" ON events;
DROP POLICY IF EXISTS "Users can view event attendance" ON event_attendees;
DROP POLICY IF EXISTS "Users can manage their own attendance" ON event_attendees;
DROP POLICY IF EXISTS "Users can view their reminders" ON event_reminders;
DROP POLICY IF EXISTS "Users can manage their reminders" ON event_reminders;
DROP POLICY IF EXISTS "view_events" ON events;
DROP POLICY IF EXISTS "create_events" ON events;
DROP POLICY IF EXISTS "update_events" ON events;
DROP POLICY IF EXISTS "delete_events" ON events;
DROP POLICY IF EXISTS "view_attendance" ON event_attendees;
DROP POLICY IF EXISTS "manage_attendance" ON event_attendees;
DROP POLICY IF EXISTS "view_reminders" ON event_reminders;
DROP POLICY IF EXISTS "manage_reminders" ON event_reminders;

-- Create new policies with unique names
CREATE POLICY "events_view_policy"
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

CREATE POLICY "events_create_policy"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader', 'school_principal')
  );

CREATE POLICY "events_update_policy"
  ON events FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader')
  )
  WITH CHECK (
    created_by = auth.uid() OR
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader')
  );

CREATE POLICY "events_delete_policy"
  ON events FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    auth.jwt() ->> 'role' IN ('super_admin', 'admin')
  );

-- Create policies for event_attendees
CREATE POLICY "attendees_view_policy"
  ON event_attendees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "attendees_manage_policy"
  ON event_attendees FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for event_reminders
CREATE POLICY "reminders_view_policy"
  ON event_reminders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "reminders_manage_policy"
  ON event_reminders FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_school_id ON events(school_id);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_department ON events(department);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for all event-related tables
DO $$ BEGIN
  CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_event_attendees_updated_at
    BEFORE UPDATE ON event_attendees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_event_reminders_updated_at
    BEFORE UPDATE ON event_reminders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;