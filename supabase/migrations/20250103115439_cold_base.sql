-- Create event notifications table
CREATE TABLE IF NOT EXISTS event_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('reminder', 'update', 'cancellation')),
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE event_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications"
  ON event_notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Event creators can create notifications"
  ON event_notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE id = event_id
      AND created_by = auth.uid()
    )
  );

-- Add trigger to automatically notify relevant users when an event is created/updated
CREATE OR REPLACE FUNCTION notify_event_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Notify relevant users based on department and school_id
    INSERT INTO event_notifications (event_id, user_id, type, message)
    SELECT 
      NEW.id,
      u.id,
      'reminder',
      'New event: ' || NEW.title
    FROM auth.users u
    WHERE 
      (u.raw_user_meta_data->>'role' IN ('super_admin', 'admin')) OR
      (NEW.school_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM user_schools us 
        WHERE us.user_id = u.id AND us.school_id = NEW.school_id
      ));
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER event_notification_trigger
  AFTER INSERT OR UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION notify_event_changes();