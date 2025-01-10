import { logger } from './logger';

interface ErrorHandlerOptions {
  retry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  context?: Record<string, any>;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Set<(error: Error) => void> = new Set();

  private constructor() {
    this.setupGlobalHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  private setupGlobalHandlers() {
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        context: { type: 'unhandledrejection' }
      });
    });

    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        context: { type: 'error', message: event.message }
      });
    });
  }

  public async handle<T>(
    operation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<T> {
    const {
      retry = false,
      maxRetries = 3,
      retryDelay = 1000,
      context = {}
    } = options;

    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < (retry ? maxRetries : 1)) {
      try {
        return await operation();
      } catch (error) {
        attempts++;
        lastError = error instanceof Error ? error : new Error(String(error));
        
        this.handleError(error, {
          context: {
            ...context,
            attempt: attempts,
            maxRetries
          }
        });

        if (attempts < maxRetries && retry) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempts));
          continue;
        }
      }
    }

    throw lastError || new Error('Operation failed after max retries');
  }

  private handleError(error: any, options: { context?: Record<string, any> } = {}) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logger.error(errorMessage, {
      context: {
        ...options.context,
        stack: error instanceof Error ? error.stack : undefined
      },
      source: 'ErrorHandler'
    });

    this.notifyListeners(error instanceof Error ? error : new Error(errorMessage));
  }

  public addListener(listener: (error: Error) => void): () => void {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  private notifyListeners(error: Error) {
    this.errorListeners.forEach(listener => listener(error));
  }
}

export const errorHandler = ErrorHandler.getInstance();