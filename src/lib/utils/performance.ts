import { useCallback, useEffect, useRef } from 'react';
import { logger } from '../logger';
import { performanceMonitor } from '../monitoring/PerformanceMonitor';

const PERFORMANCE_SAMPLE_RATE = 0.1; // Sample 10% of performance measurements

export const measurePerformance = (name: string, metadata?: Record<string, any>) => {
  const id = performanceMonitor.startOperation(name, 'Performance', metadata);
  return () => performanceMonitor.endOperation(id);
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let waiting = false;
  
  return function throttledFunction(...args: Parameters<T>) {
    if (!waiting) {
      func(...args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
};

export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  return useCallback(
    throttle(callback, delay),
    [callback, delay]
  );
};

export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  return useCallback(
    debounce(callback, delay),
    [callback, delay]
  );
};

export const useIsFirstRender = () => {
  const isFirst = useRef(true);

  useEffect(() => {
    isFirst.current = false;
  }, []);

  return isFirst.current;
};