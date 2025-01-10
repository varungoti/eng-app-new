import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface WidgetProps {
  id: string;
  title: string;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
  children: React.ReactNode;
}

const Widget: React.FC<WidgetProps> = ({
  title,
  isLoading,
  error,
  className,
  children
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-lg overflow-hidden",
      className
    )}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">
            {error}
          </div>
        ) : children}
      </div>
    </div>
  );
};

export default Widget;