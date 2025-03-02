import { useState, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (promise: Promise<T>, source: string) => {
    setState({ data: null, loading: true, error: null });

    try {
      const data = await promise;
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      logger.error(errorMessage, { context: { error }, source });
      setState({ data: null, loading: false, error: error as Error });
      throw error;
    }
  }, []);

  return { ...state, execute };
}