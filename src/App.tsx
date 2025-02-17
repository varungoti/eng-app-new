"use client";

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient  } from '@tanstack/query-core';
import { AuthProvider } from './contexts/AuthContext';
import { logger } from './lib/logger';
import { ErrorProvider } from './contexts/ErrorContext';
import { ThemeProvider as NextThemesProvider } from "next-themes";
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import ErrorToast from './components/ErrorToast';
//import { queryClient } from '@/providers/query-provider';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ThemeSelector from './components/ThemeSelector';
import ContentManagementPage from './app/content-management/page' ;
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { themes } from "@/lib/themes"
import { ThemeContextProvider } from './contexts/ThemeContext';
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/components/ui/toast";
import { BrowserRouter } from 'react-router-dom';

// Import Dashboard page directly to avoid dynamic import issues
import DashboardPage from './pages/Dashboard';
import MyClassesPage from './app/teacher/lessons/page';

// Lazy load pages with proper error boundaries
const Login = React.lazy(() => import('./pages/Login'));
const Students = React.lazy(() => import('./pages/Students'));
const Development = React.lazy(() => import('./pages/Development'));
const Infrastructure = React.lazy(() => import('./pages/Infrastructure'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Sales = React.lazy(() => import('./pages/Sales'));
const Content = React.lazy(() => import('./pages/Content'));
const LearningManagement = React.lazy(() => import('./app/learning/page'));

// Import Staff page with retry logic
const Staff = React.lazy(() => {
  return import('./pages/Staff').catch(err => {
    logger.error('Failed to load Staff page', err);
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
const MyClasses = React.lazy(() => import('./app/teacher/lessons/page'));

import TeacherLayout from './app/teacher/layout';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherDashboard from './app/teacher/dashboard/page';
import Classes from './app/teacher/lessons/page';
import AIConversationPage from './app/teacher/ai-conversation/page';
//import CourseDetails from '/src/app/teacher/courses/page'; //';

// Import the TeacherMyClassPage component
const TeacherMyClassPage = React.lazy(() => import('./app/teacher/my-class/page'));

import { ResetPassword } from "@/components/auth/ResetPassword";
import { SessionDebugger } from './components/SessionDebugger';

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

function App() {
  const { theme, resolvedTheme } = useTheme()
  const currentTheme = themes[theme as keyof typeof themes] || themes[resolvedTheme as keyof typeof themes] || themes.light

  console.log('[App] Rendering...');
  logger.info('App initializing', 'App');

  return (
    <ErrorBoundary source="App">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ErrorProvider>
            <NextThemesProvider
              attribute="class"
              defaultTheme="light"
              value={{
                light: "light",
                dark: "dark",
                gray: "gray",
                contrast: "contrast"
              }}
            >
              <ThemeContextProvider>
                <ToastProvider>
                <div className={`relative min-h-screen w-full ${currentTheme.background} ${currentTheme.text}`}>
                  <ThemeToggle />
                  <div className={`w-full ${currentTheme.background} ${currentTheme.text}`}>
                    <Routes>
                      <Route 
                        path="/login" 
                        element={
                          <React.Suspense fallback={<LoadingSpinner message="Loading login..." />}>
                            <div className={currentTheme.background}>
                              <Login />
                            </div>
                          </React.Suspense>
                        }
                      />
                      <Route element={
                        <div className={currentTheme.background}>
                          <PrivateRoute>
                            <Layout />
                          </PrivateRoute>
                        </div>
                      }>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route 
                          path="app/learning/*" 
                          element={
                            <React.Suspense fallback={<LoadingSpinner message="Loading learning management..." />}>
                              <LearningManagement />
                            </React.Suspense>
                          } 
                        />
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
                        <Route 
                          path="content-management" 
                          element={
                            <React.Suspense fallback={<LoadingSpinner message="Loading content management..." />}>
                              <ContentManagementPage />
                            </React.Suspense>
                          } 
                        />
                        <Route
                          path="my-classes" 
                          element={
                            <React.Suspense fallback={<LoadingSpinner message="Loading My Classes..." />}>
                              <MyClasses/>
                            </React.Suspense>
                          } 
                        />
                      </Route>
                      <Route 
                        path="/teacher/*" 
                        element={
                          <TeacherLayout>
                            <Routes>
                              <Route path="/" element={<Navigate to="dashboard" replace />} />
                              <Route path="dashboard" element={<TeacherDashboard />} />
                              <Route path="classes" element={<Classes />} />
                              <Route path="lessons" element={<Classes />} />
                              <Route path="my-class" element={
                                <React.Suspense fallback={<LoadingSpinner message="Loading My Class..." />}>
                                  <TeacherMyClassPage />
                                </React.Suspense>
                              } />
                              <Route path="AI-Conversation" element={<AIConversationPage />} />
                            </Routes>
                          </TeacherLayout>
                        } 
                      />
                      <Route 
                        path="/reset-password/*" 
                        element={<ResetPassword />} 
                      />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                    <ErrorToast />
                    {process.env.NODE_ENV === 'development' && (
                      <React.Suspense fallback={null}>
                        <ReactQueryDevtools initialIsOpen={false} />
                      </React.Suspense>
                    )}
                  </div>
                </div>
                <Toaster />
                {import.meta.env.DEV && <SessionDebugger />}
              </ToastProvider>
            </ThemeContextProvider>
            </NextThemesProvider>
          </ErrorProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
export default App;
