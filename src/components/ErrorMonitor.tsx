import React from 'react';
import { useErrorTracker } from '../hooks/useErrorTracker';
import { AlertTriangle, X } from 'lucide-react';

const ErrorMonitor: React.FC = () => {
  const { errors, clearErrors } = useErrorTracker();

  if (errors.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto">
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
                  <p className="font-medium text-red-600">{error.source}</p>
                  <p>{error.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
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

export default ErrorMonitor;