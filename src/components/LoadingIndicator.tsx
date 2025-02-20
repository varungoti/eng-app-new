'use client';

import React from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  fullHeight?: boolean;
}

export function LoadingIndicator({ 
  className,
  size = 24,
  fullHeight = false,
  ...props 
}: LoadingIndicatorProps): JSX.Element {
  return (
    <div 
      {...props} 
      className={cn(
        "flex items-center justify-center",
        fullHeight ? "min-h-screen" : "min-h-[200px]",
        className
      )}
    >
      <LoadingSpinner 
        size={size}
        iconClassName="text-primary"
      />
    </div>
  );
}

export default LoadingIndicator;