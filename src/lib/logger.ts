import { DEBUG_CONFIG } from './config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  context?: Record<string, any>;
  source: string;
}

class Logger {
  private static instance: Logger;
  
  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private safeStringify(value: unknown): string {
    try {
      if (value instanceof Error) {
        return JSON.stringify({
          message: value.message,
          name: value.name,
          stack: value.stack
        });
      }
      if (typeof value === 'string') {
        return value;
      }
      if (value && typeof value === 'object') {
        return JSON.stringify(value, (key, val) => {
          // Handle circular references and non-serializable objects
          if (val instanceof Error) {
            return {
              message: val.message,
              name: val.name,
              stack: val.stack
            };
          }
          if (typeof val === 'object' && val !== null) {
            // Remove any Symbol properties
            const clean = { ...val };
            Object.getOwnPropertySymbols(val).forEach(sym => {
              delete clean[sym as any];
            });
            return clean;
          }
          return val;
        });
      }
      return String(value);
    } catch {
      return '[Unable to stringify value]';
    }
  }

  private log(level: LogLevel, message: string, options: LogOptions) {
    const { context, source } = options;
    
    const timestamp = new Date().toISOString();
    const logPrefix = `[${timestamp}] [${source}] [${level.toUpperCase()}]`;
    
    if (DEBUG_CONFIG.enabled) {
      if (level === 'error') {
        console.group(`${logPrefix} 🔴 Error`);
        console.error(message);
        if (context?.error) {
          console.error('Error details:', this.safeStringify(context.error));
        }
        if (context) {
          const safeContext = Object.entries(context).reduce((acc, [key, val]) => ({
            ...acc,
            [key]: this.safeStringify(val)
          }), {});
          console.log('Context:', safeContext);
        }
        console.groupEnd();
      } else if (level === 'warn') {
        console.group(`${logPrefix} ⚠️ Warning`);
        console.warn(message);
        if (context) console.log('Context:', this.safeStringify(context));
        console.groupEnd();
      } else if (level === 'info' || level === 'debug') {
        console.group(`${logPrefix} ℹ️ ${level}`);
        console.log(message);
        if (context) console.log('Context:', this.safeStringify(context));
        console.groupEnd();
      }
    }
  }

  public debug(message: string, options: LogOptions) {
    this.log('debug', message, options);
  }

  public info(message: string, options: LogOptions) {
    this.log('info', message, options);
  }

  public warn(message: string, options: LogOptions) {
    this.log('warn', message, options);
  }

  public error(message: string, options: LogOptions) {
    this.log('error', message, options);
  }
}

export const logger = Logger.getInstance();