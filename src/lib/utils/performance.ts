import { useCallback, useEffect, useRef } from 'react';
import { performanceMonitor } from '../monitoring/PerformanceMonitor';

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
    if (waiting) return;
    
    func(...args);
    waiting = true;
    setTimeout(() => {
      waiting = false;
    }, limit);
  };
};

export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const throttledCallbackRef = useRef<((...args: Parameters<T>) => void) | null>(null);
  
  // Create or update the throttled callback when dependencies change
  useEffect(() => {
    throttledCallbackRef.current = throttle(callback, delay);
  }, [callback, delay]);

  // Return a stable function reference that calls the current throttled function
  return useCallback((...args: Parameters<T>) => {
    throttledCallbackRef.current?.(...args);
  }, []);
};

export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) => {
  const debouncedCallbackRef = useRef<((...args: Parameters<T>) => void) | null>(null);
  
  // Create or update the debounced callback when dependencies change
  useEffect(() => {
    debouncedCallbackRef.current = debounce(callback, delay);
  }, [callback, delay]);

  // Return a stable function reference that calls the current debounced function
  return useCallback((...args: Parameters<T>) => {
    debouncedCallbackRef.current?.(...args);
  }, []);
};

export const useIsFirstRender = () => {
  const isFirst = useRef(true);

  useEffect(() => {
    isFirst.current = false;
  }, []);

  return isFirst.current;
};