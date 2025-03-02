import { supabase } from '../../supabase';
import { BaseService } from '../BaseService';
import type { SalesLead, SalesActivity, SalesOpportunity, SalesContact, SalesStats, SalesTask } from '../../../types/sales';


export class SalesService extends BaseService {
  constructor() {
    super({
      name: 'SalesService',
      retryConfig: {
        maxRetries: 2,
        baseDelay: 300,
        maxDelay: 1000
      },
      cacheConfig: {
        ttl: 2 * 60 * 1000 // 2 minutes
      }
    });
  }

  async getLeads(): Promise<SalesLead[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      'sales_leads'
    );
  }

  async getActivities(): Promise<SalesActivity[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_activities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      'sales_activities'
    );
  }

  async getOpportunities(): Promise<SalesOpportunity[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_opportunities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      'sales_opportunities'
    );
  }

  async createLead(lead: Omit<SalesLead, 'id' | 'created_at'>): Promise<SalesLead> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('sales_leads')
        .insert(lead)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  }

  async updateLead(id: string, lead: Partial<SalesLead>): Promise<SalesLead> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('sales_leads')
        .update(lead)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  }

  async createActivity(activity: Omit<SalesActivity, 'id' | 'created_at'>): Promise<SalesActivity> {
    return this.executeWithRetry(async () => {
      const { data, error } = await supabase
        .from('sales_activities')
        .insert(activity)
        .select()
        .single();

      if (error) throw error;
      return data;
    });
  }

  async getLeadById(id: string): Promise<SalesLead> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_leads')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      },
      `sales_lead_${id}`
    );
  }

  async getLeadActivities(leadId: string): Promise<SalesActivity[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_activities')
          .select('*')
          .eq('lead_id', leadId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      `lead_activities_${leadId}`
    );
  }

  async convertLeadToOpportunity(
    leadId: string, 
    opportunityData: Omit<SalesOpportunity, 'id' | 'created_at'>
  ): Promise<SalesOpportunity> {
    return this.executeWithRetry(async () => {
      // Create new opportunity
      const { data: opportunity, error: opportunityError } = await supabase
        .from('sales_opportunities')
        .insert(opportunityData)
        .select()
        .single();

      if (opportunityError) throw opportunityError;

      // Update lead status to converted
      const { error: updateError } = await supabase
        .from('sales_leads')
        .update({ status: 'converted', opportunity_id: opportunity.id })
        .eq('id', leadId);

      if (updateError) throw updateError;

      return opportunity;
    });
  }
  async getContacts(): Promise<SalesContact[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_contacts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      'sales_contacts'
    );
  }

  async getContact(id: string): Promise<SalesContact> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_contacts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      },
      `sales_contact_${id}`
    );
  }

  async createContact(contactData: Omit<SalesContact, 'id' | 'created_at'>): Promise<SalesContact> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_contacts')
          .insert(contactData)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    );
  }

  async updateContact(id: string, contactData: Partial<SalesContact>): Promise<SalesContact> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_contacts')
          .update(contactData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    );
  }

  async getSalesStats(): Promise<SalesStats> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_stats')
          .select('*')
          .single();

        if (error) throw error;
        return data;
      },
      'sales_stats'
    );
  }

  async getTasks(): Promise<SalesTask[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_tasks')
          .select('*')
          .order('due_date', { ascending: true });

        if (error) throw error;
        return data;
      },
      'sales_tasks'
    );
  }

  async createTask(taskData: Omit<SalesTask, 'id' | 'created_at'>): Promise<SalesTask> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_tasks')
          .insert(taskData)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    );
  }

  async updateTask(id: string, taskData: Partial<SalesTask>): Promise<SalesTask> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_tasks')
          .update(taskData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    );
  }

  async createOpportunity(opportunityData: Omit<SalesOpportunity, 'id' | 'created_at'>): Promise<SalesOpportunity> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_opportunities')
          .insert(opportunityData)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    );
  }

  async updateOpportunity(id: string, opportunityData: Partial<SalesOpportunity>): Promise<SalesOpportunity> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_opportunities')
          .update(opportunityData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    );
  }

  async getOpportunity(id: string): Promise<SalesOpportunity> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_opportunities')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return data;
      },
      `sales_opportunity_${id}`
    );
  }

  

  async getOpportunityActivities(opportunityId: string): Promise<SalesActivity[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_activities')
          .select('*')
          .eq('opportunity_id', opportunityId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      `opportunity_activities_${opportunityId}`
    );
  }

  async getContactActivities(contactId: string): Promise<SalesActivity[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('sales_activities')
          .select('*')
          .eq('contact_id', contactId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
      },
      `contact_activities_${contactId}`
    );
  }
}