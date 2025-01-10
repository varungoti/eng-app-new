import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { logger } from './lib/logger';
import { ErrorProvider } from './contexts/ErrorContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import ErrorToast from './components/ErrorToast';
import { queryClient } from './lib/queryClient';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Import Dashboard page directly to avoid dynamic import issues
import DashboardPage from './pages/Dashboard';

// Lazy load pages with proper error boundaries
const Login = React.lazy(() => import('./pages/Login'));
const Students = React.lazy(() => import('./pages/Students'));
const Development = React.lazy(() => import('./pages/Development'));
const Infrastructure = React.lazy(() => import('./pages/Infrastructure'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Sales = React.lazy(() => import('./pages/Sales'));
const Content = React.lazy(() => import('./pages/Content'));
// Import Staff page with retry logic
const Staff = React.lazy(() => {
  return import('./pages/Staff').catch(err => {
    logger.error('Failed to load Staff page', { 
      context: { error: err }, 
      source: 'App' 
    }); 
    return Promise.resolve({
      default: () => (
        <ErrorBoundary source="Staff">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-lg font-medium text-red-800">Failed to load Staff page</h3>
            <p className="mt-2 text-sm text-red-600">Please try refreshing the page</p>
          </div>
        </ErrorBoundary>
      )
    });
  });
});
const Schedule = React.lazy(() => import('./pages/Schedule'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Events = React.lazy(() => import('./pages/Events'));
const ErrorTest = React.lazy(() => import('./pages/ErrorTest'));
const Schools = React.lazy(() => import('./pages/Schools'));
const Finance = React.lazy(() => import('./pages/Finance'));
const Analytics = React.lazy(() => import('./pages/Analytics'));

// Lazy load React Query DevTools
const ReactQueryDevtools = React.lazy(() => 
  import('@tanstack/react-query-devtools').then(mod => ({
    default: mod.ReactQueryDevtools
  }))
);

function App() {
  console.log('[App] Rendering...');
  logger.info('App initializing', { source: 'App' });

  return (
    <ErrorBoundary source="App">
      <AuthProvider>
        <ErrorProvider>
          <ThemeProvider>
            <Routes>
              <Route 
                path="/login" 
                element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading login..." />}>
                    <Login />
                  </React.Suspense>
                }
              />
              <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="analytics" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading analytics..." />}>
                    <Analytics />
                  </React.Suspense>
                } />
                <Route path="schools" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading schools..." />}>
                    <Schools />
                  </React.Suspense>
                } />
                <Route path="students" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading students..." />}>
                    <Students />
                  </React.Suspense>
                } />
                <Route path="sales" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading sales..." />}>
                    <Sales />
                  </React.Suspense>
                } />
                <Route path="content/*" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading content..." />}>
                    <Content />
                  </React.Suspense>
                } />
                <Route path="development" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading development..." />}>
                    <Development />
                  </React.Suspense>
                } />
                <Route path="infrastructure" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading infrastructure..." />}>
                    <Infrastructure />
                  </React.Suspense>
                } />
                <Route path="finance/*" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading finance..." />}>
                    <Finance />
                  </React.Suspense>
                } />
                <Route path="staff" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading staff..." />}>
                    <Staff />
                  </React.Suspense>
                } />
                <Route path="schedule" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading schedule..." />}>
                    <Schedule />
                  </React.Suspense>
                } />
                <Route path="reports" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading reports..." />}>
                    <Reports />
                  </React.Suspense>
                } />
                <Route path="events" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading events..." />}>
                    <Events />
                  </React.Suspense>
                } />
                <Route path="settings" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading settings..." />}>
                    <Settings />
                  </React.Suspense>
                } />
                <Route path="error-test" element={
                  <React.Suspense fallback={<LoadingSpinner message="Loading error test..." />}>
                    <ErrorTest />
                  </React.Suspense>
                } />
              </Route>
            </Routes>
            <ErrorToast />
            {process.env.NODE_ENV === 'development' && (
              <React.Suspense fallback={null}>
                <ReactQueryDevtools />
              </React.Suspense>
            )}
          </ThemeProvider>
        </ErrorProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;