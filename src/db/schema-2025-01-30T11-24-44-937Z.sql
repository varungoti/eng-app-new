-- Database Schema Export
-- Generated at: 2025-01-30T11:24:29.186Z

-- Table: exercise_prompts
CREATE TABLE IF NOT EXISTS exercise_prompts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  text text NOT NULL,
  media text,
  type text,
  narration text,
  saytext text,
  question_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  user_id uuid,
  order_index bigint NOT NULL,
  CONSTRAINT exercise_prompts_pkey PRIMARY KEY,
  CONSTRAINT exercise_prompts_question_id_fkey FOREIGN KEY,
  CONSTRAINT exercise_prompts_type_check CHECK,
  CONSTRAINT exercise_prompts_user_id_fkey FOREIGN KEY
);

-- Table: students
CREATE TABLE IF NOT EXISTS students (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  last_name text NOT NULL,
  roll_number text NOT NULL,
  school_id uuid,
  grade_id uuid,
  gender text,
  date_of_birth date,
  contact_number text,
  email text,
  address text,
  guardian_name text,
  guardian_contact text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  first_name text,
  CONSTRAINT fk_student_grade FOREIGN KEY,
  CONSTRAINT students_gender_check CHECK,
  CONSTRAINT students_pkey PRIMARY KEY,
  CONSTRAINT students_school_id_fkey FOREIGN KEY,
  CONSTRAINT students_school_id_roll_number_key UNIQUE
);

-- Table: sales_leads
CREATE TABLE IF NOT EXISTS sales_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  status text NOT NULL,
  source text,
  assigned_to uuid,
  estimated_value numeric,
  probability integer,
  expected_close_date date,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sales_leads_assigned_to_fkey FOREIGN KEY,
  CONSTRAINT sales_leads_pkey PRIMARY KEY,
  CONSTRAINT sales_leads_probability_check CHECK,
  CONSTRAINT sales_leads_status_check CHECK
);

-- Table: sales_activities
CREATE TABLE IF NOT EXISTS sales_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lead_id uuid,
  type text NOT NULL,
  subject text NOT NULL,
  description text,
  status text,
  due_date timestamp with time zone,
  completed_at timestamp with time zone,
  performed_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sales_activities_lead_id_fkey FOREIGN KEY,
  CONSTRAINT sales_activities_performed_by_fkey FOREIGN KEY,
  CONSTRAINT sales_activities_pkey PRIMARY KEY,
  CONSTRAINT sales_activities_status_check CHECK,
  CONSTRAINT sales_activities_type_check CHECK
);

-- Table: sales_opportunities
CREATE TABLE IF NOT EXISTS sales_opportunities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lead_id uuid,
  name text NOT NULL,
  stage text NOT NULL,
  amount numeric,
  close_date date,
  probability integer,
  next_step text,
  competition text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sales_opportunities_lead_id_fkey FOREIGN KEY,
  CONSTRAINT sales_opportunities_pkey PRIMARY KEY,
  CONSTRAINT sales_opportunities_probability_check CHECK,
  CONSTRAINT sales_opportunities_stage_check CHECK
);

-- Table: user_preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_preferences_pkey PRIMARY KEY,
  CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY,
  CONSTRAINT user_preferences_user_id_key UNIQUE
);

-- Table: sales_contacts
CREATE TABLE IF NOT EXISTS sales_contacts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lead_id uuid,
  name text NOT NULL,
  title text,
  email text,
  phone text,
  is_primary boolean DEFAULT false,
  department text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sales_contacts_lead_id_fkey FOREIGN KEY,
  CONSTRAINT sales_contacts_pkey PRIMARY KEY
);

-- Table: user_schools
CREATE TABLE IF NOT EXISTS user_schools (
  user_id uuid NOT NULL,
  school_id uuid NOT NULL,
  CONSTRAINT user_schools_pkey PRIMARY KEY,
  CONSTRAINT user_schools_user_id_fkey FOREIGN KEY
);

-- Table: dashboards
CREATE TABLE IF NOT EXISTS dashboards (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  layout jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_default boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT dashboards_pkey PRIMARY KEY,
  CONSTRAINT dashboards_user_id_fkey FOREIGN KEY
);

