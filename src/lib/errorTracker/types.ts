import { Router } from "next/router";

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

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
  retryCount?: number;
  endpoint?: string;
  statusCode?: number;
}

export interface ErrorWatcherConfig {
  maxErrors?: number;
  autoResolve?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  logToConsole?: boolean;
  router?: Router | null;
}

export interface ErrorWatcher {
  start(): void;
  stop(): void;
  addError(error: ErrorEvent): void;
  getErrors(): ErrorEvent[];
  clearErrors(): void;
}

export interface ErrorResolver {
  resolve(error: ErrorEvent): Promise<void>;
  retry(error: ErrorEvent): Promise<void>;
  ignore(error: ErrorEvent): Promise<void>;
}

export interface ConsoleError {
  message: string;
  stack?: string;
  timestamp: number;
  args: any[];
  severity?: ErrorSeverity;
  source?: string;
  context?: Record<string, any>;
}

export interface ErrorResolution {
  errorId: string;
  resolution: string;
  timestamp: number;
  successful: boolean;
  attempts: number;
  resolved: boolean;
  details?: Record<string, any>;
}

export interface ErrorWatcherConfig {
  maxErrors?: number;
  autoResolve?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  logToConsole?: boolean;
  router?: Router | null;
}

export interface ErrorWatcher {
  start(): void;
  stop(): void;
  addError(error: ErrorEvent): void;
  getErrors(): ErrorEvent[];
  clearErrors(): void;
}

export interface ErrorResolver {
  resolve(error: ErrorEvent): Promise<void>;
  retry(error: ErrorEvent): Promise<void>;
  ignore(error: ErrorEvent): Promise<void>;
}

export interface ErrorWatcherConfig {
  maxErrors?: number;
  autoResolve?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
  logToConsole?: boolean;
  router?: Router | null;
}

export interface NetworkError {
  message: string;
  endpoint?: string;
  statusCode?: number;
  timestamp: number;
  retryCount: number;
}







