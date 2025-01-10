-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can manage their calendar events" ON calendar_events;
DROP POLICY IF EXISTS "Users can view event attendance" ON calendar_attendees;
DROP POLICY IF EXISTS "Users can manage their attendance" ON calendar_attendees;

-- Create calendar_events table if not exists
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  type text NOT NULL CHECK (type IN ('meeting', 'task', 'reminder', 'other')),
  status text NOT NULL CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  recurrence jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create calendar_attendees table if not exists
CREATE TABLE IF NOT EXISTS calendar_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES calendar_events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  response text CHECK (response IN ('accepted', 'declined', 'maybe', 'pending')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_attendees ENABLE ROW LEVEL SECURITY;

-- Create new policies with unique names
CREATE POLICY "calendar_events_view_policy"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    id IN (
      SELECT event_id FROM calendar_attendees WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "calendar_events_manage_policy"
  ON calendar_events FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "calendar_attendees_view_policy"
  ON calendar_attendees FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    event_id IN (
      SELECT id FROM calendar_events WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "calendar_attendees_manage_policy"
  ON calendar_attendees FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_attendees_event_id ON calendar_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_calendar_attendees_user_id ON calendar_attendees(user_id);