import { useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

export const useComponentLogger = (componentName: string) => {
  useEffect(() => {
    logger.info('Component mounted successfully', { 
      context: { component: componentName } 
    });

    return () => {
      logger.info('Component unmounted', { 
        context: { component: componentName } 
      });
    };
  }, [componentName]);

  const logError = useCallback((error: any) => {
    logger.error('Component did not load and error is caught', { 
      context: { component: componentName, error } 
    });
  }, [componentName]);

  return { logError };
}; 