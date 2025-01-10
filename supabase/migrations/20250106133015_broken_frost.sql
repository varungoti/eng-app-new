-- Add sample calendar events
INSERT INTO calendar_events (
  user_id,
  title,
  description,
  start_time,
  end_time,
  location,
  type,
  status
) 
SELECT 
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1),
  title,
  description,
  start_time,
  end_time,
  location,
  type,
  status
FROM (VALUES
  (
    'Staff Meeting',
    'Monthly staff review and planning session',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '10 hours',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '11 hours 30 minutes',
    'Conference Room A',
    'meeting',
    'scheduled'
  ),
  (
    'Content Review',
    'Review new curriculum materials for Grade 5',
    CURRENT_DATE + INTERVAL '2 days' + INTERVAL '14 hours',
    CURRENT_DATE + INTERVAL '2 days' + INTERVAL '15 hours 30 minutes',
    'Virtual Meeting Room',
    'meeting',
    'scheduled'
  ),
  (
    'Submit Monthly Report',
    'Complete and submit monthly progress report',
    CURRENT_DATE + INTERVAL '3 days' + INTERVAL '16 hours',
    CURRENT_DATE + INTERVAL '3 days' + INTERVAL '17 hours',
    'Online',
    'task',
    'scheduled'
  ),
  (
    'Teacher Training Session',
    'New platform features training for teachers',
    CURRENT_DATE + INTERVAL '5 days' + INTERVAL '9 hours',
    CURRENT_DATE + INTERVAL '5 days' + INTERVAL '12 hours',
    'Training Room B',
    'meeting',
    'scheduled'
  ),
  (
    'Parent-Teacher Meeting',
    'Discuss student progress and curriculum updates',
    CURRENT_DATE + INTERVAL '7 days' + INTERVAL '13 hours',
    CURRENT_DATE + INTERVAL '7 days' + INTERVAL '16 hours',
    'School Auditorium',
    'meeting',
    'scheduled'
  ),
  (
    'Curriculum Planning',
    'Plan next semester curriculum structure',
    CURRENT_DATE - INTERVAL '1 day' + INTERVAL '10 hours',
    CURRENT_DATE - INTERVAL '1 day' + INTERVAL '12 hours',
    'Meeting Room C',
    'meeting',
    'completed'
  ),
  (
    'System Maintenance',
    'Scheduled platform maintenance and updates',
    CURRENT_DATE + INTERVAL '10 days' + INTERVAL '22 hours',
    CURRENT_DATE + INTERVAL '10 days' + INTERVAL '23 hours',
    'Online',
    'task',
    'scheduled'
  ),
  (
    'Follow up with Schools',
    'Check implementation progress with new schools',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '15 hours',
    CURRENT_DATE + INTERVAL '1 day' + INTERVAL '16 hours',
    'Phone',
    'task',
    'scheduled'
  ),
  (
    'Content Creation Workshop',
    'Workshop on creating engaging educational content',
    CURRENT_DATE + INTERVAL '14 days' + INTERVAL '10 hours',
    CURRENT_DATE + INTERVAL '14 days' + INTERVAL '16 hours',
    'Training Center',
    'meeting',
    'scheduled'
  ),
  (
    'Weekly Team Sync',
    'Regular team status update and planning',
    CURRENT_DATE + INTERVAL '4 days' + INTERVAL '9 hours 30 minutes',
    CURRENT_DATE + INTERVAL '4 days' + INTERVAL '10 hours 30 minutes',
    'Conference Room B',
    'meeting',
    'scheduled'
  )
) AS sample_events(
  title,
  description,
  start_time,
  end_time,
  location,
  type,
  status
);

-- Add some recurring daily reminders
INSERT INTO calendar_events (
  user_id,
  title,
  description,
  start_time,
  end_time,
  location,
  type,
  status
)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1),
  'Daily Team Standup',
  'Quick team status update and blockers discussion',
  CURRENT_DATE + (n || ' days')::INTERVAL + INTERVAL '9 hours 30 minutes',
  CURRENT_DATE + (n || ' days')::INTERVAL + INTERVAL '10 hours',
  'Conference Room A',
  'meeting',
  'scheduled'
FROM generate_series(1, 30) n
WHERE n % 7 NOT IN (0, 6); -- Exclude weekends

-- Add some task reminders
INSERT INTO calendar_events (
  user_id,
  title,
  description,
  start_time,
  end_time,
  location,
  type,
  status
)
SELECT 
  (SELECT id FROM auth.users WHERE email = 'admin@example.com' LIMIT 1),
  'Review Progress Reports - Grade ' || n,
  'Review and approve progress reports for Grade ' || n,
  CURRENT_DATE + ((n * 2) || ' days')::INTERVAL + INTERVAL '13 hours',
  CURRENT_DATE + ((n * 2) || ' days')::INTERVAL + INTERVAL '14 hours',
  'Online',
  'task',
  'scheduled'
FROM generate_series(1, 6) n;