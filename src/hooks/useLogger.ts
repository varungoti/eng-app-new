export interface LoggerOptions {
  level?: 'debug' | 'info' | 'warn' | 'error';
  context?: Record<string, unknown>;
}

export interface Logger {
  debug: (message: string, data?: unknown) => void;
  info: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  error: (message: string, data?: unknown) => void;
}

export const useLogger = (namespace: string, options: LoggerOptions = {}): Logger => {
  const log = (_level: LoggerOptions['level'], _message: string, _data?: unknown) => {
    const timestamp = new Date().toISOString();
    const context = {
      namespace,
      timestamp,
      ...options.context
    };

    // In development, log to console
    // if (process.env.NODE_ENV === 'development') {
    //   console[level || 'log'](`[${namespace}] ${message}`, {
    //     ...context,
    //     data
    //   });
    // }

    // In production, you might want to send logs to a service
    if (process.env.NODE_ENV === 'production') {
      // Send logs to a centralized logging service
      try {
        const payload = {
          level: _level,
          message: _message,
          context,
          data: _data,
          timestamp: timestamp
        };
        
        // Use fetch API to send logs to logging service
        fetch('/api/logs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          // Use keepalive to ensure logs are sent even during page navigation
          keepalive: true
        }).catch(err => {
          // Fallback to console in case of network errors
          console.error('Failed to send log to service:', err);
        });
      } catch (error) {
        // Ensure logging failures don't break the application
        console.error('Error in production logging:', error);
      }
      // Example: Send to logging service
      // await logService.log({
      //   level,
      //   message,
      //   context,
      //   data
      // });
    }
  };

  return {
    debug: (message: string, data?: unknown) => log('debug', message, data),
    info: (message: string, data?: unknown) => log('info', message, data),
    warn: (message: string, data?: unknown) => log('warn', message, data),
    error: (message: string, data?: unknown) => log('error', message, data)
  };
}; 