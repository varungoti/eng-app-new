import { useState, useEffect } from 'react';
import { errorMetrics } from '../lib/errorHandler/ErrorMetrics';

export const useErrorMetrics = (refreshInterval: number = 5000) => {
  const [metrics, setMetrics] = useState(errorMetrics.getMetrics());

  useEffect(() => {
    const timer = setInterval(() => {
      setMetrics(errorMetrics.getMetrics());
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [refreshInterval]);

  return metrics;
};