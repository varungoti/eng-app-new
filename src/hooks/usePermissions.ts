import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ROLE_PERMISSIONS } from '../types/roles';

type Permissions = {
  staff: boolean;
  // ... other permissions
};

export const usePermissions = () => {
  const { user } = useContext(AuthContext);

  const can = (permission: keyof Permissions) => {
    if (!user?.role) return false;
    return ROLE_PERMISSIONS[user.role]?.permissions[permission] || false;
  };

  return { can };
};

export interface IPermissions {
  analytics: boolean;
  query: boolean;
  // ... other permissions
}