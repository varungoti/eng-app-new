import { supabase } from './supabase';
import { logger } from './logger';
import { DataCache } from './cache';
import { dataFlowMonitor } from './monitoring/instance';

export class APIError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'APIError';
  }
}

const cache = DataCache.getInstance();

const handleQueryError = (error: any, path: string) => {
  logger.error(`Failed to fetch ${path}: ${error}`, 'api.get');
  throw new APIError(`Failed to fetch ${path}`, 500);
};

export const api = {
  async get<T>(path: string, options: { where?: any; include?: any; orderBy?: any } = {}): Promise<T[]> {
    const loadId = `GET_${path}_${Date.now()}`;
    await dataFlowMonitor.trackDataLoad(loadId, { 
      source: path,
      recordCount: 0 // Will be updated when data is received
    });
    const cacheKey = `${path}-${JSON.stringify(options)}`;
    
    const opId = dataFlowMonitor.startOperation('query', `GET ${path}`, { options });
    try {
      // Try cache first
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        dataFlowMonitor.endOperation(opId);
        return cachedData;
      }

      const query = supabase
        .from(path);

      let selection = query.select(options.include ? `*, ${options.include}` : '*');

      if (options.where) {
        Object.entries(options.where).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            selection = selection.eq(key, value);
          }
        });
      }

      if (options.orderBy) {
        Object.entries(options.orderBy).forEach(([key, value]) => {
          selection = selection.order(key, { ascending: value === 'asc' });
        });
      }

      const { data, error } = await selection;
      
      if (error) throw error;
      
      // Cache successful response
      if (data) {
        cache.set(cacheKey, data);
      }
      dataFlowMonitor.endOperation(opId);
      
      return ( data ||[]) as T[];
    } catch (err) {
      return handleQueryError(err, path);
    }
  },

  async post<T>(path: string, data: any): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(path)
        .insert(data)
        .select()
        .single();

      if (error) throw error;

      // Invalidate relevant cache entries
      cache.clear();

      return result as T;
    } catch (err) {
      logger.error(`Failed to create ${path}`, 'api.post', err);
      throw new APIError(`Failed to create ${path}`, 500);
    }

  },

  async put<T>(path: string, id: string, data: any): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(path)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Invalidate relevant cache entries
      cache.clear();

      return result as T;
    } catch (err) {
      logger.error(`Failed to update ${path}`, 'api.put', err);
      throw new APIError(`Failed to update ${path}`, 500);
    }

  },

  async delete(path: string, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(path)
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Invalidate relevant cache entries
      cache.clear();

      return true;
    } catch (err) {
      logger.error(`Failed to delete ${path}`, 'api.delete', err);
      throw new APIError(`Failed to delete ${path}`, 500);

    }
  },

  // Batch operations with transaction support
  async batch<T>(operations: (() => Promise<T>)[]): Promise<T[]> {
    try {
      const results = await Promise.allSettled(operations.map(op => op()));
      
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        logger.error('Batch operation partially failed', 'api.batch', failures);

      }

      return results
        .filter((r): r is PromiseFulfilledResult<Awaited<T>> => r.status === 'fulfilled')
        .map(r => r.value);
    } catch (err) {
      logger.error('Batch operation failed', 'api.batch', err);
      throw new APIError('Batch operation failed', 500);

    }
  }
};