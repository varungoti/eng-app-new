import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import { canAccessDashboard } from '../lib/permissions';
import { useRoleSettings } from '../hooks/useRoleSettings';
//import { APP_ICONS } from '../lib/constants/icons';
import { QueryClient } from '@tanstack/react-query';
//import type { RoleSettings } from '../hooks/useRoleSettings';
import LoadingSpinner from './LoadingSpinner';
import {
  SuperAdminDashboard, AdminDashboard, TechnicalHeadDashboard,
  DeveloperDashboard, SalesHeadDashboard, SalesExecutiveDashboard,
  ContentHeadDashboard, ContentEditorDashboard, AccountsDashboard, AccountsExecutiveDashboard,
  SchoolLeaderDashboard, SchoolPrincipalDashboard, TeacherHeadDashboard,
  TeacherDashboard
} from './dashboards';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface RoleDashboardProps {
  selectedRole: string;
  onError?: (error: Error) => void;
}

const RoleDashboard: React.FC<RoleDashboardProps> = ({ selectedRole, onError }) => {
  const { settings, loading, error } = useRoleSettings(selectedRole);
  const queryClient = new QueryClient();
  const { user } = useAuth();
  const { can } = usePermissions();

  // Handle session timeout
  useEffect(() => {
    if (error?.toLowerCase().includes('unauthorized')) {
      queryClient.clear();
      window.location.href = '/login';
    }
  }, [error, queryClient]);

  // Check access permissions first
  if (!user || !canAccessDashboard(user.role, selectedRole)) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
        <p className="mt-2 text-sm text-red-600">
          You do not have permission to view this dashboard.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <LoadingSpinner 
        message={`Loading ${selectedRole} dashboard...`}
        timeout={15000}
        showRetry={true}
        showProgress={true}
        onRetry={() => {
          queryClient.invalidateQueries({ queryKey: ['role_settings'] });
          window.location.reload();
        }}
      />
    );
  }

  if (error) {
    if (onError) {
      onError(new Error(error));
    }
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
          <h3 className="text-lg font-medium text-red-800">Error</h3>
        </div>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ['role_settings'] });
            window.location.reload();
          }}
          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800">No Dashboard Settings</h3>
        <p className="mt-2 text-sm text-yellow-600">
          {`No dashboard settings found for role: ${selectedRole || user?.role || 'unknown'}`}
        </p>
        <div className="mt-4">
          <p className="text-sm text-yellow-700">Available test credentials:</p>
          <ul className="mt-2 space-y-1 text-sm text-yellow-600">
            <li>Email: admin@example.com</li>
            <li>Password: admin123</li>
            <li>Select any role from the dropdown to test different dashboards</li>
          </ul>
        </div>
      </div>
    );
  }

  switch (selectedRole) {
    case 'super_admin': return <SuperAdminDashboard settings={settings} />;
    case 'admin': return <AdminDashboard settings={settings} />;
    case 'technical_head': return <TechnicalHeadDashboard settings={settings} />;
    case 'developer': return <DeveloperDashboard settings={settings} />;
    case 'sales_head': return <SalesHeadDashboard settings={settings} />;
    case 'sales_executive': return <SalesExecutiveDashboard settings={settings} />;
    case 'content_head': return <ContentHeadDashboard settings={settings} />;
    case 'content_editor': return <ContentEditorDashboard settings={settings} />;
    case 'accounts_head': return <AccountsDashboard settings={settings} />;
    case 'accounts_executive': return <AccountsExecutiveDashboard settings={settings} />;
    case 'school_leader': return <SchoolLeaderDashboard settings={settings} />;
    case 'school_principal': return <SchoolPrincipalDashboard settings={settings} />;
    case 'teacher_head': return <TeacherHeadDashboard settings={settings} />;
    case 'teacher': return <TeacherDashboard settings={settings} />;
    default:
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800">Unknown Role</h3>
          <p className="mt-2 text-sm text-yellow-600">
            No dashboard available for role: {selectedRole}
          </p>
        </div>
      );
  }
};

export default RoleDashboard;