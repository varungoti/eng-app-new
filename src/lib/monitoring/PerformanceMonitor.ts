import { logger } from '../logger';

interface PerformanceMetric {
  id: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  source: string;
  status: 'pending' | 'success' | 'error';
  context?: Record<string, any>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric> = new Map();
  private subscribers: Set<(metrics: PerformanceMetric[]) => void> = new Set();
  private readonly SLOW_THRESHOLD = 1000; // 1 second

  private constructor() {
    // Clean up old metrics every minute
    setInterval(() => this.cleanup(), 60000);
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  public startOperation(operation: string, source: string, context?: Record<string, any>): string {
    const id = crypto.randomUUID();
    const metric: PerformanceMetric = {
      id,
      operation,
      startTime: performance.now(),
      source,
      status: 'pending',
      context
    };

    this.metrics.set(id, metric);
    this.notifySubscribers();

    logger.debug(`Starting operation: ${operation}`, {
      context: { operationId: id, ...context },
      source
    });

    return id;
  }

  public endOperation(id: string, success: boolean = true): void {
    const metric = this.metrics.get(id);
    if (!metric) return;

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.status = success ? 'success' : 'error';

    // Log slow operations
    if (metric.duration > this.SLOW_THRESHOLD) {
      logger.warn(`Slow operation detected`, {
        context: {
          operation: metric.operation,
          duration: `${metric.duration.toFixed(2)}ms`,
          threshold: this.SLOW_THRESHOLD
        },
        source: metric.source
      });
    }

    this.notifySubscribers();

    // Remove completed operations after 5 minutes
    setTimeout(() => {
      this.metrics.delete(id);
      this.notifySubscribers();
    }, 300000);
  }

  public getActiveOperations(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
      .filter(m => m.status === 'pending')
      .sort((a, b) => b.startTime - a.startTime);
  }

  public getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.startTime - a.startTime);
  }

  public subscribe(callback: (metrics: PerformanceMetric[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    const metrics = this.getAllMetrics();
    this.subscribers.forEach(callback => callback(metrics));
  }

  private cleanup(): void {
    const now = performance.now();
    for (const [id, metric] of this.metrics.entries()) {
      // Remove metrics older than 5 minutes
      if (now - metric.startTime > 300000) {
        this.metrics.delete(id);
      }
    }
    this.notifySubscribers();
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();