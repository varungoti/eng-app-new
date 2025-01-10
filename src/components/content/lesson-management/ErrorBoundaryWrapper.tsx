import React from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { logger } from '@/lib/logger';
import { useToast } from '@/hooks/useToast';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  name: string;
  onError?: (error: Error) => void;
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ 
  children, 
  name,
  onError 
}) => {
  const { showToast } = useToast();

  React.useEffect(() => {
    logger.debug(`${name} mounted`, {
      source: name
    });
    return () => {
      logger.debug(`${name} unmounted`, {
        source: name
      });
    };
  }, [name]);

  return (
    <ErrorBoundary 
      source={name}
      onError={(error) => {
        logger.error(`Error in ${name}`, {
          context: { error },
          source: name
        });
        showToast(`Error in ${name}: ${error.message}`, { type: 'error' });
        if (onError) {
          onError(error);
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;