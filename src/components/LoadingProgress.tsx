import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';

interface LoadingProgressProps {
  isLoading: boolean;
  progress?: number;
  className?: string;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({
  isLoading,
  progress = 0,
  className
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      // Animate progress smoothly
      const interval = setInterval(() => {
        setDisplayProgress(prev => {
          if (prev >= 100) return 100;
          if (prev >= progress) return prev;
          return Math.min(prev + 1, progress);
        });
      }, 50);

      return () => clearInterval(interval);
    } else {
      setDisplayProgress(100);
    }
  }, [isLoading, progress]);

  if (!isLoading && displayProgress === 100) return null;

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 pointer-events-none", className)}>
      <div className="h-1 bg-gray-200">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-out rounded-r"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
      <div className="absolute right-4 top-2 text-xs font-medium text-gray-600 bg-white/90 px-2 py-1 rounded shadow-sm">
        {displayProgress.toFixed(0)}% loaded
      </div>
    </div>
  );
};

export default LoadingProgress;