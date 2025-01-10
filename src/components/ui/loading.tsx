'use client';

import { Loader2 } from 'lucide-react'; 
import { cn } from '@/lib/utils';
import { useRef, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface LoadingProps {
  message?: string;
  className?: string;
  onTimeout?: () => void;
  timeout?: number;
}

export function Loading({ 
  message = 'Loading...', 
  className = '',
  onTimeout,
  timeout = 30000 // 30 second default timeout
}: LoadingProps) {
  const mounted = useRef(true);

  useEffect(() => {
    const timer = timeout > 0 ? setTimeout(() => {
      if (mounted.current && onTimeout) {
        logger.warn('Loading timeout reached', {
          context: { timeout },
          source: 'Loading'
        });
        onTimeout();
      }
    }, timeout) : null;

    return () => {
      mounted.current = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timeout, onTimeout]);
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8",
      className
    )}>
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p className="text-sm text-muted-foreground" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
} 