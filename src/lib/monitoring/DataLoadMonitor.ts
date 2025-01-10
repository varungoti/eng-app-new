import { logger } from '../logger';

interface LoadMetrics {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  success: boolean;
  source: string;
  operation: string;
  queryKey?: string[];
}

class DataLoadMonitor {
  private static instance: DataLoadMonitor;
  private metrics: Map<string, LoadMetrics> = new Map();
  private subscribers: Set<(metrics: LoadMetrics[]) => void> = new Set();

  private constructor() {
    // Clean up old metrics every minute
    setInterval(() => this.cleanup(), 60000);
  }

  public static getInstance(): DataLoadMonitor {
    if (!DataLoadMonitor.instance) {
      DataLoadMonitor.instance = new DataLoadMonitor();
    }
    return DataLoadMonitor.instance;
  }

  public startLoad(source: string, operation: string, queryKey?: string[]): string {
    const id = crypto.randomUUID();
    const metric: LoadMetrics = {
      id,
      startTime: performance.now(),
      success: false,
      source,
      operation,
      queryKey
    };

    this.metrics.set(id, metric);
    this.notifySubscribers();

    logger.debug(`Starting data load: ${operation}`, {
      context: { queryKey },
      source
    });

    return id;
  }

  public endLoad(id: string, success: boolean = true): void {
    const metric = this.metrics.get(id);
    if (!metric) return;

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.success = success;

    // Log performance data
    logger.info(`Data load completed: ${metric.operation}`, {
      context: {
        duration: `${metric.duration.toFixed(2)}ms`,
        success: metric.success,
        queryKey: metric.queryKey,
      },
      source: metric.source
    });

    this.notifySubscribers();

    // Cleanup after 5 minutes
    setTimeout(() => {
      this.metrics.delete(id);
      this.notifySubscribers();
    }, 300000);
  }

  public getMetrics(): LoadMetrics[] {
    return Array.from(this.metrics.values());
  }

  public getActiveLoads(): LoadMetrics[] {
    return Array.from(this.metrics.values())
      .filter(m => !m.endTime)
      .sort((a, b) => b.startTime - a.startTime);
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

  private notifySubscribers(): void {
    const metrics = this.getMetrics();
    this.subscribers.forEach(callback => callback(metrics));
  }

  public subscribe(callback: (metrics: LoadMetrics[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
}

export const dataLoadMonitor = DataLoadMonitor.getInstance();