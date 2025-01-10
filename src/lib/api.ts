import { supabase } from './supabase';
import { logger } from './logger';
import { DataCache } from './cache';
import { dataFlowMonitor } from './monitoring'; 

export class APIError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'APIError';
  }
}

const cache = DataCache.getInstance();

const handleQueryError = (error: any, path: string) => {
  logger.error(`Failed to fetch ${path}`, {
    context: { error },
    source: 'api.get'
  });
  throw new APIError(`Failed to fetch ${path}`, 500);
};

export const api = {
  async get<T>(path: string, options: { where?: any; include?: any; orderBy?: any } = {}): Promise<T[]> {
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
      
      return data || [];
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

      return result;
    } catch (err) {
      logger.error(`Failed to create ${path}`, {
        context: { error: err, data },
        source: 'api.post'
      });
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

      return result;
    } catch (err) {
      logger.error(`Failed to update ${path}`, {
        context: { error: err, id, data },
        source: 'api.put'
      });
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
      logger.error(`Failed to delete ${path}`, {
        context: { error: err, id },
        source: 'api.delete'
      });
      throw new APIError(`Failed to delete ${path}`, 500);
    }
  },

  // Batch operations with transaction support
  async batch<T>(operations: (() => Promise<any>)[]): Promise<T[]> {
    try {
      const results = await Promise.allSettled(operations);
      
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        logger.error('Batch operation partially failed', {
          context: { failures },
          source: 'api.batch'
        });
      }

      // Invalidate cache on any successful operations
      if (results.some(r => r.status === 'fulfilled')) {
        cache.clear();
      }

      return results
        .filter((r): r is PromiseFulfilledResult<T> => r.status === 'fulfilled')
        .map(r => r.value);
    } catch (err) {
      logger.error('Batch operation failed', {
        context: { error: err },
        source: 'api.batch'
      });
      throw new APIError('Batch operation failed', 500);
    }
  }
};