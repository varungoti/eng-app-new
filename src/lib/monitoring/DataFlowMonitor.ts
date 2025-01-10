import { logger } from '../logger';
import { DEBUG_CONFIG } from '../config';

interface DataFlowEvent {
  id: string;
  type: 'query' | 'mutation' | 'subscription' | 'auth' | 'network';
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'pending' | 'success' | 'error';
  error?: Error;
  context?: Record<string, any>;
}

class DataFlowMonitor {
  private static instance: DataFlowMonitor;
  private events: Map<string, DataFlowEvent> = new Map();
  
  private constructor() {}

  public static getInstance(): DataFlowMonitor {
    if (!DataFlowMonitor.instance) {
      DataFlowMonitor.instance = new DataFlowMonitor();
    }
    return DataFlowMonitor.instance;
  }

  public startOperation(type: DataFlowEvent['type'], operation: string, context?: Record<string, any>): string {
    const id = crypto.randomUUID();
    const event: DataFlowEvent = {
      id,
      type,
      operation,
      startTime: performance.now(),
      status: 'pending',
      context
    };

    this.events.set(id, event);

    if (DEBUG_CONFIG.showDebug) {
      logger.debug(`Started ${type} operation: ${operation}`, {
        context: { operationId: id, ...context },
        source: 'DataFlowMonitor'
      });
    }

    return id;
  }

  public endOperation(id: string, error?: Error): void {
    const event = this.events.get(id);
    if (!event) return;

    event.endTime = performance.now();
    event.duration = event.endTime - event.startTime;
    event.status = error ? 'error' : 'success';
    if (error) event.error = error;

    // Log slow operations
    if (event.duration > DEBUG_CONFIG.performance.slowQueryThreshold) {
      logger.warn(`Slow ${event.type} operation detected`, {
        context: {
          operationId: id,
          operation: event.operation,
          duration: `${event.duration.toFixed(2)}ms`,
          threshold: DEBUG_CONFIG.performance.slowQueryThreshold,
          error: event.error,
          ...event.context
        },
        source: 'DataFlowMonitor'
      });
    }

    // Log errors
    if (error) {
      logger.error(`${event.type} operation failed: ${event.operation}`, {
        context: {
          operationId: id,
          error,
          duration: event.duration,
          ...event.context
        },
        source: 'DataFlowMonitor'
      });
    } else if (DEBUG_CONFIG.showDebug) {
      logger.debug(`Completed ${event.type} operation: ${event.operation}`, {
        context: {
          operationId: id,
          duration: `${event.duration.toFixed(2)}ms`,
          ...event.context
        },
        source: 'DataFlowMonitor'
      });
    }

    // Cleanup old events periodically
    if (this.events.size > 1000) {
      this.cleanup();
    }
  }

  private cleanup(): void {
    const now = performance.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes

    for (const [id, event] of this.events.entries()) {
      if (now - event.startTime > maxAge) {
        this.events.delete(id);
      }
    }
  }

  public getOperationStats(): Record<string, any> {
    const stats = {
      totalOperations: this.events.size,
      pendingOperations: 0,
      successfulOperations: 0,
      failedOperations: 0,
      averageDuration: 0,
      slowOperations: 0
    };

    let totalDuration = 0;
    let completedOps = 0;

    for (const event of this.events.values()) {
      if (event.status === 'pending') {
        stats.pendingOperations++;
      } else {
        if (event.status === 'success') {
          stats.successfulOperations++;
        } else {
          stats.failedOperations++;
        }
        if (event.duration) {
          totalDuration += event.duration;
          completedOps++;
          if (event.duration > DEBUG_CONFIG.performance.slowQueryThreshold) {
            stats.slowOperations++;
          }
        }
      }
    }

    stats.averageDuration = completedOps > 0 ? totalDuration / completedOps : 0;

    return stats;
  }
}

export const dataFlowMonitor = DataFlowMonitor.getInstance();