import { supabase } from '../supabase';
import { logger } from '../logger';
import { databaseMonitor } from '../monitoring/DatabaseMonitor';
import { checkDatabaseHealth } from './healthCheck';
import { RetryStrategy } from './retryStrategy';

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private connectionPromise: Promise<boolean> | null = null;
  private isConnected: boolean = false;
  private retryStrategy: RetryStrategy;

  private constructor() {
    this.retryStrategy = new RetryStrategy({
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 5000
    });
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async initialize(): Promise<boolean> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    logger.info('Initializing database connection...', {
      source: 'DatabaseConnection'
    });

    this.connectionPromise = this.retryStrategy.execute(async () => {
      const isHealthy = await checkDatabaseHealth();
      
      if (isHealthy) {
        this.isConnected = true;
        databaseMonitor.updateConnectionStatus(true);
        logger.info('Database connection initialized successfully', {
          source: 'DatabaseConnection'
        });
        return true;
      }
      
      throw new Error('Database health check failed');
    }).catch(err => {
      logger.error('Failed to initialize database connection', {
        context: { 
          error: err,
          url: supabase.getUrl(),
          retryAttempts: this.retryStrategy.getAttempts()
        },
        source: 'DatabaseConnection'
      });
      this.isConnected = false;
      databaseMonitor.updateConnectionStatus(false);
      return false;
    });

    const result = await this.connectionPromise;
    this.connectionPromise = null;
    return result;
  }

  public isHealthy(): boolean {
    return this.isConnected;
  }
}

export const dbConnection = DatabaseConnection.getInstance();