-- Table: schools
CREATE TABLE IF NOT EXISTS schools (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  parent_id uuid,
  address text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  contact_number text NOT NULL,
  email text NOT NULL,
  status text NOT NULL,
  capacity integer NOT NULL,
  principal_name text NOT NULL,
  website text,
  established_year integer,
  accreditation_status text,
  facilities jsonb DEFAULT '{}'::jsonb,
  operating_hours jsonb DEFAULT '{}'::jsonb,
  social_media jsonb DEFAULT '{}'::jsonb,
  emergency_contact text,
  tax_id text,
  license_number text,
  last_inspection_date date,
  student_count integer DEFAULT 0,
  staff_count integer DEFAULT 0,
  classroom_count integer DEFAULT 0,
  is_boarding boolean DEFAULT false,
  transportation_provided boolean DEFAULT false,
  curriculum_type ARRAY DEFAULT '{}'::text[],
  languages_offered ARRAY DEFAULT '{}'::text[],
  extracurricular_activities ARRAY DEFAULT '{}'::text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  grades ARRAY DEFAULT '{}'::text[],
  school_type USER-DEFINED NOT NULL DEFAULT 'public'::school_category,
  school_level USER-DEFINED NOT NULL DEFAULT 'elementary'::school_level,
  classes ARRAY DEFAULT '{}'::jsonb[],
  CONSTRAINT check_capacity CHECK,
  CONSTRAINT check_email CHECK,
  CONSTRAINT check_latitude CHECK,
  CONSTRAINT check_longitude CHECK,
  CONSTRAINT schools_parent_id_fkey FOREIGN KEY,
  CONSTRAINT schools_pkey PRIMARY KEY,
  CONSTRAINT schools_status_check CHECK,
  CONSTRAINT schools_type_check CHECK
);

-- Table: school_grades
CREATE TABLE IF NOT EXISTS school_grades (
  school_id uuid NOT NULL,
  grade_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT school_grades_pkey PRIMARY KEY,
  CONSTRAINT school_grades_school_id_fkey FOREIGN KEY
);

-- Table: staff
CREATE TABLE IF NOT EXISTS staff (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  school_id uuid,
  department text,
  status text NOT NULL DEFAULT 'active'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT staff_email_key UNIQUE,
  CONSTRAINT staff_pkey PRIMARY KEY,
  CONSTRAINT staff_school_id_fkey FOREIGN KEY,
  CONSTRAINT staff_status_check CHECK
);

-- Table: grades
CREATE TABLE IF NOT EXISTS grades (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  level integer NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT grades_pkey PRIMARY KEY
);

-- Table: topics
CREATE TABLE IF NOT EXISTS topics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  grade_id uuid NOT NULL,
  order_index integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  course_id uuid,
  CONSTRAINT topics_course_id_fkey FOREIGN KEY,
  CONSTRAINT topics_grade_id_fkey FOREIGN KEY,
  CONSTRAINT topics_pkey PRIMARY KEY
);

-- Table: subtopics
CREATE TABLE IF NOT EXISTS subtopics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  topic_id uuid NOT NULL,
  order_index integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  name text,
  CONSTRAINT subtopics_pkey PRIMARY KEY,
  CONSTRAINT subtopics_topic_id_fkey FOREIGN KEY
);

-- Table: lesson_content
CREATE TABLE IF NOT EXISTS lesson_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  lesson_id uuid,
  content_type character varying,
  metadata jsonb,
  order_index integer,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  user_id uuid,
  content ARRAY,
  created_at timestamp with time zone,
  CONSTRAINT lesson_content_lesson_id_fkey FOREIGN KEY,
  CONSTRAINT lesson_content_pkey PRIMARY KEY,
  CONSTRAINT lesson_content_user_id_fkey FOREIGN KEY
);

-- Table: lessons
CREATE TABLE IF NOT EXISTS lessons (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  content text,
  grade_id uuid,
  topic_id uuid,
  subtopic_id uuid NOT NULL,
  order_index integer,
  status character varying DEFAULT 'draft'::character varying,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  description text,
  media_type USER-DEFINED,
  media_url text,
  duration bigint,
  subjectId text,
  contentheading text,
  user_id uuid,
  CONSTRAINT lessons_grade_id_fkey FOREIGN KEY,
  CONSTRAINT lessons_pkey PRIMARY KEY,
  CONSTRAINT lessons_subtopic_id_fkey FOREIGN KEY,
  CONSTRAINT lessons_topic_id_fkey FOREIGN KEY,
  CONSTRAINT lessons_user_id_fkey FOREIGN KEY
);

-- Table: sections
CREATE TABLE IF NOT EXISTS sections (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  class_id uuid,
  room_no integer,
  room_location text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT sections_class_id_fkey FOREIGN KEY,
  CONSTRAINT sections_pkey PRIMARY KEY
);

