import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../database.types';

export interface MonitoringConfig {
  supabase?: SupabaseClient<Database>;
  enableLogging?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  sampleRate?: number;
}

export interface LoadingState {
  isLoading: boolean;
  startTime?: number;
  duration?: number;
}

export interface DataFlowMetrics {
  operationCount: number;
  errorCount: number;
  averageDuration: number;
}

export interface DataLoadMetrics {
  recordCount: number;
  errorCount: number;
  averageDuration: number;
}

export interface DatabaseMetrics {
  connectionStatus: 'error' | 'healthy' | 'degraded';
  lastCheckTime: Date;
  responseTime: number;
  count: number;
  errorCount: number;
}

export interface DataFlowMonitor {
  trackDataLoad: (loadId: string, metadata: { source: string; recordCount: number }) => Promise<void>;
  getFlowMetrics: (flowId: string) => Promise<any[]>;
  startOperation: (type: string, name: string, metadata?: any) => string;
  endOperation: (opId: string) => void;
}