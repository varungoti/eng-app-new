import { supabase } from '../supabase';
import { logger } from '../logger';
import { DEBUG_CONFIG } from '../config';

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    // Use a simple RPC call to check connection
    const { data, error } = await supabase.rpc('update_health_check');
    
    if (error) {
      if (DEBUG_CONFIG.logDatabaseQueries) {
        logger.debug('Health check failed', {
          context: { error },
          source: 'HealthCheck'
        });
      }
      return false;
    }

    return data === true;
  } catch (err) {
    if (DEBUG_CONFIG.logDatabaseQueries) {
      logger.debug('Health check error', {
        context: { error: err },
        source: 'HealthCheck'
      });
    }
    return false;
  }
}