import { logger } from '../logger';
import { WarningCache } from './WarningCache';

export class DatabaseMonitor {
  private static instance: DatabaseMonitor;
  private warningCache = new WarningCache(30000);
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseMonitor {
    if (!DatabaseMonitor.instance) {
      DatabaseMonitor.instance = new DatabaseMonitor();
    }
    return DatabaseMonitor.instance;
  }

  public logWarning(message: string, context: Record<string, any>) {
    const warningKey = `${message}:${JSON.stringify(context)}`;
    
    if (this.warningCache.shouldLog(warningKey)) {
      logger.warn(message, {
        context,
        source: 'DatabaseMonitor'
      });
    }
  }

  public updateConnectionStatus(isConnected: boolean) {
    this.isConnected = isConnected;
  }

  public isHealthy(): boolean {
    return this.isConnected;
  }
}

export const databaseMonitor = DatabaseMonitor.getInstance();