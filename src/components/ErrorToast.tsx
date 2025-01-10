import React, { useEffect } from 'react';
import { Toast } from './ui/Toast';
import { useError } from '../hooks/useError';

interface ToastProps {
  timeout?: number; 
  position?: 'top' | 'bottom';
}

const ErrorToast: React.FC<ToastProps> = ({ timeout = 3000, position = 'top' }) => {
  const { error, clearError } = useError();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, timeout);
      return () => clearTimeout(timer);
    }
  }, [error, clearError, timeout]);

  if (!error) return null;

  return (
    <Toast
      message={error}
      type="error"
      onClose={clearError}
      position={position}
    />
  );
};

export default ErrorToast;