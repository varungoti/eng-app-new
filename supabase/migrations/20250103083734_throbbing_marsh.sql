/*
  # Add Sales and Onboarding Schema

  1. New Tables
    - sales_leads: Track potential school leads
    - sales_activities: Track sales team activities
    - onboarding_tasks: Define onboarding checklist items
    - onboarding_progress: Track school onboarding progress
    - school_documents: Store required school documentation

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
*/

-- Create sales_leads table
CREATE TABLE sales_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text NOT NULL,
  contact_person text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text,
  status text NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  assigned_to uuid REFERENCES auth.users(id),
  estimated_value numeric(10,2),
  notes text,
  next_follow_up timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sales_activities table
CREATE TABLE sales_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES sales_leads(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'proposal', 'demo')),
  notes text,
  outcome text,
  performed_by uuid REFERENCES auth.users(id),
  performed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create onboarding_tasks table
CREATE TABLE onboarding_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL CHECK (category IN ('documentation', 'setup', 'training', 'compliance')),
  required boolean DEFAULT true,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create onboarding_progress table
CREATE TABLE onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  task_id uuid REFERENCES onboarding_tasks(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  notes text,
  completed_by uuid REFERENCES auth.users(id),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(school_id, task_id)
);

-- Create school_documents table
CREATE TABLE school_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES schools(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('license', 'registration', 'tax', 'insurance', 'curriculum', 'other')),
  name text NOT NULL,
  url text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  notes text,
  uploaded_by uuid REFERENCES auth.users(id),
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  valid_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Sales Leads
CREATE POLICY "Sales team can view all leads"
  ON sales_leads FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head', 'sales_lead', 'sales_executive'));

CREATE POLICY "Sales team can create leads"
  ON sales_leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head', 'sales_lead', 'sales_executive'));

CREATE POLICY "Sales team can update assigned leads"
  ON sales_leads FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head')
    OR
    (auth.jwt() ->> 'role' IN ('sales_lead', 'sales_executive') AND assigned_to = auth.uid())
  );

-- Sales Activities
CREATE POLICY "Sales team can view activities"
  ON sales_activities FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head', 'sales_lead', 'sales_executive'));

CREATE POLICY "Sales team can create activities"
  ON sales_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head', 'sales_lead', 'sales_executive'));

-- Onboarding Tasks
CREATE POLICY "Authenticated users can view tasks"
  ON onboarding_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage tasks"
  ON onboarding_tasks FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin'))
  WITH CHECK (auth.jwt() ->> 'role' IN ('super_admin', 'admin'));

-- Onboarding Progress
CREATE POLICY "School staff can view their progress"
  ON onboarding_progress FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader', 'school_principal')
    OR
    school_id IN (
      SELECT school_id FROM user_schools WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "School staff can update their progress"
  ON onboarding_progress FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader', 'school_principal')
    OR
    school_id IN (
      SELECT school_id FROM user_schools WHERE user_id = auth.uid()
    )
  );

-- School Documents
CREATE POLICY "School staff can view their documents"
  ON school_documents FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader', 'school_principal')
    OR
    school_id IN (
      SELECT school_id FROM user_schools WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "School staff can upload documents"
  ON school_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'school_leader', 'school_principal')
    OR
    school_id IN (
      SELECT school_id FROM user_schools WHERE user_id = auth.uid()
    )
  );

-- Insert default onboarding tasks
INSERT INTO onboarding_tasks (title, description, category, required, order_index) VALUES
  ('Submit School License', 'Upload valid school operating license', 'documentation', true, 1),
  ('Submit Tax Registration', 'Upload tax registration certificate', 'documentation', true, 2),
  ('Complete School Profile', 'Fill in all required school information', 'setup', true, 3),
  ('Set Up Grade Levels', 'Configure grade levels offered', 'setup', true, 4),
  ('Add Staff Members', 'Add teachers and staff to the system', 'setup', true, 5),
  ('Complete Admin Training', 'Complete required administrative training', 'training', true, 6),
  ('Complete Teacher Training', 'Ensure teachers complete basic training', 'training', true, 7),
  ('Set Up Emergency Contacts', 'Add emergency contact information', 'compliance', true, 8),
  ('Review Safety Procedures', 'Review and acknowledge safety procedures', 'compliance', true, 9),
  ('Configure Communication', 'Set up communication preferences', 'setup', false, 10);

-- Add updated_at triggers
CREATE TRIGGER set_timestamp_sales_leads
  BEFORE UPDATE ON sales_leads
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_onboarding_tasks
  BEFORE UPDATE ON onboarding_tasks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_onboarding_progress
  BEFORE UPDATE ON onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_school_documents
  BEFORE UPDATE ON school_documents
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();