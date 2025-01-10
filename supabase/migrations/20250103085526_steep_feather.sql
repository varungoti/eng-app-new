-- Drop existing tables if they exist
DROP TABLE IF EXISTS sales_activities CASCADE;
DROP TABLE IF EXISTS sales_opportunities CASCADE;
DROP TABLE IF EXISTS sales_contacts CASCADE;
DROP TABLE IF EXISTS sales_leads CASCADE;

-- Create sales_leads table
CREATE TABLE IF NOT EXISTS sales_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  status text NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost')),
  source text,
  assigned_to uuid REFERENCES auth.users(id),
  estimated_value numeric(10,2),
  probability integer CHECK (probability >= 0 AND probability <= 100),
  expected_close_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sales_activities table
CREATE TABLE IF NOT EXISTS sales_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES sales_leads(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'note', 'task')),
  subject text NOT NULL,
  description text,
  status text CHECK (status IN ('planned', 'completed', 'cancelled')),
  due_date timestamptz,
  completed_at timestamptz,
  performed_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Create sales_opportunities table
CREATE TABLE IF NOT EXISTS sales_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES sales_leads(id) ON DELETE CASCADE,
  name text NOT NULL,
  stage text NOT NULL CHECK (stage IN ('discovery', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  amount numeric(10,2),
  close_date date,
  probability integer CHECK (probability >= 0 AND probability <= 100),
  next_step text,
  competition text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sales_contacts table
CREATE TABLE IF NOT EXISTS sales_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES sales_leads(id) ON DELETE CASCADE,
  name text NOT NULL,
  title text,
  email text,
  phone text,
  is_primary boolean DEFAULT false,
  department text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_contacts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Sales team can view all leads" ON sales_leads;
DROP POLICY IF EXISTS "Sales team can create leads" ON sales_leads;
DROP POLICY IF EXISTS "Sales team can update assigned leads" ON sales_leads;
DROP POLICY IF EXISTS "Sales team can view activities" ON sales_activities;
DROP POLICY IF EXISTS "Sales team can create activities" ON sales_activities;
DROP POLICY IF EXISTS "Sales team can view opportunities" ON sales_opportunities;
DROP POLICY IF EXISTS "Sales team can manage opportunities" ON sales_opportunities;
DROP POLICY IF EXISTS "Sales team can view contacts" ON sales_contacts;
DROP POLICY IF EXISTS "Sales team can manage contacts" ON sales_contacts;

-- Create policies
DO $$ BEGIN
  -- Sales Leads policies
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

  -- Sales Activities policies
  CREATE POLICY "Sales team can view activities"
    ON sales_activities FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head', 'sales_lead', 'sales_executive'));

  CREATE POLICY "Sales team can create activities"
    ON sales_activities FOR INSERT
    TO authenticated
    WITH CHECK (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head', 'sales_lead', 'sales_executive'));

  -- Sales Opportunities policies
  CREATE POLICY "Sales team can view opportunities"
    ON sales_opportunities FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head', 'sales_lead', 'sales_executive'));

  CREATE POLICY "Sales team can manage opportunities"
    ON sales_opportunities FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head', 'sales_lead', 'sales_executive'));

  -- Sales Contacts policies
  CREATE POLICY "Sales team can view contacts"
    ON sales_contacts FOR SELECT
    TO authenticated
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head', 'sales_lead', 'sales_executive'));

  CREATE POLICY "Sales team can manage contacts"
    ON sales_contacts FOR ALL
    TO authenticated
    USING (auth.jwt() ->> 'role' IN ('super_admin', 'admin', 'sales_head', 'sales_lead', 'sales_executive'));
END $$;