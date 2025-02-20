import { QueryClient } from '@tanstack/react-query';
import { logger } from './logger';
import { DEBUG_CONFIG } from './config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
      refetchInterval: false, 
      enabled: true,
      networkMode: 'always',
      meta: {
        source: 'unknown'
      }
    },
    mutations: {
      onSuccess: (data: unknown, variables: unknown, context: unknown) => {
        if (DEBUG_CONFIG.enabled) {
          logger.debug('Query succeeded', 
            (context as { meta?: { source: string } })?.meta?.source || 'unknown'
          );
        }
      },
      onError: (error: Error, variables: unknown, context: unknown) => {
        logger.error(`Query error: ${error.message}`, 
          (context as { meta?: { source: string } })?.meta?.source || 'unknown'
        );
      }
    }
  }
});