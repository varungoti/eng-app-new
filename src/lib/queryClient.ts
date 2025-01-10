import { QueryClient } from '@tanstack/react-query';
import { logger } from './logger';
import { DEBUG_CONFIG } from './config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
      refetchInterval: false, 
      enabled: true,
      suspense: false, 
      networkMode: 'always',
      meta: {
        source: 'unknown'
      },
      onSettled: (data, error, variables, context) => {
        if (error) {
          logger.error('Query failed', {
            context: { 
              error,
              queryKey: context?.queryKey,
              variables,
              attempt: context?.attempt
            },
            source: context?.meta?.source || 'unknown'
          });
        }
      },
      onSuccess: (data, variables, context) => {
        if (DEBUG_CONFIG.enabled) {
          logger.debug('Query succeeded', {
            context: { queryKey: context?.queryKey },
            source: context?.meta?.source || 'unknown'
          });
        }
      },
      onError: (error, variables, context) => {
        logger.error('Query error', {
          context: { 
            error,
            queryKey: context?.queryKey,
            variables
          },
          source: context?.meta?.source || 'unknown'
        });
      }
    },
    mutations: {
      retry: false,
      onError: (error, variables, context) => {
        logger.error('Mutation error', {
          context: { error },
          source: 'ReactQuery'
        });
      },
    }
  }
});