-- Table: _health
CREATE TABLE IF NOT EXISTS _health (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  last_check timestamp with time zone DEFAULT now(),
  status text DEFAULT 'healthy'::text,
  CONSTRAINT _health_pkey PRIMARY KEY
);

-- Table: section_students
CREATE TABLE IF NOT EXISTS section_students (
  section_id uuid NOT NULL,
  student_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT section_students_pkey PRIMARY KEY,
  CONSTRAINT section_students_section_id_fkey FOREIGN KEY,
  CONSTRAINT section_students_student_id_fkey FOREIGN KEY
);

-- Table: questions
CREATE TABLE IF NOT EXISTS questions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  content text,
  type USER-DEFINED NOT NULL,
  lesson_id uuid NOT NULL,
  points integer DEFAULT 0,
  metadata jsonb,
  order_index integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  correct_answer text,
  user_id uuid,
  exercise_prompts ARRAY DEFAULT ARRAY[]::jsonb[],
  CONSTRAINT questions_lesson_id_fkey FOREIGN KEY,
  CONSTRAINT questions_pkey PRIMARY KEY,
  CONSTRAINT questions_user_id_fkey FOREIGN KEY
);

-- Table: loading_states
CREATE TABLE IF NOT EXISTS loading_states (
  id uuid NOT NULL,
  component text NOT NULL,
  status text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT loading_states_pkey PRIMARY KEY
);

-- Table: role_settings
CREATE TABLE IF NOT EXISTS role_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  role_key text NOT NULL,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT role_settings_pkey PRIMARY KEY,
  CONSTRAINT role_settings_role_key_key UNIQUE
);

-- Table: courses
CREATE TABLE IF NOT EXISTS courses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  document_id text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  level numeric,
  progress integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT courses_document_id_key UNIQUE,
  CONSTRAINT courses_level_key UNIQUE,
  CONSTRAINT courses_pkey PRIMARY KEY
);

-- Table: events
CREATE TABLE IF NOT EXISTS events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  location text NOT NULL,
  attendees integer DEFAULT 0,
  type text NOT NULL,
  status text NOT NULL,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  school_id uuid,
  department text,
  CONSTRAINT events_created_by_fkey FOREIGN KEY,
  CONSTRAINT events_department_check CHECK,
  CONSTRAINT events_pkey PRIMARY KEY,
  CONSTRAINT events_school_id_fkey FOREIGN KEY,
  CONSTRAINT events_status_check CHECK,
  CONSTRAINT events_type_check CHECK
);

-- Table: onboarding_tasks
CREATE TABLE IF NOT EXISTS onboarding_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  required boolean DEFAULT true,
  order_index integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT onboarding_tasks_category_check CHECK,
  CONSTRAINT onboarding_tasks_pkey PRIMARY KEY
);

-- Table: onboarding_progress
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  school_id uuid,
  task_id uuid,
  status text NOT NULL,
  notes text,
  completed_by uuid,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT onboarding_progress_completed_by_fkey FOREIGN KEY,
  CONSTRAINT onboarding_progress_pkey PRIMARY KEY,
  CONSTRAINT onboarding_progress_school_id_fkey FOREIGN KEY,
  CONSTRAINT onboarding_progress_school_id_task_id_key UNIQUE,
  CONSTRAINT onboarding_progress_status_check CHECK,
  CONSTRAINT onboarding_progress_task_id_fkey FOREIGN KEY
);

-- Table: school_documents
CREATE TABLE IF NOT EXISTS school_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  school_id uuid,
  type text NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  status text NOT NULL,
  notes text,
  uploaded_by uuid,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  valid_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT school_documents_pkey PRIMARY KEY,
  CONSTRAINT school_documents_reviewed_by_fkey FOREIGN KEY,
  CONSTRAINT school_documents_school_id_fkey FOREIGN KEY,
  CONSTRAINT school_documents_status_check CHECK,
  CONSTRAINT school_documents_type_check CHECK,
  CONSTRAINT school_documents_uploaded_by_fkey FOREIGN KEY
);

-- Table: class_teachers
CREATE TABLE IF NOT EXISTS class_teachers (
  class_id uuid NOT NULL,
  teacher_id uuid NOT NULL,
  assigned_by uuid,
  assigned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT class_teachers_assigned_by_fkey FOREIGN KEY,
  CONSTRAINT class_teachers_class_id_fkey FOREIGN KEY,
  CONSTRAINT class_teachers_pkey PRIMARY KEY,
  CONSTRAINT class_teachers_teacher_id_fkey FOREIGN KEY
);

