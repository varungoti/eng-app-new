import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import DashboardSwitcher from '../components/DashboardSwitcher';
import RoleDashboard from '../components/RoleDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import { logger } from '../lib/logger';
import ErrorBoundary from '../components/ErrorBoundary';

const Dashboard: React.FC = () => {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);

  React.useEffect(() => {
    const newRole = location.state?.newRole;
    if (newRole && user && newRole !== user.role) {
      logger.info('Updating dashboard for new role', {
        context: { role: newRole },
        source: 'Dashboard'
      });

      setSelectedRole(newRole);
      queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ['dashboard-init'] });
    }
  }, [location.state?.newRole, user, queryClient]);

  React.useEffect(() => {
    if (user?.role && !selectedRole) {
      setSelectedRole(user.role);
    }
  }, [user?.role]);

  // Handle loading state with progress
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
  if (error || loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">{error || loadError}</p>
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
    // Clear cache before redirecting
    queryClient.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <ErrorBoundary source="Dashboard">
      <div className="space-y-6 min-h-[calc(100vh-8rem)]">
        {/* Only show role switcher for super admin */}
        {user.role === 'super_admin' && (
          <DashboardSwitcher
            currentRole={selectedRole || user.role}
            onRoleChange={setSelectedRole}
          />
        )}
        
        {/* Wrap dashboard in error boundary */}
        <ErrorBoundary source="RoleDashboard">
          <RoleDashboard 
            selectedRole={selectedRole || user.role} 
            onError={(err) => setLoadError(err.message)}
          />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;