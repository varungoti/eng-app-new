import React from 'react';
import { useContentQuery } from '@/hooks/content/useContentQuery';
import { useContentMutation } from '@/hooks/content/useContentMutation';
import { useToast } from '@/hooks/useToast';
import ContentLoadingState from '../ContentLoadingState';
import ContentErrorState from '../ContentErrorState';
import { logger } from '@/lib/logger';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';

interface ViewContentProps {
  lessonId: string;
}

export const ViewContent: React.FC<ViewContentProps> = ({ lessonId }) => {
  const { data, loading, error, refresh } = useContentQuery(lessonId);
  const { updateContent } = useContentMutation();
  const { showToast } = useToast();

  const handleRetry = async () => {
    try {
      await refresh();
      showToast('Content refreshed successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh content';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err, lessonId },
        source: 'ViewContent'
      });
    }
  };

  if (loading) {
    return <ContentLoadingState />;
  }

  if (error) {
    return <ContentErrorState error={error} onRetry={handleRetry} />;
  }

  return (
    <ErrorBoundaryWrapper name="ViewContent">
      <div className="space-y-6">
        {/* Content view implementation */}
        <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </ErrorBoundaryWrapper>
  );
};