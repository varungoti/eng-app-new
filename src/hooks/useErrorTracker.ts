import { useState, useEffect } from 'react';
import { errorTracker, ErrorEvent } from '../lib/errorTracker';

export const useErrorTracker = () => {
  const [errors, setErrors] = useState<ErrorEvent[]>(errorTracker.getErrors());

  useEffect(() => {
    return errorTracker.subscribe(setErrors);
  }, []);

  return {
    errors,
    clearErrors: errorTracker.clearErrors.bind(errorTracker),
  };
};