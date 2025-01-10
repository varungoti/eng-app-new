import { useError } from './useError';

interface ToastOptions {
  timeout?: number;
  type?: 'error' | 'success' | 'warning' | 'info'; 
  position?: 'top' | 'bottom';
}

export const useToast = () => {
  const { addError, clearError } = useError();

  const showToast = (message: unknown, options: ToastOptions = {}) => {
    const { timeout = 3000, type = 'info', position = 'top' } = options;
    
    // Convert any message type to string safely
    const safeMessage = (() => {
      try {
        if (message instanceof Error) {
          return message.message;
        }
        if (typeof message === 'string') {
          return message;
        }
        if (message && typeof message === 'object') {
          const clean = { ...message };
          // Remove any Symbol properties
          Object.getOwnPropertySymbols(message).forEach(sym => {
            delete clean[sym as any];
          });
          return JSON.stringify(clean);
        }
        return String(message);
      } catch (err) {
        return 'An error occurred';
      }
    })();

    addError(safeMessage, timeout);
  };

  return {
    showToast,
    clearToast: clearError
  };
};