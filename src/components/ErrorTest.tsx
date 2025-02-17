import React, { useState } from 'react';
import { ErrorWatcher } from '../lib/errorWatcher';
import { ErrorMonitor } from '../lib/errorWatcher/components/ErrorMonitor';
import { ErrorBoundary } from '../lib/errorWatcher/components/ErrorBoundary';
import { logger } from '../lib/logger';
import { DEBUG_CONFIG } from '../lib/config';

// Component that throws an error
const BuggyComponent: React.FC = () => {
  logger.warn('BuggyComponent will throw a test error', 'ErrorTest');
  throw new Error('This is a simulated component error');
};

const ErrorTest: React.FC = () => {
  const [showBuggy, setShowBuggy] = useState(false);
  const errorWatcher = ErrorWatcher.getInstance();

  const simulateNetworkError = () => {
    errorWatcher.trackError({
      message: 'Failed to fetch data from API',
      severity: 'warning', // Changed to warning since this is a test
      source: 'NetworkRequest',
      context: {
        endpoint: '/api/data',
        statusCode: 500
      }
    });
  };

  const simulateFatalError = () => {
    errorWatcher.trackError({
      message: 'Application encountered a fatal error',
      severity: 'fatal',
      source: 'AppCore',
      context: {
        reason: 'Critical system failure'
      }
    });
  };

  const simulateWarning = () => {
    errorWatcher.trackError({
      message: 'Performance degradation detected',
      severity: 'info', // Changed to info since this is a test
      source: 'PerformanceMonitor',
      context: {
        metric: 'response_time',
        value: '2500ms'
      }
    });
  };

  const simulateAuthError = () => {
    errorWatcher.trackError({
      message: 'Authentication token expired',
      severity: 'error',
      source: 'AuthService',
      context: {
        reason: 'Token expired'
      }
    });
  };

  return (
    <ErrorBoundary source="ErrorTest">
      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Error Watcher Test</h1>
          {DEBUG_CONFIG.enabled && (
            <div className="text-sm text-gray-500">
              Debug Mode: {DEBUG_CONFIG.level}
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Test Controls */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Error Scenarios</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={simulateNetworkError}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Simulate Network Error
              </button>

              <button
                onClick={simulateFatalError}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              >
                Simulate Fatal Error
              </button>

              <button
                onClick={simulateWarning}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                Simulate Warning
              </button>

              <button
                onClick={simulateAuthError}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Simulate Auth Error
              </button>

              <button
                onClick={() => setShowBuggy(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Trigger Component Error
              </button>
            </div>
          </div>

          {/* Component Error Test */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Component Error Boundary Test</h2>
            <ErrorBoundary source="BuggyComponent">
              {showBuggy && <BuggyComponent />}
            </ErrorBoundary>
          </div>
        </div>

        {/* Error Monitor */}
        <ErrorMonitor />
      </div>
    </ErrorBoundary>
  );
};

export default ErrorTest;