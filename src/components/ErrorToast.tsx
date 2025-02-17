import React, { useEffect } from 'react';
import { Toast } from './ui/toast';
import { useError } from '../hooks/useError';
import { AlertTriangle, XCircle, AlertCircle, Info } from 'lucide-react';
import { logger } from '../lib/logger';

interface ToastProps {
  timeout?: number;
  position?: 'top' | 'bottom';
  maxWidth?: string;
  title?: string | React.ReactNode;
}

type ErrorSeverity = 'error' | 'warning' | 'info' | 'fatal';

interface ErrorWithSeverity {
  message: string;
  severity: ErrorSeverity;
  source?: string;
  timestamp?: string;
}

const getToastVariant = (severity: ErrorSeverity) => {
  switch (severity) {
    case 'error':
      return 'destructive';
    case 'warning':
      return 'warning';
    case 'info':
      return 'default';
    case 'fatal':
      return 'destructive';
    default:
      return 'default';
  }
};

const getToastIcon = (severity: ErrorSeverity) => {
  switch (severity) {
    case 'error':
      return XCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    case 'fatal':
      return AlertCircle;
    default:
      return AlertTriangle;
  }
};

const isErrorWithSeverity = (error: unknown): error is ErrorWithSeverity => {
  return typeof error === 'object' && error !== null && 'severity' in error;
};

const ErrorToast: React.FC<ToastProps> = ({ 
  timeout = 5000, 
  position = 'top',
  maxWidth = '420px'
}) => {
  const { error, clearError } = useError();

  useEffect(() => {
    if (error) {
      const errorValue = error as string | ErrorWithSeverity | unknown;
      logger.info('Showing error toast', {
        source: 'ErrorToast',
        context: {
          error: typeof errorValue === 'string' 
            ? errorValue 
            : isErrorWithSeverity(errorValue) 
              ? errorValue.message 
              : String(errorValue),
          severity: isErrorWithSeverity(errorValue) 
            ? errorValue.severity 
            : 'error',
          timestamp: new Date().toISOString()
        }
      });

      const timer = setTimeout(() => {
        clearError();
        logger.info('Auto-clearing error toast', {
          source: 'ErrorToast',
          context: { timeout }
        });
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [error, clearError, timeout]);

  if (!error) return null;

  const errorObj: ErrorWithSeverity = typeof error === 'string' 
    ? { message: error, severity: 'error' }
    : error as ErrorWithSeverity;

  const Icon = getToastIcon(errorObj.severity);
  const variant = getToastVariant(errorObj.severity);

  return (
    <Toast
      title={
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{errorObj.source || 'Error'}</span>
        </div>
      }
      description={errorObj.message}
      variant={variant}
      onOpenChange={() => {
        clearError();
        logger.info('User dismissed error toast', {
          source: 'ErrorToast',
          context: { error: errorObj }
        });
      }}
      className={`max-w-[${maxWidth}]`}
      style={{ 
        top: position === 'top' ? '1rem' : 'auto',
        bottom: position === 'bottom' ? '1rem' : 'auto'
      }}
    />
  );
};

export default ErrorToast;
