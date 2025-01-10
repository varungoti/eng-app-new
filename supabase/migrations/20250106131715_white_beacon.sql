-- Drop existing tables and policies
DROP TABLE IF EXISTS calendar_attendees CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;

-- Create calendar_events table
CREATE TABLE calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location text,
  type text NOT NULL CHECK (type IN ('meeting', 'task', 'reminder', 'other')),
  status text NOT NULL CHECK (status IN ('scheduled', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create calendar_attendees table
CREATE TABLE calendar_attendees (
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

-- Create RLS policies for calendar_events
CREATE POLICY "users_own_events"
  ON calendar_events
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_can_view_invited_events"
  ON calendar_events
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT event_id 
      FROM calendar_attendees 
      WHERE user_id = auth.uid()
    )
  );

-- Create RLS policies for calendar_attendees
CREATE POLICY "users_own_attendance"
  ON calendar_attendees
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "event_owners_manage_attendees"
  ON calendar_attendees
  FOR ALL
  TO authenticated
  USING (
    event_id IN (
      SELECT id 
      FROM calendar_events 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    event_id IN (
      SELECT id 
      FROM calendar_events 
      WHERE user_id = auth.uid()
    )
  );

-- Add indexes for better performance
CREATE INDEX idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_start_time ON calendar_events(start_time);
CREATE INDEX idx_calendar_attendees_event_id ON calendar_attendees(event_id);
CREATE INDEX idx_calendar_attendees_user_id ON calendar_attendees(user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();