import React from 'react';
import { useErrorWatcher } from '../hooks/useErrorWatcher';
import { AlertTriangle, X, RefreshCcw } from 'lucide-react';

export const ErrorMonitor: React.FC = () => {
  const { errors, resolveError, clearErrors } = useErrorWatcher();

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto animate-slide-up">
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
                  className={`mt-2 text-sm border-l-2 pl-2 ${
                    error.resolved 
                      ? 'border-green-200 text-gray-400'
                      : 'border-red-200 text-gray-500'
                  }`}
                >
                  <p className={`font-medium ${
                    error.resolved ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {error.source}
                  </p>
                  <p>{error.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </p>
                  {!error.resolved && (
                    <button
                      onClick={() => resolveError(error.id)}
                      className="mt-1 text-xs text-indigo-600 hover:text-indigo-500 inline-flex items-center"
                    >
                      <RefreshCcw className="h-3 w-3 mr-1" />
                      Attempt Resolution
                    </button>
                  )}
                  {error.resolution && (
                    <p className="mt-1 text-xs text-gray-400">
                      Resolution: {error.resolution}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={clearErrors}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};