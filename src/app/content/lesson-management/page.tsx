import React from 'react';
import { LessonManagementLayout } from '@/components/content/lesson-management/LessonManagementLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function LessonManagementPage() {
  return (
    <ErrorBoundary source="LessonManagementPage">
      <LessonManagementLayout />
    </ErrorBoundary>
  );
} 