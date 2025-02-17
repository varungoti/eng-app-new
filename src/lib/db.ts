import { createClient } from '@supabase/supabase-js';
import { logger } from './logger';
import { checkDatabaseHealth } from './db/healthCheck';
import { dbConnection } from './db/connection';

const MAX_INIT_RETRIES = 3;
const INIT_RETRY_DELAY = 2000;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const db = createClient(supabaseUrl, supabaseKey);

export const database = {
  isHealthy: async () => {
    try {
      let retries = 0;
      while (retries < MAX_INIT_RETRIES) {
        const isHealthy = await checkDatabaseHealth();
        
        if (isHealthy) {
          return true;
        }

        retries++;
        if (retries < MAX_INIT_RETRIES) {
          logger.warn(`Database health check failed, attempt ${retries}/${MAX_INIT_RETRIES}`, 'Database');
          await new Promise(resolve => setTimeout(resolve, INIT_RETRY_DELAY * retries));
          continue;
        }

        logger.error('Database health check failed after all retries', 'Database');
        return false;

      }

      return false;
    } catch (err) {
      logger.error('Database health check failed', 'Database', err);
      return false; 
    }
  }
};



// Export all database utilities
export { dbConnection , checkDatabaseHealth };