import { supabase } from '../../supabase';
import { BaseService } from '../BaseService';
import type { School } from '../../../types';

export class SchoolService extends BaseService {
  constructor() {
    super({
      name: 'SchoolService',
      retryConfig: {
        maxRetries: 2,
        baseDelay: 300,
        maxDelay: 1000
      },
      cacheConfig: {
        ttl: 5 * 60 * 1000 // 5 minutes
      }
    });
  }

  async getSchools(): Promise<School[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('schools')
          .select(`
            *,
            school_grades (
              grade_id
            )
          `);

        if (error) throw error;
        return data;
      },
      'schools'
    );
  }

  // Add other school-related methods...
}