import { ErrorEvent, ErrorResolution, ErrorSeverity, ErrorWatcherConfig } from './types';
import { ErrorResolver } from './ErrorResolver';
import { logger } from '../logger';
import { DEBUG_CONFIG } from '../config';

export class ErrorWatcher {
  private static instance: ErrorWatcher;
  private errors: ErrorEvent[] = [];
  private config: Required<ErrorWatcherConfig> = {
    maxErrors: 100,
    autoResolve: true,
    retryAttempts: 3,
    retryDelay: 1000,
    logToConsole: DEBUG_CONFIG.enabled,
    router: null
  };

  private constructor(config: ErrorWatcherConfig = {}) {
    this.config = { ...this.config, ...config };
  }

  public trackError(error: ErrorEvent): void {
    this.errors = [error, ...this.errors].slice(0, this.config.maxErrors);
    
    if (this.config.logToConsole) {
      const logLevel = error.severity === ErrorSeverity.CRITICAL ? 'error' :
                      error.severity === ErrorSeverity.HIGH ? 'error' :
                      error.severity === ErrorSeverity.MEDIUM ? 'warn' : 'info';
      
      logger[logLevel](error.message, error.source);
    }
  }
}