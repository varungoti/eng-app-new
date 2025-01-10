import { useCallback } from 'react';
import { useError } from '../../hooks/useError';

interface ToastOptions {
  timeout?: number;
  type?: 'error' | 'success' | 'warning' | 'info';
}

export const useToast = () => {
  const { addError, clearError } = useError();

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const { timeout = 5000, type = 'info' } = options;

    switch (type) {
      case 'error':
        addError(message, timeout);
        break;
      // Add other toast types here when needed
      default:
        addError(message, timeout);
    }
  }, [addError]);

  return {
    showToast,
    clearToast: clearError
  };
};