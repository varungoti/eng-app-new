import React, { useEffect, useState, useRef } from 'react';
import { Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { logger } from '../lib/logger';

interface LoadingSpinnerProps {
  message?: string;
  timeout?: number;
  showRetry?: boolean;
  showProgress?: boolean;
  progress?: number;
  onRetry?: () => void;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  timeout = 10000,
  showRetry = true,
  showProgress = false,
  progress,
  onRetry
}) => {
  const [showTimeout, setShowTimeout] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [internalProgress, setInternalProgress] = useState(0);
  const MAX_RETRIES = 2;
  const RETRY_DELAY = 2000;
  const progressInterval = useRef<number>();
  const timeoutRef = useRef<number>();
  const startTime = useRef(Date.now());
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Reset progress when loading starts
    if (isLoading) {
      setInternalProgress(0);
      startTime.current = Date.now();
    }

    timeoutRef.current = window.setTimeout(() => {
      if (isLoading && mounted.current) {
        logger.warn('Loading timeout reached', {
          context: { message, timeout },
          source: 'LoadingSpinner'
        });
        setShowTimeout(true);
      }
    }, timeout);

    // Progress animation
    if (showProgress) {
      progressInterval.current = window.setInterval(() => {
        if (mounted.current) {
          setInternalProgress(prev => {
            // Calculate progress based on elapsed time
            const elapsed = Date.now() - startTime.current;
            const timeProgress = Math.min((elapsed / timeout) * 100, 95);
            return Math.max(prev, Math.floor(timeProgress));
          });
        }
      }, 100); // Update every 100ms
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [timeout, isLoading, showProgress, message]);

  const handleRetry = () => {
    if (retryCount >= MAX_RETRIES) {
      logger.warn('Maximum retries reached', {
        context: { retryCount },
        source: 'LoadingSpinner'
      });
      window.location.reload();
      return;
    }

    setShowTimeout(false);
    setIsLoading(true);
    setRetryCount(prev => prev + 1);
    setInternalProgress(0);
    startTime.current = Date.now();

    logger.info('Retrying load', {
      context: { 
        retryCount: retryCount + 1,
        maxRetries: MAX_RETRIES
      },
      source: 'LoadingSpinner'
    });

    if (onRetry) {
      onRetry();
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center space-y-4">
        {showTimeout && !isLoading ? (
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto" />
        ) : (
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
        )}
        <p className="text-gray-600 font-medium">{message}</p>
        
        {showProgress && (
          <div className="w-64 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress ?? internalProgress}%` }}
            />
          </div>
        )}
        
        {showTimeout && !isLoading && showRetry && (
          <div className="text-sm text-gray-500">
            <p>This is taking longer than expected.</p>
            {retryCount >= MAX_RETRIES ? (
              <p className="text-red-600">Maximum retries reached. Please refresh the page.</p>
            ) : (
              <button 
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again ({MAX_RETRIES - retryCount} attempts remaining)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;