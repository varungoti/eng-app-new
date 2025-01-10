```typescript
import { supabase } from '../supabase';
import { logger } from '../logger';
import { measurePerformance } from '../utils/performance';

interface QueryOptions {
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  offset?: number;
}

export class QueryBuilder {
  private static instance: QueryBuilder;

  private constructor() {}

  public static getInstance(): QueryBuilder {
    if (!QueryBuilder.instance) {
      QueryBuilder.instance = new QueryBuilder();
    }
    return QueryBuilder.instance;
  }

  public async executeQuery<T>(
    table: string,
    options: QueryOptions = {}
  ): Promise<T[]> {
    const endMetric = measurePerformance('database_query', { table });
    
    try {
      let query = supabase
        .from(table)
        .select(options.select || '*');

      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (value !== null && value !== undefined) {
            query = query.eq(key, value);
          }
        });
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending ?? true
        });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      endMetric();
      return data as T[];
    } catch (err) {
      logger.error('Query execution failed', {
        context: { error: err, table, options },
        source: 'QueryBuilder'
      });
      throw err;
    }
  }

  public async executeMutation<T>(
    table: string,
    type: 'insert' | 'update' | 'delete',
    data: any,
    id?: string
  ): Promise<T> {
    const endMetric = measurePerformance('database_mutation', { table, type });
    
    try {
      let query = supabase.from(table);

      switch (type) {
        case 'insert':
          query = query.insert(data);
          break;
        case 'update':
          if (!id) throw new Error('ID required for update');
          query = query.update(data).eq('id', id);
          break;
        case 'delete':
          if (!id) throw new Error('ID required for delete');
          query = query.delete().eq('id', id);
          break;
      }

      const { data: result, error } = await query.select().single();

      if (error) throw error;
      
      endMetric();
      return result as T;
    } catch (err) {
      logger.error('Mutation failed', {
        context: { error: err, table, type, data, id },
        source: 'QueryBuilder'
      });
      throw err;
    }
  }
}

export const queryBuilder = QueryBuilder.getInstance();
```