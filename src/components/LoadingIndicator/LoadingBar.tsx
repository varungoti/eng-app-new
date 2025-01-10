import React, { useState } from 'react';
import { LoadingTooltip } from './LoadingTooltip';

interface LoadingBarProps {
  progress: number;
  operation: string;
  duration: number;
  status?: 'pending' | 'success' | 'error';
  showTooltip?: boolean;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  progress,
  operation,
  duration,
  status = 'pending',
  showTooltip = false
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {showTooltip && isHovered && (
        <LoadingTooltip 
          operation={operation}
          duration={duration}
          status={status}
        />
      )}
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 rounded-full ${
            status === 'error' ? 'bg-red-500' :
            status === 'success' ? 'bg-green-500' :
            'bg-indigo-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span>{operation}</span>
        <span>{duration.toFixed(0)}ms</span>
      </div>
    </div>
  );
};