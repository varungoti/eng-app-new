import { supabase } from '../../supabase';
import { BaseService } from '../BaseService';
import type { Grade, Topic, SubTopic, Lesson } from '../../../types';

export class ContentService extends BaseService {
  constructor() {
    super({
      name: 'ContentService',
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

  async getGrades(): Promise<Grade[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('grades')
          .select('*')
          .order('level');

        if (error) throw error;
        return data;
      },
      'grades'
    );
  }

  async getTopics(): Promise<Topic[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .order('order');

        if (error) throw error;
        return data;
      },
      'topics'
    );
  }

  // Add other content-related methods...
}