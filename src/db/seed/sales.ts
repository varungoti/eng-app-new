import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

interface SalesLead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed' | 'lost';
  source: string;
  assigned_to: string | null;
  estimated_value: number;
  probability: number;
  expected_close_date: string;
  notes: string;
  schoolname: string;
  location: string;
  branch: string;
  created_at: string;
  updated_at: string;
}

interface SalesActivity {
  id: string;
  lead_id: string;
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'follow_up';
  subject: string;
  description: string;
  status: 'planned' | 'completed' | 'cancelled';
  due_date: string;
  completed_at: string | null;
  performed_by: string | null;
  created_at: string;
}

interface SalesOpportunity {
  id: string;
  lead_id: string;
  name: string;
  stage: 'discovery' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  amount: number;
  close_date: string;
  probability: number;
  next_step: string;
  competition: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface SalesContact {
  id: string;
  lead_id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  is_primary: boolean;
  department: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export async function seedSales(supabase: SupabaseClient): Promise<{
  leads: SalesLead[];
  activities: SalesActivity[];
  opportunities: SalesOpportunity[];
  contacts: SalesContact[];
}> {
  try {
    // Create sales leads
    const leads: Omit<SalesLead, 'id'>[] = [];
    const leadCount = 20;
    const sources = ['website', 'referral', 'cold_call', 'event', 'social_media'];
    const statuses: SalesLead['status'][] = [
      'new',
      'contacted',
      'qualified',
      'proposal',
      'negotiation',
      'closed',
      'lost'
    ];

    for (let i = 0; i < leadCount; i++) {
      const companyName = faker.company.name();
      leads.push({
        company_name: companyName,
        contact_name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        status: faker.helpers.arrayElement(statuses),
        source: faker.helpers.arrayElement(sources),
        assigned_to: null,
        estimated_value: faker.number.int({ min: 1000, max: 100000 }),
        probability: faker.number.int({ min: 0, max: 100 }),
        expected_close_date: faker.date.future().toISOString().split('T')[0],
        notes: faker.lorem.paragraph(),
        schoolname: companyName,
        location: faker.location.city(),
        branch: faker.helpers.maybe(() => faker.location.streetAddress()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insert leads
    const { data: insertedLeads, error: leadError } = await supabase
      .from('sales_leads')
      .insert(leads)
      .select();

    if (leadError) {
      throw new Error(`Failed to insert sales leads: ${leadError.message}`);
    }

    if (!insertedLeads) {
      throw new Error('No sales leads were inserted');
    }

    // Create sales activities
    const activities: Omit<SalesActivity, 'id'>[] = [];
    const activityTypes: SalesActivity['type'][] = ['call', 'email', 'meeting', 'proposal', 'follow_up'];
    const activityStatuses: SalesActivity['status'][] = ['planned', 'completed', 'cancelled'];

    insertedLeads.forEach(lead => {
      const activityCount = faker.number.int({ min: 1, max: 5 });
      
      for (let i = 0; i < activityCount; i++) {
        const status = faker.helpers.arrayElement(activityStatuses);
        activities.push({
          lead_id: lead.id,
          type: faker.helpers.arrayElement(activityTypes),
          subject: faker.lorem.sentence(),
          description: faker.lorem.paragraph(),
          status,
          due_date: faker.date.future().toISOString(),
          completed_at: status === 'completed' ? faker.date.past().toISOString() : null,
          performed_by: null,
          created_at: new Date().toISOString()
        });
      }
    });

    // Insert activities
    const { data: insertedActivities, error: activityError } = await supabase
      .from('sales_activities')
      .insert(activities)
      .select();

    if (activityError) {
      throw new Error(`Failed to insert sales activities: ${activityError.message}`);
    }

    // Create sales opportunities
    const opportunities: Omit<SalesOpportunity, 'id'>[] = [];
    const stages: SalesOpportunity['stage'][] = [
      'discovery',
      'qualification',
      'proposal',
      'negotiation',
      'closed_won',
      'closed_lost'
    ];

    insertedLeads.forEach(lead => {
      const opportunityCount = faker.number.int({ min: 0, max: 2 });
      
      for (let i = 0; i < opportunityCount; i++) {
        opportunities.push({
          lead_id: lead.id,
          name: faker.lorem.sentence(),
          stage: faker.helpers.arrayElement(stages),
          amount: faker.number.int({ min: 5000, max: 50000 }),
          close_date: faker.date.future().toISOString().split('T')[0],
          probability: faker.number.int({ min: 0, max: 100 }),
          next_step: faker.lorem.sentence(),
          competition: faker.company.name(),
          notes: faker.lorem.paragraph(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    });

    // Insert opportunities
    const { data: insertedOpportunities, error: opportunityError } = await supabase
      .from('sales_opportunities')
      .insert(opportunities)
      .select();

    if (opportunityError) {
      throw new Error(`Failed to insert sales opportunities: ${opportunityError.message}`);
    }

    // Create sales contacts
    const contacts: Omit<SalesContact, 'id'>[] = [];
    const departments = ['Administration', 'Academic', 'Finance', 'IT', 'HR'];

    insertedLeads.forEach(lead => {
      const contactCount = faker.number.int({ min: 1, max: 3 });
      
      for (let i = 0; i < contactCount; i++) {
        contacts.push({
          lead_id: lead.id,
          name: faker.person.fullName(),
          title: faker.person.jobTitle(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          is_primary: i === 0,
          department: faker.helpers.arrayElement(departments),
          notes: faker.lorem.paragraph(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    });

    // Insert contacts
    const { data: insertedContacts, error: contactError } = await supabase
      .from('sales_contacts')
      .insert(contacts)
      .select();

    if (contactError) {
      throw new Error(`Failed to insert sales contacts: ${contactError.message}`);
    }

    return {
      leads: insertedLeads,
      activities: insertedActivities || [],
      opportunities: insertedOpportunities || [],
      contacts: insertedContacts || []
    };
  } catch (error) {
    console.error('Error seeding sales data:', error);
    throw error;
  }
} 