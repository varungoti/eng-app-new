import { dbConnection } from './connection';
import { checkDatabaseHealth } from './healthCheck';
import { logger } from '../logger';

export const database = {
  isHealthy: async () => {
    try {
      const isHealthy = await checkDatabaseHealth();
      return isHealthy;
    } catch (err) {
      logger.error('Database health check failed', {
        context: { error: err },
        source: 'Database'
      });
      return false;
    }
  }
};

export { dbConnection, checkDatabaseHealth };