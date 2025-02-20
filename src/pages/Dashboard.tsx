"use client";

import React, { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import DashboardSwitcher from '../components/DashboardSwitcher';
import RoleDashboard from '../components/RoleDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import { logger } from '../lib/logger';
import ErrorBoundary from '../components/ErrorBoundary';
import type { UserRole } from '@/types/roles';

// Lazy load dashboard components with preload
const dashboardComponents = {
  'super_admin': React.lazy(() => {
    logger.debug('Loading SuperAdminDashboard', { context: { component: 'SuperAdminDashboard' }, source: 'Dashboard' });
    return import('@/components/dashboards/SuperAdminDashboard');
  }),
  'admin': React.lazy(() => import('@/components/dashboards/AdminDashboard')),
  'teacher': React.lazy(() => import('@/components/dashboards/TeacherDashboard')),
  'teacher_head': React.lazy(() => import('@/components/dashboards/TeacherHeadDashboard')),
  'school_principal': React.lazy(() => import('@/components/dashboards/SchoolPrincipalDashboard')),
  'content_head': React.lazy(() => import('@/components/dashboards/ContentHeadDashboard')),
  'content_editor': React.lazy(() => import('@/components/dashboards/ContentEditorDashboard')),
  'technical_head': React.lazy(() => import('@/components/dashboards/TechnicalHeadDashboard')),
  'developer': React.lazy(() => import('@/components/dashboards/DeveloperDashboard')),
  'sales_executive': React.lazy(() => import('@/components/dashboards/SalesExecutiveDashboard')),
  'sales_head': React.lazy(() => import('@/components/dashboards/SalesHeadDashboard')),
  'school_leader': React.lazy(() => import('@/components/dashboards/SchoolLeaderDashboard')),
  'accounts_head': React.lazy(() => import('@/components/dashboards/AccountsDashboard')),
  'accounts_executive': React.lazy(() => import('@/components/dashboards/AccountsExecutiveDashboard'))
} as const;

// Memoized dashboard wrapper with error boundary
const DashboardWrapper = memo(({ Component }: { Component: React.LazyExoticComponent<any> }) => (
  <ErrorBoundary source="DashboardView">
    <React.Suspense 
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <LoadingSpinner message="Loading dashboard view..." />
        </div>
      }
    >
      <Component />
    </React.Suspense>
  </ErrorBoundary>
));

DashboardWrapper.displayName = 'DashboardWrapper';

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState<number>(0);

  // Memoized role update handler
  const handleRoleChange = useCallback((newRole: string) => {
    setSelectedRole(newRole);
    queryClient.clear();
    queryClient.invalidateQueries({ queryKey: ['dashboard-init'] });
    logger.info('Role updated', { context: { role: newRole }, source: 'Dashboard' });
  }, [queryClient]);

  // Debounced role update from location
  useEffect(() => {
    const newRole = location.state?.newRole;
    if (newRole && user && newRole !== user.role) {
      const timeoutId = setTimeout(() => {
        handleRoleChange(newRole);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [location.state?.newRole, user, handleRoleChange]);

  // Sync selected role with user role
  useEffect(() => {
    if (user?.role && !selectedRole) {
      setSelectedRole(user.role);
    }
  }, [user?.role, selectedRole]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner 
          message="Loading dashboard..." 
          showProgress={true}
          progress={loadProgress}
          timeout={15000}
          onRetry={() => {
            queryClient.invalidateQueries();
            window.location.reload();
          }}
        />
      </div>
    );
  }

  // Handle error state
  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">{loadError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline"
        >
          Try refreshing the page
        </button>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!user) {
    queryClient.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get current role
  const currentRole = selectedRole || user.role;
  if (!currentRole) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-600">No dashboard available.</p>
      </div>
    );
  }

  // Get dashboard component
  const DashboardComponent = dashboardComponents[currentRole as keyof typeof dashboardComponents];
  if (!DashboardComponent) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-600">No dashboard available for your role.</p>
      </div>
    );
  }

  return (
    <ErrorBoundary source="Dashboard">
      <div className="space-y-6 min-h-[calc(100vh-8rem)]">
        {user.role === 'super_admin' && (
          <DashboardSwitcher
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
          />
        )}
        
        <ErrorBoundary source="RoleDashboard">
          <RoleDashboard 
            selectedRole={currentRole}
            onError={(error: Error) => setLoadError(error.message)}
          />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default memo(Dashboard);