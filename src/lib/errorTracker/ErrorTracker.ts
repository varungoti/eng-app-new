import { ErrorEvent, ErrorResolution, ErrorWatcherConfig } from './types';
import { ErrorResolver } from './ErrorResolver';
import { logger } from '../logger';
//import { consoleHandler } from './consoleHandler';
//import { networkHandler } from './networkHandler';
import { ErrorSeverity } from './types';


export class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: Map<string, ErrorEvent> = new Map();
  private resolutions: ErrorResolution[] = [];
  private listeners: Set<(errors: ErrorEvent[]) => void> = new Set();
  private resolver: ErrorResolver;
  private config: Required<ErrorWatcherConfig> = {
    maxErrors: 100,
    autoResolve: true,
    retryAttempts: 3,
    retryDelay: 1000,
    logToConsole: import.meta.env.DEV,
    router: null,
  };

  private constructor(config: ErrorWatcherConfig = {}) {
    this.config = { ...this.config, ...config };
    this.resolver = ErrorResolver.getInstance(this.config);

    // Initialize handlers
    // Register handlers without using non-existent init methods
    //const handlers = [consoleHandler, networkHandler];
    
    // Set up global error handlers
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.error?.message || 'An error occurred',
        severity: ErrorSeverity.HIGH,
        source: 'Window',

        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        severity: ErrorSeverity.HIGH,
        source: 'Promise',
        context: {
          reason: event.reason
        }
      });

    });
  }

  public static getInstance(config?: ErrorWatcherConfig): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker(config);
    }
    return ErrorTracker.instance;
  }

  public trackError(error: Omit<ErrorEvent, 'id' | 'timestamp' | 'resolved'>): void {
    const errorEvent: ErrorEvent = {
      ...error,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      resolved: false,
    };

    this.errors.set(errorEvent.id, errorEvent);
    
    // Trim if exceeding max size
    if (this.errors.size > this.config.maxErrors) {
      const oldestKey = this.errors.keys().next().value;
      if (oldestKey) {
        this.errors.delete(oldestKey);
      }
    }
    
    if (this.config.logToConsole) {
      logger.error(error.message, { 
        source: 'ErrorTracker',
        context: { severity: error.severity }
      });
    }

    if (this.config.autoResolve) {
      this.resolver.resolveError(errorEvent, 'Auto-resolved').then(() => {
        this.addResolution({
          errorId: errorEvent.id,
          resolution: 'Auto-resolved',
          timestamp: Date.now(),
          successful: true,
          details: { message: 'Automatically resolved by system' },
          attempts: 1,
          resolved: true
        });
      });

    }


    this.notifyListeners();
  }

  public async resolveError(errorId: string): Promise<boolean> {
    const error = this.errors.get(errorId);
    if (!error) return false;


    await this.resolver.resolveError(error, 'Manual resolution');
    this.addResolution({
      errorId: error.id,
      resolution: 'Manual resolution',
      timestamp: Date.now(),
      successful: true,
      details: { message: 'Manually resolved by user' },
      attempts: 1,
      resolved: true
    });
    return true;
  }

  public getErrors(): ErrorEvent[] {
    return Array.from(this.errors.values());
  }

  public getResolutions(): ErrorResolution[] {
    return [...this.resolutions];
  }

  public clearErrors(): void {
    this.errors.clear();
    this.notifyListeners();
  }


  public subscribe(listener: (errors: ErrorEvent[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private addResolution(resolution: ErrorResolution): void {
    this.resolutions.push(resolution);
    const error = this.errors.get(resolution.errorId);
    if (error) {
      error.resolved = resolution.successful;

      error.resolution = resolution.details?.message;
    }
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getErrors()));
  }
}