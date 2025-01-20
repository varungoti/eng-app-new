import { supabase } from '../../supabase';
import { DatabaseMonitor } from '../DatabaseMonitor';
import type { DatabaseMetrics } from '../types';

export class DatabaseMonitoringService {
  private static instance: DatabaseMonitoringService;
  private monitor: DatabaseMonitor | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): DatabaseMonitoringService {
    if (!DatabaseMonitoringService.instance) {
      DatabaseMonitoringService.instance = new DatabaseMonitoringService();
    }
    return this.instance;
  }

  async initialize() {
    if (this.isInitialized) return;
    try {
      this.monitor = new DatabaseMonitor(supabase, {
        supabase,
        enableLogging: true,
        logLevel: 'info',
        sampleRate: import.meta.env.DEV ? 1 : 0.1
      });
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to initialize database monitor:', error);
    }
  }

  async getMetrics(): Promise<DatabaseMetrics | null> {
    try {
      if (!this.monitor) {
        await this.initialize();
      }
      const metrics = this.monitor?.getMetrics();
      return metrics ? {
        connectionStatus: metrics.connectionStatus as 'error' | 'healthy' | 'degraded',
        lastCheckTime: metrics.lastCheckTime,
        responseTime: metrics.responseTime,
        count: metrics.recordCount,
        errorCount: metrics.errorCount
      } : null;
    } catch (error) {
      console.warn('Failed to get database metrics:', error);
      return null;
    }
  }

  async cleanup() {
    if (this.monitor) {
      try {
        // Add any cleanup logic here
        this.monitor = null;
        this.isInitialized = false;
      } catch (error) {
        console.warn('Failed to cleanup database monitor:', error);
      }
    }
  }
} 