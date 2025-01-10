```typescript
import { logger } from '../logger';
import { WarningCache } from '../monitoring/WarningCache';
import { connectionManager } from './ConnectionManager';
import { cacheManager } from './CacheManager';

interface DatabaseMetrics {
  queryCount: number;
  errorCount: number;
  averageResponseTime: number;
  slowQueries: number;
  cacheHitRate: number;
}

class DatabaseMonitor {
  private static instance: DatabaseMonitor;
  private warningCache = new WarningCache(30000);
  private metrics: DatabaseMetrics = {
    queryCount: 0,
    errorCount: 0,
    averageResponseTime: 0,
    slowQueries: 0,
    cacheHitRate: 0
  };

  private constructor() {
    this.startMonitoring();
  }

  public static getInstance(): DatabaseMonitor {
    if (!DatabaseMonitor.instance) {
      DatabaseMonitor.instance = new DatabaseMonitor();
    }
    return DatabaseMonitor.instance;
  }

  private startMonitoring() {
    setInterval(() => this.checkHealth(), 60000); // Every minute
    setInterval(() => this.logMetrics(), 300000); // Every 5 minutes
  }

  private async checkHealth() {
    const isHealthy = await connectionManager.executeWithRetry(
      async () => {
        const response = await fetch('/api/health');
        return response.ok;
      }
    );

    if (!isHealthy && this.warningCache.shouldLog('health_check')) {
      logger.warn('Database health check failed', {
        context: { metrics: this.getMetrics() },
        source: 'DatabaseMonitor'
      });
    }
  }

  private logMetrics() {
    const metrics = this.getMetrics();
    const cacheStats = cacheManager.getStats();
    const connectionStats = connectionManager.getStats();

    logger.info('Database metrics', {
      context: {
        metrics,
        cache: cacheStats,
        connections: connectionStats
      },
      source: 'DatabaseMonitor'
    });
  }

  public trackQuery(duration: number, success: boolean) {
    this.metrics.queryCount++;
    
    if (!success) {
      this.metrics.errorCount++;
    }

    // Update average response time
    this.metrics.averageResponseTime = (
      (this.metrics.averageResponseTime * (this.metrics.queryCount - 1) + duration) /
      this.metrics.queryCount
    );

    // Track slow queries (>100ms)
    if (duration > 100) {
      this.metrics.slowQueries++;
      
      if (this.warningCache.shouldLog('slow_query')) {
        logger.warn('Slow query detected', {
          context: { duration },
          source: 'DatabaseMonitor'
        });
      }
    }
  }

  public getMetrics(): DatabaseMetrics {
    return { ...this.metrics };
  }

  public resetMetrics() {
    this.metrics = {
      queryCount: 0,
      errorCount: 0,
      averageResponseTime: 0,
      slowQueries: 0,
      cacheHitRate: 0
    };
  }
}

export const databaseMonitor = DatabaseMonitor.getInstance();
```