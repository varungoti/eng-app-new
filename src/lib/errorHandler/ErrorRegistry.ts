import { logger } from '../logger';

export interface ErrorRegistryEntry {
  id: string;
  timestamp: number;
  error: Error;
  context?: Record<string, any>;
  handled: boolean;
  source: string;
  retryCount: number;
}

class ErrorRegistry {
  private static instance: ErrorRegistry;
  private errors: Map<string, ErrorRegistryEntry> = new Map();
  private readonly MAX_ERRORS = 100;
  private readonly ERROR_TTL = 30 * 60 * 1000; // 30 minutes

  private constructor() {
    // Clean up old errors periodically
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  public static getInstance(): ErrorRegistry {
    if (!ErrorRegistry.instance) {
      ErrorRegistry.instance = new ErrorRegistry();
    }
    return ErrorRegistry.instance;
  }

  public registerError(error: Error, source: string, context?: Record<string, any>): string {
    const id = crypto.randomUUID();
    
    this.errors.set(id, {
      id,
      timestamp: Date.now(),
      error,
      context,
      handled: false,
      source,
      retryCount: 0
    });

    // Log the error
    logger.error(error.message, {
      context: {
        ...context,
        errorId: id,
        stack: error.stack
      },
      source
    });

    // Remove oldest error if limit reached
    if (this.errors.size > this.MAX_ERRORS) {
      const oldest = Array.from(this.errors.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0];
      if (oldest) {
        this.errors.delete(oldest[0]);
      }
    }

    return id;
  }

  public markAsHandled(id: string): void {
    const entry = this.errors.get(id);
    if (entry) {
      entry.handled = true;
      this.errors.set(id, entry);
    }
  }

  public incrementRetry(id: string): void {
    const entry = this.errors.get(id);
    if (entry) {
      entry.retryCount++;
      this.errors.set(id, entry);
    }
  }

  public getError(id: string): ErrorRegistryEntry | undefined {
    return this.errors.get(id);
  }

  public getUnhandledErrors(): ErrorRegistryEntry[] {
    return Array.from(this.errors.values())
      .filter(entry => !entry.handled)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  public getErrorsBySource(source: string): ErrorRegistryEntry[] {
    return Array.from(this.errors.values())
      .filter(entry => entry.source === source)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [id, entry] of this.errors.entries()) {
      if (now - entry.timestamp > this.ERROR_TTL) {
        this.errors.delete(id);
      }
    }
  }
}

export const errorRegistry = ErrorRegistry.getInstance();