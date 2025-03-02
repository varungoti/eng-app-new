import { supabase } from './supabase';
import { logger } from './logger';
//import { errorHandler } from './errorHandler';

interface ConnectionState {
  isConnected: boolean;
  lastConnected: Date | null;
  reconnectAttempts: number;
}

class ConnectionManager {
  private static instance: ConnectionManager;
  private state: ConnectionState = {
    isConnected: false,
    lastConnected: null,
    reconnectAttempts: 0
  };
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 2000;
  private readonly HEALTH_CHECK_INTERVAL = 30000;
  private healthCheckTimer?: NodeJS.Timeout;
  private listeners: Set<(state: ConnectionState) => void> = new Set();
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  public async initialize() {
    if (this.initialized) return;
    
    try {
      // Initial connection check
      const isConnected = await this.checkConnection();
      this.updateState({ isConnected });
      
      if (isConnected) {
        this.startMonitoring();
        this.initialized = true;
      } else {
        throw new Error('Failed to establish initial connection');
      }
    } catch (err) {
      logger.error('Failed to initialize connection manager', { source: 'ConnectionManager', error: err });
      throw err;
    }

  }

  public startMonitoring() {
    this.setupConnectionMonitoring();
    this.checkConnection();
  }

  private setupConnectionMonitoring() {
    // Monitor online/offline status
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Start periodic health checks
    this.startHealthChecks();
  }

  private startHealthChecks() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    this.healthCheckTimer = setInterval(
      () => this.checkConnection(),
      this.HEALTH_CHECK_INTERVAL
    );
  }

  private async checkConnection(): Promise<boolean> {
    try {
      // Check database connection using RPC call
      const { data, error } = await supabase.rpc('update_health_check');

      const isConnected = !error && data;
      this.updateState({ isConnected });
      
      if (isConnected) {
        this.updateState({ 
          lastConnected: new Date(),
          reconnectAttempts: 0
        });
        logger.info('Connection check successful', { source: 'ConnectionManager' });

      }

      return isConnected;
    } catch (err) {
      this.updateState({ isConnected: false });
      logger.error('Connection check failed', { source: 'ConnectionManager', error: err });
      return false;

    }
  }

  private async handleOnline() {
    logger.info('Device came online', { source: 'ConnectionManager' });
    await this.attemptReconnect();
  }


  private handleOffline() {
    logger.warn('Device went offline', { source: 'ConnectionManager' });
    this.updateState({ isConnected: false });
  }


  private async attemptReconnect(): Promise<boolean> {
    if (this.state.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      logger.error(`Max reconnection attempts reached: ${this.state.reconnectAttempts}`, { source: 'ConnectionManager' });
      return false;
    }

    this.state.reconnectAttempts++;
    
    // Check database connection
    const isConnected = await this.checkConnection();
    
    if (isConnected) {
      this.updateState({
        isConnected: true,
        lastConnected: new Date(),
        reconnectAttempts: 0
      });
      return true;
    }

    // Exponential backoff
    const delay = this.RECONNECT_DELAY * Math.pow(2, this.state.reconnectAttempts);
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return this.attemptReconnect();
  }

  private updateState(updates: Partial<ConnectionState>) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  public addListener(listener: (state: ConnectionState) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.state }); // Immediately notify with current state
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.state }));
  }

  public getState(): ConnectionState {
    return { ...this.state };
  }

  public async forceReconnect(): Promise<boolean> {
    this.state.reconnectAttempts = 0;
    return this.attemptReconnect();
  }

  public cleanup() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    this.listeners.clear();
    this.initialized = false;
  }
}

export const connectionManager = ConnectionManager.getInstance();