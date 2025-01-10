import React, { useEffect, useState } from 'react';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

interface LoadingSpinnerProps {
  message?: string;
  timeout?: number;
  showRetry?: boolean;
  onRetry?: () => void;
  source?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  timeout = 10000,
  showRetry = true,
  onRetry,
  source = 'LoadingSpinner'
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const { activeOperations, completedOperations } = usePerformanceMonitor(source);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  const handleRetry = () => {
    setShowTimeout(false);
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <div className="text-center space-y-4">
        {showTimeout ? (
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
        ) : (
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
        )}
        <p className="text-gray-600 font-medium">{message}</p>
        
        {/* Active Operations */}
        {activeOperations.length > 0 && (
          <div className="text-xs text-gray-500 space-y-2">
            <p className="font-medium mb-1">Loading:</p>
            {activeOperations.map((op) => (
              <div key={op.id} className="flex justify-between">
                <span>{op.operation}</span>
                <span>
                  {Math.floor(performance.now() - op.startTime)}ms
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Recently Completed Operations */}
        {completedOperations.length > 0 && (
          <div className="text-xs text-gray-500 space-y-2">
            <p className="font-medium mb-1">Completed:</p>
            {completedOperations.slice(0, 3).map((op) => (
              <div key={op.id} className="flex justify-between">
                <span>{op.operation}</span>
                <span className={op.status === 'success' ? 'text-green-500' : 'text-red-500'}>
                  {op.duration?.toFixed(0)}ms
                </span>
              </div>
            ))}
          </div>
        )}

        {showTimeout && showRetry && (
          <div className="text-sm text-gray-500">
            <p>This is taking longer than expected.</p>
            <button 
              onClick={handleRetry}
              className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};