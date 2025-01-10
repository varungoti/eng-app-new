-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text NOT NULL,
  attendees integer DEFAULT 0,
  type text NOT NULL CHECK (type IN ('academic', 'administrative', 'training', 'meeting', 'other')),
  status text NOT NULL CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  school_id uuid REFERENCES schools(id),
  department text CHECK (department IN ('academic', 'administrative', 'hr', 'finance', 'other')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event_attendees table for tracking attendance
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('attending', 'declined', 'maybe')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create event_reminders table
CREATE TABLE IF NOT EXISTS event_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  remind_at timestamptz NOT NULL,
  sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_reminders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view relevant events" ON events;
DROP POLICY IF EXISTS "Users with create permission can add events" ON events;
DROP POLICY IF EXISTS "Users with edit permission can update their events" ON events;
DROP POLICY IF EXISTS "Users with delete permission can delete events" ON events;
DROP POLICY IF EXISTS "Users can view event attendance" ON event_attendees;
DROP POLICY IF EXISTS "Users can manage their own attendance" ON event_attendees;
DROP POLICY IF EXISTS "Users can view their reminders" ON event_reminders;
DROP POLICY IF EXISTS "Users can manage their reminders" ON event_reminders;

-- Create new policies
CREATE POLICY "view_events"
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

CREATE POLICY "create_events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader', 'school_principal')
  );

CREATE POLICY "update_events"
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

CREATE POLICY "delete_events"
  ON events FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    auth.jwt() ->> 'role' IN ('super_admin', 'admin')
  );

-- Create policies for event_attendees
CREATE POLICY "view_attendance"
  ON event_attendees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "manage_attendance"
  ON event_attendees FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create policies for event_reminders
CREATE POLICY "view_reminders"
  ON event_reminders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "manage_reminders"
  ON event_reminders FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());