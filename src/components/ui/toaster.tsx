import React from 'react';
import { Toast } from './Toast';
import { logger } from '../../lib/logger';

export interface ToasterProps {
  position?: 'top' | 'bottom';
  timeout?: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'error' | 'success' | 'warning' | 'info';
}

export const Toaster: React.FC<ToasterProps> = ({
  position = 'top',
  timeout = 5000
}) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const mounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const removeToast = React.useCallback((id: string) => {
    try {
      if (mounted.current) {
        setToasts(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      logger.error('Failed to remove toast', {
        context: { error: err, toastId: id },
        source: 'Toaster'
      });
    }
  }, []);

  const addToast = React.useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    try {
      const id = crypto.randomUUID();
      if (mounted.current) {
        setToasts(prev => [...prev, { id, message, type }]);
      }
      return id;
    } catch (err) {
      logger.error('Failed to add toast', {
        context: { error: err, message, type },
        source: 'Toaster'
      });
      return null;
    }
  }, []);

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          position={position}
          timeout={timeout}
        />
      ))}
    </>
  );
};