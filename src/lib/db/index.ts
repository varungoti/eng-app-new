import { dbConnection } from './connection';
import { checkDatabaseHealth } from './healthCheck';
import { logger } from '../logger';

const database = {
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

export { database };
export { database as db };