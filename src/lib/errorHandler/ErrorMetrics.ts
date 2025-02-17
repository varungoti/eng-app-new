import { logger } from '../logger';
import { errorRegistry } from './ErrorRegistry';

export interface ErrorMetrics {
  total: number;
  handled: number;
  unhandled: number;
  bySource: Record<string, number>;
  byType: Record<string, number>;
  errorsBySource: Record<string, number>;
  retryAttempts: number;
  averageRetryCount: number;
  errorRate: number;
  timeWindow: number;
}

class ErrorMetricsCollector {
  private static instance: ErrorMetricsCollector;
  private metricsWindow = 5 * 60 * 1000; // 5 minutes
  private lastCalculation: number = 0;
  private cachedMetrics: ErrorMetrics | null = null;

  private constructor() {}

  public static getInstance(): ErrorMetricsCollector {
    if (!ErrorMetricsCollector.instance) {
      ErrorMetricsCollector.instance = new ErrorMetricsCollector();
    }
    return ErrorMetricsCollector.instance;
  }

  public getMetrics(): ErrorMetrics {
    const now = Date.now();
    
    // Return cached metrics if within 10 seconds
    if (this.cachedMetrics && now - this.lastCalculation < 10000) {
      return this.cachedMetrics;
    }

    const errors = Array.from(errorRegistry.getUnhandledErrors());
    const recentErrors = errors.filter(e => now - e.timestamp < this.metricsWindow);
    
    const errorsBySource = recentErrors.reduce((acc, error) => {
      acc[error.source] = (acc[error.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalRetries = recentErrors.reduce((sum, error) => sum + error.retryCount, 0);

    const metrics: ErrorMetrics = {
      total: recentErrors.length,
      handled: recentErrors.filter(e => e.handled).length,
      unhandled: recentErrors.filter(e => !e.handled).length,
      errorsBySource,
      retryAttempts: totalRetries,
      averageRetryCount: recentErrors.length ? totalRetries / recentErrors.length : 0,
      errorRate: recentErrors.length / (this.metricsWindow / 1000), // errors per second
      timeWindow: this.metricsWindow,
      bySource: errorsBySource,
      byType: {}
    };

    // Cache the metrics
    this.cachedMetrics = metrics;
    this.lastCalculation = now;

    // Log metrics if significant changes
    if (metrics.unhandled > 10) {
      logger.warn('High error rate detected', {
        context: metrics,
        source: 'ErrorMetrics'
      });
    }

    return metrics;
  }

  public setMetricsWindow(milliseconds: number): void {
    this.metricsWindow = milliseconds;
    this.cachedMetrics = null; // Invalidate cache
  }
}

export const errorMetrics = ErrorMetricsCollector.getInstance();