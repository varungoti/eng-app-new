import type SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';
import { MonitorConfig } from './index';
import { logger } from '../logger';

export interface DataFlowMetrics {
  operationsPerSecond: number;
  averageResponseTime: number;
  errorRate: number;
  activeConnections: number;
}

interface Operation {
  id: string;
  type: string;
  name: string;
  startTime: number;
  metadata?: Record<string, any>;
}

export class DataFlowMonitor {
  private supabase: SupabaseClient;
  private config: MonitorConfig;
  private metrics: DataFlowMetrics;
  private activeOperations: Map<string, Operation>;
  private loggerInstance: typeof logger;

  constructor(supabase: SupabaseClient, config: MonitorConfig, loggerInstance: typeof logger) {
    this.supabase = supabase;
    this.config = config;
    this.metrics = {
      operationsPerSecond: 0,
      averageResponseTime: 0,
      errorRate: 0,
      activeConnections: 0
    };
    this.activeOperations = new Map();
    this.loggerInstance = loggerInstance;
  }

  public startOperation(type: string, name: string, metadata: any = {}): string {
    const opId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const operation: Operation = {
      id: opId,
      type,
      name,
      startTime: performance.now(),
      metadata
    };

    this.activeOperations.set(opId, operation);
    
    this.loggerInstance.info(`Starting operation: ${name} (${opId}) - Type: ${type}`, 'DataFlowMonitor');

    return opId;
  }

  public endOperation(opId: string): void {
    this.loggerInstance.info(`Ending operation: ${opId}`, 'DataFlowMonitor');
  }




  public async recordOperation(operation: string, duration: number, success: boolean) {
    if (Math.random() > this.config.sampleRate!) return;

    try {
      await this.supabase.from('audit_logs').insert({
        action: 'data_flow_operation',
        details: {
          operation,
          duration,
          success,
          timestamp: new Date().toISOString()
        }
      });

      this.updateMetrics(duration, success);
    } catch (error) {
      logger.error('Failed to record data flow operation', 'DataFlowMonitor', error);
        
    }
  }


  private updateMetrics(duration: number, success: boolean) {
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * 0.9) + (duration * 0.1);
    this.metrics.operationsPerSecond++;
    if (!success) this.metrics.errorRate++;

    if (this.metrics.averageResponseTime > 1000) {
      logger.warn('High average response time detected', 'DataFlowMonitor');

    }
  }

  public getMetrics(): DataFlowMetrics {
    return { ...this.metrics };
  }

  public getActiveOperations(): Operation[] {
    return Array.from(this.activeOperations.values());
  }
}