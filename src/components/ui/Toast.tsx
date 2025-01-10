import React from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { logger } from '../../lib/logger';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'warning' | 'info';
  onClose: () => void;
  position?: 'top' | 'bottom';
  timeout?: number;
  onTimeout?: () => void;
}

const toastStyles = {
  error: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
} as const;

const toastIcons = {
  error: AlertTriangle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
} as const;

export const Toast = React.memo<ToastProps>(({ 
  message, 
  type = 'info', 
  onClose,
  position = 'top',
  timeout = 5000,
  onTimeout 
}) => {
  const Icon = toastIcons[type];
  const mounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (timeout > 0) {
      const timer = setTimeout(() => {
        if (mounted.current) {
          onClose();
          if (onTimeout) {
            onTimeout();
          }
        }
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [timeout, onClose, onTimeout]);

  const handleClose = React.useCallback(() => {
    try {
      onClose();
    } catch (err) {
      logger.error('Failed to close toast', {
        context: { error: err },
        source: 'Toast'
      });
    }
  }, [onClose]);

  return (
    <div 
      className={cn(
        'fixed right-4 z-50 animate-slide-up',
        position === 'top' ? 'top-4' : 'bottom-4'
      )}
      role="alert"
      aria-live="polite"
    >
      <div className={cn(
        'border rounded-lg shadow-lg p-4 max-w-md',
        toastStyles[type]
      )}>
        <div className="flex items-start">
          <Icon className="h-5 w-5 mr-3" />
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 inline-flex text-current opacity-70 hover:opacity-100 focus:outline-none"
            aria-label="Close message"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

Toast.displayName = 'Toast';