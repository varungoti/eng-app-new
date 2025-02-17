import { useState, useEffect } from 'react';
import { performanceMonitor, type PerformanceMetric } from '../lib/monitoring/PerformanceMonitor';

export const usePerformanceMonitor = (source?: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>(performanceMonitor.getAllMetrics());

  useEffect(() => {
    return performanceMonitor.subscribe(allMetrics => {
      if (source) {
        setMetrics(allMetrics.filter(m => m.source === source));
      } else {
        setMetrics(allMetrics);
      }
    });
  }, [source]);

  const startOperation = (operation: string, context?: Record<string, any>) => {
    return performanceMonitor.startOperation(operation, source || 'unknown', context);
  };

  const endOperation = (id: string, success: boolean = true) => {
    performanceMonitor.endOperation(id, success);
  };

  return {
    metrics,
    activeOperations: metrics.filter(m => m.status === 'pending'),
    completedOperations: metrics.filter(m => m.status !== 'pending'),
    startOperation,
    endOperation
  };
};