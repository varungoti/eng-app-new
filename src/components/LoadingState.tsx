import React from 'react';
import { Icons } from 'lucide-react';
import { APP_ICONS } from '@/lib/constants/icons';
import { logger } from '../lib/logger';

interface LoadingStateProps {
  message?: string;
  source: string;
  timeout?: number;
  onTimeout?: () => void;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  source,
  timeout = 10000,
  onTimeout
}) => {
  const [showTimeout, setShowTimeout] = React.useState(false);
  const timeoutRef = React.useRef<number | undefined>(undefined);
  const mounted = React.useRef<boolean>(true);

  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    timeoutRef.current = window.setTimeout(() => {
      if (mounted.current) {
        setShowTimeout(true);
        logger.warn('Loading timeout reached', {
          context: { message, timeout },
          source
        });
        if (onTimeout) {
          onTimeout();
        }
      }
    }, timeout);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [timeout, message, source, onTimeout]);

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center space-y-4">
        {React.createElement(Icons[APP_ICONS.LOADER], {
          className: "h-12 w-12 text-indigo-600 animate-spin mx-auto"
        })}
        <p className="text-gray-600 font-medium">{message}</p>
        {showTimeout && (
          <p className="text-sm text-gray-500">
            This is taking longer than expected...
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingState;