import { useSessionMonitoring } from '../hooks/useSessionMonitoring';
import { useEffect, useState } from 'react';
import { logger } from '../lib/logger';
import { sessionMonitor } from '../lib/auth/SessionMonitor';

export function SessionDebugger() {
  const { 
    isAuthenticated, 
    currentRole, 
    lastActivity,
    lastRefresh,
    refreshAttempts,
    lastOperation,
    sessionErrors,
    hasErrors 
  } = useSessionMonitoring();

  // Add debug action buttons
  const handleForceRefresh = async () => {
    try {
      const result = await sessionMonitor.refreshSession();
      logger.info(`Manual session refresh successful - Role: ${result?.user?.role || 'none'}`, 'SessionDebugger');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      logger.error(`Manual session refresh failed: ${errorMessage}`, 'SessionDebugger');
    }
  };

  useEffect(() => {
    if (hasErrors) {
      logger.error(`Session errors detected: ${sessionErrors.join(', ')}`, 'SessionDebugger');
    }
  }, [hasErrors, sessionErrors]);

  if (!import.meta.env.DEV) return null;
  const [isDebugVisible, setIsDebugVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === 'd') {
          setIsDebugVisible(prev => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return isDebugVisible ? (
      <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded-lg shadow-lg max-w-sm opacity-75 hover:opacity-100 transition-opacity z-50">
        <h3 className="font-bold mb-2">Session Debug</h3>
        <div className="space-y-1 text-sm">
          <p>Status: {isAuthenticated ? '🟢 Active' : '🔴 Inactive'}</p>
          <p>Role: {currentRole || 'None'}</p>
          <p>Last Activity: {lastActivity.toLocaleTimeString()}</p>
          {lastRefresh && (
            <p>Last Refresh: {lastRefresh.toLocaleTimeString()}</p>
          )}
          <p>Refresh Attempts: {refreshAttempts}</p>
          
          {lastOperation && (
            <div className="mt-2 p-2 bg-gray-700 rounded">
              <p className="font-bold">Last Operation:</p>
              <p>Type: {lastOperation.type}</p>
              <p>Time: {lastOperation.timestamp.toLocaleTimeString()}</p>
              <p>Status: {lastOperation.success ? '✅ Success' : '❌ Failed'}</p>
              {lastOperation.error && (
                <p className="text-red-400 break-words">Error: {lastOperation.error}</p>
              )}
            </div>
          )}

          {hasErrors && (
            <div className="mt-2">
              <p className="font-bold text-red-400">Errors:</p>
              <ul className="list-disc pl-4">
                {sessionErrors.map((error, i) => (
                  <li key={i} className="text-red-400 break-words">{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 space-x-2">
            <button
              onClick={handleForceRefresh}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Force Refresh
            </button>
          </div>
        </div>
      </div>
    ) : null;
} 