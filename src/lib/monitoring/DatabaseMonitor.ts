import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import type { MonitoringConfig } from './types';
import { logger } from '../logger';

type ConnectionStatus = 'error' | 'healthy' | 'degraded';

export interface DatabaseMetrics {
  connectionStatus: ConnectionStatus;
  lastCheckTime: Date;
  responseTime: number;
  recordCount: number;
  errorCount: number;
}

export class DatabaseMonitor {
  private client: SupabaseClient;
  private config: MonitoringConfig;
  private metrics: DatabaseMetrics;
  private checkInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;

  constructor(config: MonitoringConfig) {
    this.client = supabase;
    this.config = config;
    this.metrics = {
      connectionStatus: 'healthy',
      lastCheckTime: new Date(),
      responseTime: 0,
      errorCount: 0,
      recordCount: 0
    };

    this.startHealthCheck();
  }

  private async startHealthCheck() {
    this.checkInterval = setInterval(async () => {
      await this.checkHealth();
    }, 60000); // Check every minute
  }

  private async checkHealth() {
    const startTime = Date.now();
    
    try {
      const { data, error } = await this.client
        .rpc('update_health_check');

      if (error) throw error;

      const duration = Date.now() - startTime;
      
      this.metrics = {
        ...this.metrics,
        connectionStatus: 'healthy',
        lastCheckTime: new Date(),
        responseTime: duration
      };

      logger.info('Database health check successful', 'DatabaseMonitor');

    } catch (error) {
      this.metrics.errorCount++;
      this.metrics.connectionStatus = this.metrics.errorCount > 3 ? 'error' : 'degraded';

      logger.error('Database health check failed', 'DatabaseMonitor', error);

    }
  }

  public getMetrics(): DatabaseMetrics {
    return {
      connectionStatus: this.isConnected ? 'healthy' : 'error',
      lastCheckTime: new Date(),
      responseTime: 0,
      recordCount: 0,
      errorCount: 0
    };
  }

  cleanup() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  updateConnectionStatus(status: boolean) {
    this.isConnected = status;
    if (this.config.enableLogging) {
      logger.info(`Database connection status: ${status ? 'connected' : 'disconnected'}`, 'DatabaseMonitor');
    }
  }
}

// Export both as default and named export
//export { DatabaseMonitor };
export default DatabaseMonitor;