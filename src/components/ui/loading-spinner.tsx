'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './icons';

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  containerClassName?: string;
  iconClassName?: string;
}

export function LoadingSpinner({ 
  className,
  containerClassName,
  iconClassName,
  size = 24,
  ...props 
}: LoadingSpinnerProps): JSX.Element {
  return (
    <div 
      {...props} 
      className={cn(
        "flex items-center justify-center",
        containerClassName,
        className
      )}
    >
      <Icon
        type="phosphor"
        name="SPINNER"
        className={cn(
          "animate-spin text-muted-foreground",
          iconClassName
        )}
        size={size}
      />
    </div>
  );
} 