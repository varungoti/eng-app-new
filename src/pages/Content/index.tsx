import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { CONTENT_ROUTES } from '@/lib/content/routes';
import { ContentView } from '@/components/content/ContentView';
import { lazy } from 'react';
import { logger } from '@/lib/logger';

const LessonManagement = lazy(async() => {
  return import('@/components/content/lesson-management/page')
    .then(module => {
      logger.debug('LessonManagement loaded successfully', {
        source: 'Content'
      });
      return { default: module.default };
    })
    .catch(error => {
      logger.error('Failed to load LessonManagement', {
        context: { error },
        source: 'Content'
      });
      throw error;
    });
});

const Content: React.FC = () => {
  const { user } = useAuth();
  const canAccessLessonManagement = user && (
    ['super_admin', 'admin', 'content_head', 'content_editor'].includes(user.role)
  );

  return (
    <ErrorBoundary source="Content">
      <Routes>
        <Route 
          path={CONTENT_ROUTES.VIEW} 
          element={
            <ErrorBoundary source="ContentView">
              <React.Suspense fallback={<LoadingSpinner message="Loading content view..." />}>
                <ContentView mode="view" />
              </React.Suspense>
            </ErrorBoundary>
          }
        />
        <Route 
          path={CONTENT_ROUTES.EDIT} 
          element={
            <ErrorBoundary source="ContentEditor">
              <React.Suspense fallback={<LoadingSpinner message="Loading content editor..." />}>
                <ContentView mode="edit" />
              </React.Suspense>
            </ErrorBoundary>
          }
        />
        {canAccessLessonManagement && (
          <Route 
            path={CONTENT_ROUTES.LESSON_MANAGEMENT} 
            element={
              <ErrorBoundary source="LessonManagement">
                <LessonManagement />
              </ErrorBoundary>
            }
          />
        )}
        <Route index element={<Navigate to={CONTENT_ROUTES.VIEW} replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default Content;