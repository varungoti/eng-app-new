export interface MonitoringEvent {
  id: string;
  type: string;
  timestamp: number;
  duration?: number;
  status: 'success' | 'error' | 'warning';
  context?: Record<string, any>;
  source: string;
}

export interface LoadingState {
  id: string;
  component: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'pending' | 'complete' | 'error';
  error?: Error;
  timeoutId?: number;
}
export interface PerformanceMetrics {
  operationCount: number;
  errorCount: number;
  averageDuration: number;
  slowOperations: number;
}