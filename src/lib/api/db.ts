import { createClient } from '@supabase/supabase-js';
import { logger } from '../logger';
import type { QueryConfig } from '../../types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const query = async <T>(
  sql: string,
  params?: any[],
  config: QueryConfig = {}
): Promise<T[]> => {
  try {
    const { data, error } = await supabase
      .from(config.table || '')
      .select(config.select || '*')
      .order(config.orderBy || 'created_at', { ascending: false });

    if (error) throw error;
    return data as T[];
  } catch (err) {
    logger.error('Database query failed', {
      context: { error: err, sql, params },
      source: 'Database'
    });
    throw err;
  }
};

export const execute = async (
  sql: string,
  params?: any[],
  _config: QueryConfig = {}
): Promise<void> => {
  try {
    const { error } = await supabase.rpc(sql, params);
    if (error) throw error;
  } catch (err) {
    logger.error('Database execute failed', {
      context: { error: err, sql, params },
      source: 'Database'
    });
    throw err;
  }
};