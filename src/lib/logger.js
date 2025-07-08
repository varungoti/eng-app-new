/**
 * Logger utility for the application
 * Provides consistent logging with different log levels
 */

import { env } from '@/config/env';

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Current log level based on environment
const currentLogLevel = env.IS_PRODUCTION ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

/**
 * Logger class with different log levels
 */
class Logger {
  constructor(namespace = 'app') {
    this.namespace = namespace;
  }

  /**
   * Format log message with timestamp and namespace
   */
  formatMessage(message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${this.namespace}] ${message}`;
  }

  /**
   * Debug level logging
   */
  debug(...args) {
    if (currentLogLevel <= LOG_LEVELS.DEBUG) {
      console.debug(this.formatMessage(args[0]), ...args.slice(1));
    }
  }

  /**
   * Info level logging
   */
  info(...args) {
    if (currentLogLevel <= LOG_LEVELS.INFO) {
      console.info(this.formatMessage(args[0]), ...args.slice(1));
    }
  }

  /**
   * Warning level logging
   */
  warn(...args) {
    if (currentLogLevel <= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage(args[0]), ...args.slice(1));
    }
  }

  /**
   * Error level logging
   */
  error(...args) {
    if (currentLogLevel <= LOG_LEVELS.ERROR) {
      console.error(this.formatMessage(args[0]), ...args.slice(1));
    }
  }

  /**
   * Create a new logger with a child namespace
   */
  child(namespace) {
    return new Logger(`${this.namespace}:${namespace}`);
  }
}

// Create and export the default logger
export const logger = new Logger();
