import { useState, useEffect } from 'react';
import { ErrorWatcher } from '../ErrorWatcher';
import { ErrorEvent } from '../types';

export const useErrorWatcher = () => {
  const [errors, setErrors] = useState<ErrorEvent[]>(ErrorWatcher.getInstance().getErrors());

  useEffect(() => {
    return ErrorWatcher.getInstance().subscribe(setErrors);
  }, []);

  const resolveError = async (errorId: string) => {
    return ErrorWatcher.getInstance().resolveError(errorId);
  };

  const clearErrors = () => {
    ErrorWatcher.getInstance().clearErrors();
  };

  return {
    errors,
    resolveError,
    clearErrors,
  };
};