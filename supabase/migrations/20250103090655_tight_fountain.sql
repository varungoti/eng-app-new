/*
  # Fix database schema and add missing tables

  1. Changes
    - Drop duplicate tables from previous migrations
    - Recreate tables with proper constraints
    - Add proper indexes
    - Update RLS policies
*/

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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_sales_leads_status ON sales_leads(status);
CREATE INDEX IF NOT EXISTS idx_sales_leads_assigned_to ON sales_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_sales_activities_lead_id ON sales_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_sales_opportunities_lead_id ON sales_opportunities(lead_id);
CREATE INDEX IF NOT EXISTS idx_sales_contacts_lead_id ON sales_contacts(lead_id);

-- Create policies
DO $$ BEGIN
  -- Sales Leads policies
  CREATE POLICY "Enable read for authenticated users"
    ON sales_leads FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable write for authenticated users"
    ON sales_leads FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

  -- Sales Activities policies
  CREATE POLICY "Enable read for authenticated users"
    ON sales_activities FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable write for authenticated users"
    ON sales_activities FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

  -- Sales Opportunities policies
  CREATE POLICY "Enable read for authenticated users"
    ON sales_opportunities FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable write for authenticated users"
    ON sales_opportunities FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

  -- Sales Contacts policies
  CREATE POLICY "Enable read for authenticated users"
    ON sales_contacts FOR SELECT
    TO authenticated
    USING (true);

  CREATE POLICY "Enable write for authenticated users"
    ON sales_contacts FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
END $$;