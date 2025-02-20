import { useState, useRef, useEffect } from 'react';
import { monitors } from '../lib/monitoring';
import { performanceMonitor } from '../lib/monitoring/PerformanceMonitor';
import { logger } from '../lib/logger';

export const useLoadingState = (source: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [loadId, setLoadId] = useState<string | null>(null);
  const [perfId, setPerfId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<number>();

  const startLoading = (operation: string, queryKey?: string[]) => {
    // Start data load monitoring
    const dataLoadId = monitors.dataLoadMonitor.startLoad(source, operation, queryKey);
    setLoadId(dataLoadId);

    // Start performance monitoring
    const performanceId = performanceMonitor.startOperation(operation, source, { queryKey });
    setPerfId(performanceId);

    setIsLoading(true);
    setLoadTime(null);
    setProgress(0);

    // Start progress animation
    progressInterval.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev;
        return prev + (95 - prev) * 0.1;
      });
    }, 100);

    logger.info(`Starting operation: ${operation}`, {
      context: { queryKey },
      source
    });
  };

  const endLoading = (success: boolean = true) => {
    if (loadId) {
      monitors.dataLoadMonitor.endLoad(loadId, success);
      const metrics = monitors.dataLoadMonitor.getMetrics();
      const metric = metrics.find(m => m.duration);
      if (metric?.duration) {
        setLoadTime(metric.duration);
      }
    }

    if (perfId) {
      performanceMonitor.endOperation(perfId, success);
    }

    setIsLoading(false);
    setLoadId(null);
    setPerfId(null);
    setProgress(100);

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    logger.info('Loading completed', {
      context: { success, duration: loadTime },
      source
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadId) {
        monitors.dataLoadMonitor.endLoad(loadId, false);
      }
      if (perfId) {
        performanceMonitor.endOperation(perfId, false);
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [loadId, perfId]);

  return {
    isLoading,
    loadTime,
    progress,
    startLoading,
    endLoading
  };
};