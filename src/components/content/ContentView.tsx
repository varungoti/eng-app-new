import React from 'react';
import { ContentViewNew } from './ContentViewNew';
import ErrorBoundary from '@/components/ErrorBoundary';

interface ContentViewProps {
  mode?: 'view' | 'edit';
}

const ContentView: React.FC<ContentViewProps> = ({ mode = 'view' }) => {
  return (
    <ErrorBoundary source="ContentView">
      <ContentViewNew mode={mode} />
    </ErrorBoundary>
  );
};

export { ContentView };