import { debounce } from './utils';
import { logger } from './logger';

export type ErrorSeverity = 'error' | 'warning' | 'info';

export interface ErrorEvent {
  id: string;
  timestamp: number;
  message: string;
  severity: ErrorSeverity;
  context?: Record<string, any>;
  componentStack?: string;
  source: string;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private errors: ErrorEvent[] = [];
  private errorCache: Map<string, number> = new Map();
  private listeners: Set<(errors: ErrorEvent[]) => void> = new Set();
  private maxErrors: number = 100;
  private readonly ERROR_CACHE_TTL = 5000; // 5 seconds between duplicate errors

  private constructor() {
    // Private constructor to enforce singleton
    setInterval(() => this.cleanErrorCache(), 60000); // Clean cache every minute
  }

  public static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  private cleanErrorCache(): void {
    const now = Date.now();
    for (const [key, timestamp] of this.errorCache.entries()) {
      if (now - timestamp > this.ERROR_CACHE_TTL) {
        this.errorCache.delete(key);
      }
    }
  }

  private createErrorKey(error: Omit<ErrorEvent, 'id' | 'timestamp'>): string {
    return `${error.message}:${error.source}:${error.severity}`;
  }

  private isDuplicateError(error: Omit<ErrorEvent, 'id' | 'timestamp'>): boolean {
    const key = this.createErrorKey(error);
    const lastOccurrence = this.errorCache.get(key);
    const now = Date.now();

    if (lastOccurrence && now - lastOccurrence < this.ERROR_CACHE_TTL) {
      return true;
    }

    this.errorCache.set(key, now);
    return false;
  }

  public trackError(error: Omit<ErrorEvent, 'id' | 'timestamp'>): void {
    // Skip if this is a duplicate error within the TTL window
    if (this.isDuplicateError(error)) {
      return;
    }

    const errorEvent: ErrorEvent = {
      ...error,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    this.errors = [errorEvent, ...this.errors].slice(0, this.maxErrors);
    this.notifyListeners();

    // Log to console in development
    if (import.meta.env.DEV) {
      logger.error(`🔴 Error Tracked: ${error.source} - ${error.message}`, { 
        source: 'ErrorTracker',
        error: {
          ...error,
          context: error.context,
          componentStack: error.componentStack
        }
      });
    }
  }

  public getErrors(): ErrorEvent[] {
    return [...this.errors];
  }

  public clearErrors(): void {
    this.errors = [];
    this.notifyListeners();
  }

  public subscribe(listener: (errors: ErrorEvent[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners = debounce(() => {
    this.listeners.forEach(listener => listener(this.getErrors()));
  }, 100);
}

export const errorTracker = ErrorTracker.getInstance();