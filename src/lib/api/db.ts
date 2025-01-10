import { withConnection } from '../db/connection';
import { logger } from '../logger';
import type { QueryConfig } from '../types';

export const query = async <T>(
  sql: string,
  params?: any[],
  config: QueryConfig = {}
): Promise<T[]> => {
  return withConnection(async (client) => {
    try {
      const { data, error } = await client
        .from(config.table || '')
        .select(config.select || '*')
        .order(config.orderBy || 'created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      logger.error('Database query failed', {
        context: { error: err, sql, params },
        source: 'Database'
      });
      throw err;
    }
  });
};

export const execute = async (
  sql: string,
  params?: any[],
  config: QueryConfig = {}
): Promise<void> => {
  return withConnection(async (client) => {
    try {
      const { error } = await client.rpc(sql, params);
      if (error) throw error;
    } catch (err) {
      logger.error('Database execute failed', {
        context: { error: err, sql, params },
        source: 'Database'
      });
      throw err;
    }
  });
};