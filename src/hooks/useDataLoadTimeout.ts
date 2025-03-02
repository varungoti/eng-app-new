import { useEffect, useRef, useCallback } from 'react';
import { logger } from '../lib/logger';

interface DataLoadTimeoutOptions {
  timeout?: number; 
  source: string;
  onTimeout?: () => void;
}

export const useDataLoadTimeout = ({
  timeout = 60000, // Increased from 30s to 60s
  source,
  onTimeout
}: DataLoadTimeoutOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const startTime = useRef(Date.now());
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  const clearLoadTimeout = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      logger.info('Data load completed successfully', {
        context: {
          loadTime: Date.now() - startTime.current
        },
        source
      });
    }
  }, [source]);

  useEffect(() => {
    // Set timeout for data load
    timeoutRef.current = setTimeout(() => {
      // Only trigger timeout if still loading
      if (startTime.current === 0) return;

      // Check if we should retry
      if (retryCount.current < MAX_RETRIES) {
        retryCount.current++;
        logger.info('Retrying data load', { source });
        startTime.current = Date.now(); // Reset timer
        timeoutRef.current = setTimeout(() => {
          if (onTimeout) {
            onTimeout();
          }
        }, timeout);
        return;
      }
      
      if (onTimeout) {
        onTimeout();
      }
    }, timeout);

    // Cleanup timeout
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };
  }, [timeout, source, onTimeout]);

  return { clearTimeout: clearLoadTimeout };
};