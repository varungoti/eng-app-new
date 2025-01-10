import { supabase } from '../../supabase';
import { BaseService } from '../BaseService';
import type { SalesLead, SalesActivity, SalesOpportunity } from '../../../types/sales';

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

  // Add other sales-related methods...
}