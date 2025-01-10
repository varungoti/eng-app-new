import React from 'react';
import { Loader2 } from 'lucide-react';
import LoadingProgress from '../LoadingProgress';

interface ContentLoadingStateProps {
  progress?: number;
}

const ContentLoadingState: React.FC<ContentLoadingStateProps> = ({ progress }) => {
  return (
    <>
      <LoadingProgress 
        isLoading={true} 
        progress={progress || 0}
        className="animate-fade-in"
      />
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4 animate-fade-up">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
          <div className="space-y-2">
            <p className="text-gray-700 font-medium">Loading content...</p>
            {typeof progress === 'number' && (
              <p className="text-sm text-gray-500 animate-pulse">
                {progress.toFixed(0)}% complete
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentLoadingState;