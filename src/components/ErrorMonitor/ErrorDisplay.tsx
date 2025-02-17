import React from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import { useErrorMonitor } from '../../hooks/useErrorMonitor';
import { formatDistanceToNow } from '../../lib/utils/format';

export const ErrorDisplay: React.FC = () => {
  const { errors, retryOperation, clearError } = useErrorMonitor();

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {errors.length} Error{errors.length > 1 ? 's' : ''} Detected
            </p>
            <div className="mt-1 max-h-60 overflow-y-auto">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className="mt-2 text-sm text-gray-500 border-l-2 border-red-200 pl-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-red-600">{error.source}</p>
                      <p>{error.error.message}</p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(error.timestamp))} ago
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => retryOperation(error.id)}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                        title="Retry operation"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => clearError(error.id)}
                        className="text-sm text-gray-400 hover:text-gray-500"
                        title="Dismiss"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {error.context && (
                    <div className="mt-1 text-xs text-gray-400">
                      {Object.entries(error.context).map(([key, value]) => (
                        <div key={key}>{key}: {String(value)}</div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};