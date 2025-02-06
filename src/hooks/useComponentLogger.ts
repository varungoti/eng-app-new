import { useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

export const useComponentLogger = (componentName: string) => {
  useEffect(() => {
    logger.info(componentName, 'Component mounted successfully');

    return () => {
      logger.info(componentName, 'Component unmounted');
    };
  }, [componentName]);

  const logError = useCallback((error: any) => {
    logger.error(componentName, 'Component did not load and error is caught', error);
  }, [componentName]);

  return { logError };
}; 