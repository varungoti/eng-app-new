import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ContentErrorStateProps {
  error: Error | null;
  onRetry: () => void;
  className?: string;
}

const ContentErrorState: React.FC<ContentErrorStateProps> = ({ error, onRetry, className }) => {
  return (
    <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className || ''}`}>
      <div className="flex items-center">
        <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
        <h3 className="text-lg font-medium text-red-800">Error Loading Content</h3>
      </div>
      <p className="mt-2 text-sm text-red-600">
        {error?.message || 'An error occurred while loading content. Please try again.'}
      </p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </button>
    </div>
  );
};

export default ContentErrorState;