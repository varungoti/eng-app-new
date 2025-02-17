import { useState, useEffect } from 'react';
import { sessionMonitor } from '../lib/auth/SessionMonitor';
import { logger } from '../lib/logger';

export function useSessionMonitoring() {
  const [sessionState, setSessionState] = useState(sessionMonitor.getState());
  const [sessionErrors, setSessionErrors] = useState<string[]>([]);

  useEffect(() => {
    // Subscribe to session state changes
    const unsubscribe = sessionMonitor.addListener((state) => {
      setSessionState(state);
      setSessionErrors(sessionMonitor.getSessionErrors());

      // Enhanced logging
      if (import.meta.env.DEV) {
        logger.debug(
          `Session state updated - Auth: ${state.isAuthenticated}, ` +
          `Role: ${state.currentRole || 'none'}, ` +
          `Last refresh: ${state.lastRefresh?.toLocaleTimeString() || 'never'}, ` +
          `Attempts: ${state.refreshAttempts}`,
          'useSessionMonitoring'
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    ...sessionState,
    sessionErrors,
    hasErrors: sessionErrors.length > 0
  };
} 