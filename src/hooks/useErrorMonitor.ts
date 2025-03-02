import { useState, useEffect } from 'react';
import { errorMonitor } from '../lib/errorHandler/ErrorMonitor';
import type { ErrorRegistryEntry } from '../lib/errorHandler/ErrorRegistry';
//import type { ErrorMetrics } from '../lib/errorHandler/ErrorMetrics';

export const useErrorMonitor = (source?: string) => {
  const [errors, setErrors] = useState<ErrorRegistryEntry[]>(
    source 
      ? errorMonitor.getErrorsBySource(source)
      : errorMonitor.getUnhandledErrors()
  );

  useEffect(() => {
    return errorMonitor.subscribe(allErrors => {
      if (source) {
        setErrors(allErrors.filter(e => e.source === source));
      } else {
        setErrors(allErrors);
      }
    });
  }, [source]);

  const retryOperation = async (errorId: string) => {
    return errorMonitor.retryOperation(errorId);
  };

  const clearError = (errorId: string) => {
    const error = errorMonitor.getUnhandledErrors().find(e => e.id === errorId);
    if (error) {
      error.handled = true;
      setErrors(errors.filter(e => e.id !== errorId));
    }
  };

  return {
    errors,
    metrics: errorMonitor.getMetrics(),
    retryOperation,
    clearError
  };
};