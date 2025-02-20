import { LogLevel } from '../types/logging';

export interface LogContext {
  source?: string;
  context?: Record<string, any>;
  error?: Error | unknown;
  level?: LogLevel;
  timestamp?: string;
}

type LogMessage = string | { message: string; [key: string]: any };

class Logger {
  private static instance: Logger;
  private debugEnabled: boolean;

  private constructor() {
    this.debugEnabled = process.env.NODE_ENV === 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(message: LogMessage, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const source = context?.source ? `[${context.source}]` : '';
    const level = context?.level ? `[${context.level}]` : '';
    const emoji = this.getLogEmoji(context?.level);
    
    const formattedMessage = typeof message === 'string' ? message : message.message;
    
    return `[${timestamp}] ${formattedMessage} ${level} ${emoji} ${source}`;
  }

  private getLogEmoji(level?: LogLevel): string {
    switch (level) {
      case 'ERROR': return '❌';
      case 'WARN': return '⚠️';
      case 'INFO': return '✅👍🏻';
      case 'DEBUG': return '🔍🐞';
      default: return '';
    }
  }

  public debug(message: LogMessage, context?: LogContext): void {
    if (!this.debugEnabled) return;
    console.debug(this.formatMessage(message, { ...context, level: 'DEBUG' }));
  }

  public info(message: LogMessage, context?: LogContext): void {
    console.info(this.formatMessage(message, { ...context, level: 'INFO' }));
  }

  public warn(message: LogMessage, context?: LogContext): void {
    console.warn(this.formatMessage(message, { ...context, level: 'WARN' }));
  }

  public error(message: LogMessage, context?: LogContext): void {
    console.error(this.formatMessage(message, { ...context, level: 'ERROR' }));
  }
}

export const logger = Logger.getInstance();

export const createLogger = (namespace: string) => ({
  info: (message: string, context?: LogContext) => {
    console.log(`[${namespace}] ${message}`, context || '');
  },
  error: (message: string, context?: LogContext) => {
    console.error(`[${namespace}] ${message}`, context || '');
  },
  warn: (message: string, context?: LogContext) => {
    console.warn(`[${namespace}] ${message}`, context || '');
  }
});