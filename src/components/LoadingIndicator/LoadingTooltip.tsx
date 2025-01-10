import React from 'react';
import { Clock } from 'lucide-react';

interface LoadingTooltipProps {
  operation: string;
  duration: number;
  status?: 'pending' | 'success' | 'error';
}

export const LoadingTooltip: React.FC<LoadingTooltipProps> = ({
  operation,
  duration,
  status = 'pending'
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-[200px] z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Clock className={`h-4 w-4 mr-2 ${getStatusColor()}`} />
          <span className="text-sm font-medium text-gray-700">{operation}</span>
        </div>
        <span className={`text-sm ${getStatusColor()}`}>
          {duration.toFixed(0)}ms
        </span>
      </div>
    </div>
  );
};