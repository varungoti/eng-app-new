import { ErrorEvent, ErrorResolution, ErrorWatcherConfig } from './types';
import { ErrorResolver } from './ErrorResolver';
import { logger } from '../logger';

export class ErrorWatcher {
  private static instance: ErrorWatcher;
  private errors: ErrorEvent[] = [];
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
    this.resolver = new ErrorResolver(this.config);
    
    // Set up global error handler
    window.addEventListener('error', (event) => {
      this.trackError({
        message: event.error?.message || 'An error occurred',
        severity: 'error',
        source: 'Window',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }
      });
    });

    // Set up unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        severity: 'error',
        source: 'Promise',
        context: {
          reason: event.reason
        }
      });
    });
  }

  public static getInstance(config?: ErrorWatcherConfig): ErrorWatcher {
    if (!ErrorWatcher.instance) {
      ErrorWatcher.instance = new ErrorWatcher(config);
    }
    return ErrorWatcher.instance;
  }

  public trackError(error: Omit<ErrorEvent, 'id' | 'timestamp' | 'resolved'>): void {
    const errorEvent: ErrorEvent = {
      ...error,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      resolved: false,
    };

    this.errors = [errorEvent, ...this.errors].slice(0, this.config.maxErrors);
    
    if (this.config.logToConsole) {
      logger.error(error.message, {
        context: {
          ...error.context,
          severity: error.severity,
          componentStack: error.componentStack,
        },
        source: error.source,
      });
    }

    if (this.config.autoResolve) {
      this.resolver.attemptResolution(errorEvent).then((resolution) => {
        if (resolution) {
          this.addResolution(resolution);
        }
      });
    }

    this.notifyListeners();
  }

  public async resolveError(errorId: string): Promise<boolean> {
    const error = this.errors.find(e => e.id === errorId);
    if (!error) return false;

    const resolution = await this.resolver.attemptResolution(error);
    if (resolution) {
      this.addResolution(resolution);
      return resolution.successful;
    }
    return false;
  }

  public getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  public getResolutions(): ErrorResolution[] {
    return [...this.resolutions];
  }

  public clearErrors(): void {
    this.errors = [];
    this.notifyListeners();
  }

  public subscribe(listener: (errors: ErrorEvent[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private addResolution(resolution: ErrorResolution): void {
    this.resolutions = [resolution, ...this.resolutions];
    const error = this.errors.find(e => e.id === resolution.errorId);
    if (error) {
      error.resolved = resolution.successful;
      error.resolution = resolution.details;
    }
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getErrors()));
  }
}