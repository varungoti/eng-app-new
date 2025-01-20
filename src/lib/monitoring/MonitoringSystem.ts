import { type SupabaseClient } from '@supabase/supabase-js';

interface MonitoringConfig {
  supabaseUrl: string;
  supabaseKey: string;
  supabase: SupabaseClient<any, "public", any>;
  enableLogging?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  sampleRate?: number;
}

export class MonitoringSystem {
  private config: MonitoringConfig;

  constructor(config: MonitoringConfig) {
    this.config = {
      enableLogging: true,
      logLevel: 'info',
      sampleRate: 1,
      ...config
    };
  }

  getDataFlowMonitor() {
    return {
        trackDataLoad: async (loadId: string, metadata: { source: string; recordCount: number }) => {
            if (Math.random() > (this.config.sampleRate ?? 1)) return;
    
            try {
          const { error } = await this.config.supabase
            .from('data_flow_metrics')
            .insert({
              flow_id: loadId,
              data_size: JSON.stringify(metadata).length,
              timestamp: new Date().toISOString()
            });

          if (error && this.config.enableLogging) {
            console.error('Error tracking data flow:', error);
          }
        } catch (err) {
          if (this.config.enableLogging) {
            console.error('Failed to track data flow:', err);
          }
        }
      },

      getFlowMetrics: async (flowId: string) => {
        try {
          const { data, error } = await this.config.supabase
            .from('data_flow_metrics')
            .select('*')
            .eq('flow_id', flowId)
            .order('timestamp', { ascending: false })
            .limit(100);

          if (error) throw error;
          return data;
        } catch (err) {
          if (this.config.enableLogging) {
            console.error('Failed to get flow metrics:', err);
          }
          return [];
        }
      }
    };
  }

  getDataLoadMonitor() {
    return {
      trackDataLoad: async (loadId: string, metadata: { source: string; recordCount: number }) => {
        if (Math.random() > (this.config.sampleRate ?? 1)) return;

        try {
          const { error } = await this.config.supabase
            .from('data_load_metrics')
            .insert({
              load_id: loadId,
              source: metadata.source,
              record_count: metadata.recordCount,
              timestamp: new Date().toISOString()
            });

          if (error && this.config.enableLogging) {
            console.error('Error tracking data load:', error);
          }
        } catch (err) {
          if (this.config.enableLogging) {
            console.error('Failed to track data load:', err);
          }
        }
      },

      getLoadMetrics: async (loadId: string) => {
        try {
          const { data, error } = await this.config.supabase
            .from('data_load_metrics')
            .select('*')
            .eq('load_id', loadId)
            .order('timestamp', { ascending: false })
            .limit(100);

          if (error) throw error;
          return data;
        } catch (err) {
          if (this.config.enableLogging) {
            console.error('Failed to get load metrics:', err);
          }
          return [];
        }
      }
    };
  }

  getDatabaseMonitor() {
    return {
      trackQueryPerformance: async (queryId: string, metadata: { query: string; duration: number; status: 'success' | 'error' }) => {
        if (Math.random() > (this.config.sampleRate ?? 1)) return;

        try {
          const { error } = await this.config.supabase
            .from('database_metrics')
            .insert({
              query_id: queryId,
              query: metadata.query,
              duration_ms: metadata.duration,
              status: metadata.status,
              timestamp: new Date().toISOString()
            });

          if (error && this.config.enableLogging) {
            console.error('Error tracking query performance:', error);
          }
        } catch (err) {
          if (this.config.enableLogging) {
            console.error('Failed to track query performance:', err);
          }
        }
      },

      getQueryMetrics: async (queryId?: string) => {
        try {
          let query = this.config.supabase
            .from('database_metrics')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(100);

          if (queryId) {
            query = query.eq('query_id', queryId);
          }

          const { data, error } = await query;
          if (error) throw error;
          return data;
        } catch (err) {
          if (this.config.enableLogging) {
            console.error('Failed to get query metrics:', err);
          }
          return [];
        }
      },

      cleanup: async () => {
        try {
          // Delete metrics older than 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const { error } = await this.config.supabase
            .from('database_metrics')
            .delete()
            .lt('timestamp', thirtyDaysAgo.toISOString());

          if (error && this.config.enableLogging) {
            console.error('Error cleaning up database metrics:', error);
          }
        } catch (err) {
          if (this.config.enableLogging) {
            console.error('Failed to cleanup database metrics:', err);
          }
        }
      }
    };
  }

  getLoadingMonitor() {
    return {
      startLoading: (componentId: string) => {
        try {
          const timestamp = new Date().toISOString();
          this.config.supabase
            .from('loading_metrics')
            .insert([{
              component_id: componentId,
              start_time: timestamp,
              status: 'loading'
            }])
            .then(({ error }: { error: any }) => {
              if (error && this.config.enableLogging) {
                console.error('Error recording loading start:', error);
              }
            });
        } catch (err) {
          if (this.config.enableLogging) {
            console.error('Failed to record loading start:', err);
          }
        }
      },

      endLoading: async (componentId: string, success: boolean = true) => {
        try {
          const timestamp = new Date().toISOString();
          const { error } = await this.config.supabase
            .from('loading_metrics')
            .update({
              end_time: timestamp,
              status: success ? 'success' : 'error'
            })
            .eq('component_id', componentId)
            .is('end_time', null);

          if (error && this.config.enableLogging) {
            console.error('Error recording loading end:', error);
          }
        } catch (err) {
          if (this.config.enableLogging) {
            console.error('Failed to record loading end:', err);
          }
        }
      },

      getLoadingMetrics: async (componentId?: string) => {
        try {
          let query = this.config.supabase
            .from('loading_metrics')
            .select('*')
            .order('start_time', { ascending: false })
            .limit(100);

          if (componentId) {
            query = query.eq('component_id', componentId);
          }

          const { data, error } = await query;
          if (error) throw error;
          return data;
        } catch (err) {
          if (this.config.enableLogging) {
            console.error('Failed to get loading metrics:', err);
          }
          return [];
        }
      }
    };
  }
} 