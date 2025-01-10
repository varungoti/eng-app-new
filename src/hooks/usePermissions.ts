import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ROLE_PERMISSIONS } from '../types/roles';

export const usePermissions = () => {
  const { user } = useContext(AuthContext);

  const can = (permission: string) => {
    if (!user) return false;
    return true; // Temporarily allow all permissions
  };

  return { can };
};