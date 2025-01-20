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

  constructor(supabase: SupabaseClient, config: MonitorConfig) {
    this.supabase = supabase;
    this.config = config;
    this.metrics = {
      operationsPerSecond: 0,
      averageResponseTime: 0,
      errorRate: 0,
      activeConnections: 0
    };
    this.activeOperations = new Map();
  }

  public startOperation(type: string, name: string, metadata?: Record<string, any>): string {
    const id = crypto.randomUUID();
    const operation: Operation = {
      id,
      type,
      name,
      startTime: performance.now(),
      metadata
    };

    this.activeOperations.set(id, operation);
    
    logger.debug(`Started operation: ${name}`, {
      source: 'DataFlowMonitor',
      context: {
        operationId: id,
        type,
        metadata
      }
    });

    return id;
  }

  public endOperation(id: string, error?: Error) {
    const operation = this.activeOperations.get(id);
    if (!operation) {
      logger.warn(`Attempted to end unknown operation: ${id}`, {
        source: 'DataFlowMonitor'
      });
      return;
    }

    const duration = performance.now() - operation.startTime;
    const success = !error;

    this.recordOperation(operation.name, duration, success);
    this.activeOperations.delete(id);

    if (error) {
      logger.error(`Operation failed: ${operation.name}`, {
        source: 'DataFlowMonitor',
        context: {
          operationId: id,
          duration,
          error,
          metadata: operation.metadata
        }
      });
    } else {
      logger.debug(`Completed operation: ${operation.name}`, {
        source: 'DataFlowMonitor',
        context: {
          operationId: id,
          duration,
          metadata: operation.metadata
        }
      });
    }
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
      logger.error('Failed to record data flow operation', {
        source: 'DataFlowMonitor',
        context: {
          operation,
          duration,
          success,
          error
        }
      });
    }
  }

  private updateMetrics(duration: number, success: boolean) {
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * 0.9) + (duration * 0.1);
    this.metrics.operationsPerSecond++;
    if (!success) this.metrics.errorRate++;

    if (this.metrics.averageResponseTime > 1000) {
      logger.warn('High average response time detected', {
        source: 'DataFlowMonitor',
        context: {
          averageResponseTime: this.metrics.averageResponseTime,
          threshold: 1000
        }
      });
    }
  }

  public getMetrics(): DataFlowMetrics {
    return { ...this.metrics };
  }

  public getActiveOperations(): Operation[] {
    return Array.from(this.activeOperations.values());
  }
}