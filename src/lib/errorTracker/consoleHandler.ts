import { ErrorTracker } from './ErrorTracker';
import { ErrorSeverity } from './types';
import type { ConsoleError } from './types';




class ConsoleHandler {
  private static instance: ConsoleHandler;
  private originalConsole: typeof console;
  private errorTracker: ErrorTracker;
  private errorBuffer: ConsoleError[] = [];
  private bufferSize = 50;

  private constructor() {
    this.originalConsole = { ...console };
    this.errorTracker = ErrorTracker.getInstance();
    this.setupConsoleOverrides();
  }

  public static getInstance(): ConsoleHandler {
    if (!ConsoleHandler.instance) {
      ConsoleHandler.instance = new ConsoleHandler();
    }
    return ConsoleHandler.instance;
  }

  private setupConsoleOverrides() {
    // Override console.error
    console.error = (...args: any[]) => {
      this.handleConsoleError(args);
      this.originalConsole.error(...args);
    };

    // Override console.warn
    console.warn = (...args: any[]) => {
      this.handleConsoleWarning(args);
      this.originalConsole.warn(...args);
    };
  }

  private handleConsoleError(args: any[]) {
    const error: ConsoleError = {
      message: this.formatErrorMessage(args),
      stack: this.extractStack(args),
      timestamp: Date.now(),
      args
    };

    // Extract context from error arguments
    const context = args.length > 1 && typeof args[1] === 'object' ? args[1] : {};

    this.bufferError(error);
    this.trackError(error, ErrorSeverity.HIGH, context);
  }


  private handleConsoleWarning(args: any[]) {
    const warning: ConsoleError = {
      message: this.formatErrorMessage(args),
      timestamp: Date.now(),
      args
    };

    this.bufferError(warning);
    this.trackError(warning, ErrorSeverity.MEDIUM);

  }

  private formatErrorMessage(args: any[]): string {
    return args
      .map(arg => {
        if (arg instanceof Error) {
          return arg.message;
        }
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(' ');
  }

  private extractStack(args: any[]): string | undefined {
    const error = args.find(arg => arg instanceof Error);
    return error?.stack;
  }

  private bufferError(error: ConsoleError) {
    this.errorBuffer.unshift(error);
    if (this.errorBuffer.length > this.bufferSize) {
      this.errorBuffer.pop();
    }
  }

  private trackError(error: ConsoleError, severity: ErrorSeverity, context?: Record<string, any>) {
    this.errorTracker.trackError({
      message: error.message,
      severity,
      source: 'Console',
      context: {
        ...context,
        stack: error.stack,
        arguments: error.args,
        timestamp: error.timestamp
      }
    });
  }

  public getBuffer(): ConsoleError[] {
    return [...this.errorBuffer];
  }

  public clearBuffer() {
    this.errorBuffer = [];
  }
}

export const consoleHandler = ConsoleHandler.getInstance();