
import { supabase } from '../supabase';
import { logger } from '../logger';
import { WarningCache } from '../monitoring/WarningCache';

interface ConnectionStats {
  totalConnections: number;
  activeConnections: number;
  idleConnections: number;
  waitingRequests: number;
}

class ConnectionManager {
  private static instance: ConnectionManager;
  private warningCache = new WarningCache(30000); // 30 second cooldown
  private stats: ConnectionStats = {
    totalConnections: 0,
    activeConnections: 0,
    idleConnections: 0,
    waitingRequests: 0
  };

  private constructor() {
    this.startMonitoring();
  }

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  private startMonitoring() {
    setInterval(() => this.checkHealth(), 30000); // Check every 30 seconds
  }

  private async checkHealth(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('update_health_check');
      
      if (error) {
        if (this.warningCache.shouldLog('health_check_failed')) {
          logger.warn('Database health check failed', {
            context: { error },
            source: 'ConnectionManager'
          });
        }
        return false;
      }

      return data === true;
    } catch (err) {
      logger.error('Health check error', {
        context: { error: err },
        source: 'ConnectionManager'
      });
      return false;
    }
  }

  public getStats(): ConnectionStats {
    return { ...this.stats };
  }

  public async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        attempt++;

        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    throw lastError;
  }
}

export const connectionManager = ConnectionManager.getInstance();