-- Table: class_students
CREATE TABLE IF NOT EXISTS class_students (
  class_id uuid NOT NULL,
  student_id uuid NOT NULL,
  assigned_by uuid,
  assigned_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT class_students_assigned_by_fkey FOREIGN KEY,
  CONSTRAINT class_students_class_id_fkey FOREIGN KEY,
  CONSTRAINT class_students_pkey PRIMARY KEY,
  CONSTRAINT class_students_student_id_fkey FOREIGN KEY
);

-- Table: assigned_content
CREATE TABLE IF NOT EXISTS assigned_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  class_id uuid,
  content_type character varying NOT NULL,
  content_id uuid NOT NULL,
  valid_from timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  valid_until timestamp with time zone DEFAULT (CURRENT_TIMESTAMP + '7 days'::interval),
  assigned_by uuid,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT assigned_content_assigned_by_fkey FOREIGN KEY,
  CONSTRAINT assigned_content_class_id_fkey FOREIGN KEY,
  CONSTRAINT assigned_content_content_type_check CHECK,
  CONSTRAINT assigned_content_pkey PRIMARY KEY
);

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL,
  name character varying NOT NULL,
  role character varying NOT NULL,
  school_id uuid,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_email_key UNIQUE,
  CONSTRAINT users_pkey PRIMARY KEY,
  CONSTRAINT users_pkey PRIMARY KEY,
  CONSTRAINT users_role_check CHECK
);

-- Table: classes
CREATE TABLE IF NOT EXISTS classes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  grade_id uuid,
  created_by uuid,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  section text,
  CONSTRAINT classes_created_by_fkey FOREIGN KEY,
  CONSTRAINT classes_grade_id_fkey FOREIGN KEY,
  CONSTRAINT classes_pkey PRIMARY KEY
);

-- Table: user_permissions
CREATE TABLE IF NOT EXISTS user_permissions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  permissions jsonb NOT NULL DEFAULT '{"content_editor": false, "content_management": false}'::jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_permissions_pkey PRIMARY KEY,
  CONSTRAINT user_permissions_user_id_fkey FOREIGN KEY,
  CONSTRAINT user_permissions_user_id_key UNIQUE
);

-- Table: event_notifications
CREATE TABLE IF NOT EXISTS event_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid,
  user_id uuid,
  type text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_notifications_event_id_fkey FOREIGN KEY,
  CONSTRAINT event_notifications_pkey PRIMARY KEY,
  CONSTRAINT event_notifications_type_check CHECK,
  CONSTRAINT event_notifications_user_id_fkey FOREIGN KEY
);

-- Table: user_preference
CREATE TABLE IF NOT EXISTS user_preference (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_preference_pkey PRIMARY KEY,
  CONSTRAINT user_preference_user_id_fkey FOREIGN KEY,
  CONSTRAINT user_preference_user_id_key UNIQUE
);

-- Table: activities
CREATE TABLE IF NOT EXISTS activities (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  lesson_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  content text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  name text NOT NULL,
  instructions text,
  data jsonb DEFAULT jsonb_build_object('prompt', '', 'teacherScript', '', 'media', ARRAY[]::text[]),
  media ARRAY DEFAULT ARRAY[]::jsonb[],
  order_index bigint NOT NULL,
  CONSTRAINT activities_lesson_id_fkey FOREIGN KEY,
  CONSTRAINT activities_pkey PRIMARY KEY,
  CONSTRAINT activities_type_check CHECK
);

-- Table: event_attendees
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid,
  user_id uuid,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_attendees_event_id_fkey FOREIGN KEY,
  CONSTRAINT event_attendees_event_id_user_id_key UNIQUE,
  CONSTRAINT event_attendees_pkey PRIMARY KEY,
  CONSTRAINT event_attendees_status_check CHECK,
  CONSTRAINT event_attendees_user_id_fkey FOREIGN KEY
);

-- Table: event_reminders
CREATE TABLE IF NOT EXISTS event_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid,
  user_id uuid,
  remind_at timestamp with time zone NOT NULL,
  sent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_reminders_event_id_fkey FOREIGN KEY,
  CONSTRAINT event_reminders_pkey PRIMARY KEY,
  CONSTRAINT event_reminders_user_id_fkey FOREIGN KEY
);

-- Table: documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  url text NOT NULL,
  size integer NOT NULL,
  mime_type text NOT NULL,
  tags ARRAY DEFAULT '{}'::text[],
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT documents_created_by_fkey FOREIGN KEY,
  CONSTRAINT documents_pkey PRIMARY KEY
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY,
  CONSTRAINT notifications_type_check CHECK,
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY
);

