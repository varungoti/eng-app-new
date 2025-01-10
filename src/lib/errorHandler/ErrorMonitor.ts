import { logger } from '../logger';
import { errorRegistry, type ErrorRegistryEntry } from './ErrorRegistry';
import { errorMetrics } from './ErrorMetrics';

interface ErrorMonitorConfig {
  maxErrors?: number;
  retryAttempts?: number;
  retryDelay?: number;
  logToConsole?: boolean;
}

class ErrorMonitor {
  private static instance: ErrorMonitor;
  private subscribers: Set<(errors: ErrorRegistryEntry[]) => void> = new Set();
  private config: Required<ErrorMonitorConfig> = {
    maxErrors: 100,
    retryAttempts: 3,
    retryDelay: 1000,
    logToConsole: import.meta.env.DEV
  };

  private constructor(config: ErrorMonitorConfig = {}) {
    this.config = { ...this.config, ...config };
    this.setupGlobalHandlers();
  }

  public static getInstance(config?: ErrorMonitorConfig): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor(config);
    }
    return ErrorMonitor.instance;
  }

  private setupGlobalHandlers() {
    window.addEventListener('error', (event) => {
      this.handleError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason || new Error('Unhandled Promise Rejection'));
    });
  }

  public handleError(error: Error, context?: Record<string, any>): string {
    const errorId = errorRegistry.registerError(error, 'ErrorMonitor', context);

    if (this.config.logToConsole) {
      logger.error(error.message, {
        context: {
          ...context,
          errorId,
          stack: error.stack
        },
        source: 'ErrorMonitor'
      });
    }

    this.notifySubscribers();
    return errorId;
  }

  public async retryOperation(errorId: string): Promise<boolean> {
    const entry = errorRegistry.getError(errorId);
    if (!entry) return false;

    if (entry.retryCount >= this.config.retryAttempts) {
      logger.warn('Max retry attempts reached', {
        context: { errorId, retryCount: entry.retryCount },
        source: 'ErrorMonitor'
      });
      return false;
    }

    try {
      // Increment retry count
      errorRegistry.incrementRetry(errorId);

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 
        this.config.retryDelay * Math.pow(2, entry.retryCount)
      ));

      // Mark as handled if successful
      errorRegistry.markAsHandled(errorId);
      this.notifySubscribers();
      return true;
    } catch (err) {
      logger.error('Retry failed', {
        context: { errorId, error: err },
        source: 'ErrorMonitor'
      });
      return false;
    }
  }

  public getUnhandledErrors(): ErrorRegistryEntry[] {
    return errorRegistry.getUnhandledErrors();
  }

  public getErrorsBySource(source: string): ErrorRegistryEntry[] {
    return errorRegistry.getErrorsBySource(source);
  }

  public getMetrics() {
    return errorMetrics.getMetrics();
  }

  public subscribe(callback: (errors: ErrorRegistryEntry[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    const errors = errorRegistry.getUnhandledErrors();
    this.subscribers.forEach(callback => callback(errors));
  }
}

export const errorMonitor = ErrorMonitor.getInstance();