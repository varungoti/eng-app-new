import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ROLE_PERMISSIONS } from '../types/roles';

interface DashboardSwitcherProps {
  currentRole: string;
  onRoleChange: (role: string) => void;
}

const DashboardSwitcher: React.FC<DashboardSwitcherProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const { user } = useAuth();

  // Only super admin can switch roles
  if (!user || user.role !== 'super_admin') return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Super Admin Dashboard</h3>
          <p className="text-xs text-gray-500">View any role's dashboard</p>
        </div>
        <select
          value={currentRole}
          onChange={(e) => onRoleChange(e.target.value)}
          aria-label="Select dashboard role"
          className="ml-4 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {Object.entries(ROLE_PERMISSIONS).map(([role, details]) => (
            <option key={role} value={role}>
              {details.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DashboardSwitcher;