-- Table: reports
CREATE TABLE IF NOT EXISTS reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  type text NOT NULL,
  status text NOT NULL,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  url text,
  error text,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reports_created_by_fkey FOREIGN KEY,
  CONSTRAINT reports_pkey PRIMARY KEY,
  CONSTRAINT reports_status_check CHECK
);

-- Table: tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  assigned_to uuid,
  due_date timestamp with time zone NOT NULL,
  priority text NOT NULL,
  status text NOT NULL,
  tags ARRAY DEFAULT '{}'::text[],
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY,
  CONSTRAINT tasks_created_by_fkey FOREIGN KEY,
  CONSTRAINT tasks_pkey PRIMARY KEY,
  CONSTRAINT tasks_priority_check CHECK,
  CONSTRAINT tasks_status_check CHECK
);

-- Table: analytics_metrics
CREATE TABLE IF NOT EXISTS analytics_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  value numeric NOT NULL,
  unit text NOT NULL,
  category text NOT NULL,
  tags jsonb DEFAULT '{}'::jsonb,
  timestamp timestamp with time zone DEFAULT now(),
  CONSTRAINT analytics_metrics_pkey PRIMARY KEY
);

-- Table: messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sender_id uuid,
  recipient_id uuid,
  subject text NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT messages_pkey PRIMARY KEY,
  CONSTRAINT messages_pkey PRIMARY KEY,
  CONSTRAINT messages_recipient_id_fkey FOREIGN KEY,
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY
);

-- Table: message_threads
CREATE TABLE IF NOT EXISTS message_threads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  participants ARRAY NOT NULL,
  subject text NOT NULL,
  last_message_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT message_threads_pkey PRIMARY KEY
);

-- Table: branches
CREATE TABLE IF NOT EXISTS branches (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  school_id uuid,
  location jsonb NOT NULL DEFAULT '{"city": "", "state": "", "address": "", "country": "", "postalCode": "", "coordinates": {"latitude": 0, "longitude": 0}}'::jsonb,
  latitude double precision NOT NULL DEFAULT 0,
  longitude double precision NOT NULL DEFAULT 0,
  contact_number text NOT NULL DEFAULT ''::text,
  email text NOT NULL DEFAULT ''::text,
  status USER-DEFINED NOT NULL DEFAULT 'active'::school_status,
  capacity jsonb NOT NULL DEFAULT '{"total": 0, "current": 0}'::jsonb,
  administration jsonb NOT NULL DEFAULT '{"principalName": "", "principalEmail": "", "principalPhone": "", "administrativeStaff": []}'::jsonb,
  website text,
  established_year integer,
  accreditation_status text,
  facilities ARRAY DEFAULT '{}'::text[],
  operating_hours jsonb NOT NULL DEFAULT '{"friday": {"open": "8:00 AM", "close": "3:00 PM"}, "monday": {"open": "8:00 AM", "close": "3:00 PM"}, "sunday": {"open": "Closed", "close": "Closed", "isHoliday": true}, "tuesday": {"open": "8:00 AM", "close": "3:00 PM"}, "saturday": {"open": "8:00 AM", "close": "12:00 PM"}, "thursday": {"open": "8:00 AM", "close": "3:00 PM"}, "wednesday": {"open": "8:00 AM", "close": "3:00 PM"}}'::jsonb,
  social_media jsonb DEFAULT '{"twitter": null, "facebook": null, "linkedin": null, "instagram": null}'::jsonb,
  emergency_contact text,
  tax_id text,
  license_number text,
  last_inspection_date timestamp with time zone,
  student_count integer DEFAULT 0,
  staff_count integer DEFAULT 0,
  classroom_count integer DEFAULT 0,
  is_boarding boolean DEFAULT false,
  transportation_provided boolean DEFAULT false,
  curriculum_type ARRAY DEFAULT '{}'::text[],
  languages_offered ARRAY DEFAULT '{}'::text[],
  extracurricular_activities ARRAY DEFAULT '{}'::text[],
  grades ARRAY DEFAULT '{}'::text[],
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT branches_pkey PRIMARY KEY,
  CONSTRAINT branches_school_id_fkey FOREIGN KEY
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY
);

-- Table: calendar_events
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  title text NOT NULL,
  description text,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  location text,
  type text NOT NULL,
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT calendar_events_pkey PRIMARY KEY,
  CONSTRAINT calendar_events_status_check CHECK,
  CONSTRAINT calendar_events_type_check CHECK,
  CONSTRAINT calendar_events_user_id_fkey FOREIGN KEY
);

