import { supabase } from './supabase';
import { logger } from './logger';
import { errorHandler } from './errorHandler';

interface PoolConfig {
  maxConnections: number;
  minConnections: number;
  idleTimeout: number;
  healthCheckInterval: number;
}

interface PoolConnection {
  id: string;
  client: any;
  lastUsed: number;
  isHealthy: boolean;
}

class ConnectionPool {
  private static instance: ConnectionPool;
  private activeConnections: number = 0;
  private idleConnections: Map<string, PoolConnection> = new Map();
  private healthCheckTimer?: NodeJS.Timeout;
  private config: PoolConfig = {
    maxConnections: 10,
    minConnections: 2,
    idleTimeout: 30000, // 30 seconds
    healthCheckInterval: 60000 // 1 minute
  };

  private constructor() {
    this.startHealthChecks();
  }

  public static getInstance(): ConnectionPool {
    if (!ConnectionPool.instance) {
      ConnectionPool.instance = new ConnectionPool();
    }
    return ConnectionPool.instance;
  }

  public startMonitoring() {
    this.initializePool();
    this.startHealthChecks();
  }

  private async initializePool() {
    try {
      // Create minimum connections
      const connections = await Promise.all(
        Array(this.config.minConnections)
          .fill(null)
          .map(() => this.createConnection())
      );

      connections.forEach(conn => {
        if (conn) this.idleConnections.set(conn.id, conn);
      });

      logger.info('Connection pool initialized', 'ConnectionPool');

    } catch (err) {
      logger.error('Failed to initialize connection pool', 'ConnectionPool', err);
    }
  }



  private async createConnection(): Promise<PoolConnection | null> {
    try {
      // Check connection health using RPC call
      const { data, error } = await supabase.rpc('update_health_check');
      
      if (error) throw error;

      return {
        id: crypto.randomUUID(),
        client: supabase,
        lastUsed: Date.now(),
        isHealthy: true
      };
    } catch (err) {
      logger.error('Failed to create connection', 'ConnectionPool', err);
      return null;
    }

  }

  private startHealthChecks() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    this.healthCheckTimer = setInterval(
      () => this.performHealthCheck(),
      this.config.healthCheckInterval
    );
  }

  private async performHealthCheck() {
    try {
      const unhealthyConnections: string[] = [];

      // Check each connection
      for (const [id, conn] of this.idleConnections.entries()) {
        try {
          const { error } = await conn.client.rpc('update_health_check');
          if (error) {
            unhealthyConnections.push(id);
          }
        } catch {
          unhealthyConnections.push(id);
        }
      }

      // Remove unhealthy connections
      unhealthyConnections.forEach(id => {
        this.idleConnections.delete(id);
      });

      // Create new connections if needed
      if (this.idleConnections.size < this.config.minConnections) {
        const needed = this.config.minConnections - this.idleConnections.size;
        const newConnections = await Promise.all(
          Array(needed).fill(null).map(() => this.createConnection())
        );

        newConnections.forEach(conn => {
          if (conn) this.idleConnections.set(conn.id, conn);
        });
      }

      logger.info('Health check completed', 'ConnectionPool');

    } catch (err) {
      logger.error('Health check failed', 'ConnectionPool', err);
    }
  }


  public async getConnection() {
    try {
      // Get available idle connection
      for (const [id, conn] of this.idleConnections.entries()) {
        if (Date.now() - conn.lastUsed > this.config.idleTimeout) {
          this.idleConnections.delete(id);
          continue;
        }
        this.idleConnections.delete(id);
        this.activeConnections++;
        return conn.client;
      }

      // Create new connection if under limit
      if (this.activeConnections < this.config.maxConnections) {
        const conn = await this.createConnection();
        if (conn) {
          this.activeConnections++;
          return conn.client;
        }
      }

      // Return default client if no connections available
      return supabase;
    } catch (err) {
      logger.error('Failed to get connection', 'ConnectionPool', err);
      return supabase; // Fallback to default client

    }
  }

  public releaseConnection(client: any) {
    try {
      const conn: PoolConnection = {
        id: crypto.randomUUID(),
        client,
        lastUsed: Date.now(),
        isHealthy: true
      };
      this.idleConnections.set(conn.id, conn);
      this.activeConnections--;

      // Clean up old idle connections
      this.cleanupIdleConnections();
    } catch (err) {
      logger.error('Failed to release connection', 'ConnectionPool', err);
    }
  }

  private cleanupIdleConnections() {
    const now = Date.now();
    for (const [id, conn] of this.idleConnections.entries()) {
      if (now - conn.lastUsed > this.config.idleTimeout) {
        this.idleConnections.delete(id);
      }
    }
  }

  public getPoolStats() {
    return {
      activeConnections: this.activeConnections,
      idleConnections: this.idleConnections.size,
      totalConnections: this.activeConnections + this.idleConnections.size
    };
  }

  public cleanup() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    this.idleConnections.clear();
    this.activeConnections = 0;
  }
}

export const connectionPool = ConnectionPool.getInstance();