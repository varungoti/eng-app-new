import { NextRouter } from 'next/router';

export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';

export interface ErrorEvent {
  id: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: number;
  componentStack?: string;
  context?: Record<string, any>;
  source: string;
  resolved?: boolean;
  resolution?: string;
}

export interface ErrorResolution {
  id: string;
  errorId: string;
  action: string;
  timestamp: number;
  successful: boolean;
  details?: string;
}

export interface ErrorWatcherConfig {
  maxErrors?: number;
  autoResolve?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  logToConsole?: boolean;
  router?: NextRouter;
}