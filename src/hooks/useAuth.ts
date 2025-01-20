import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { QueryClient } from '@tanstack/query-core';
import { roleTransitionManager } from '../lib/auth/RoleTransitionManager';
import { useRoleStore } from '../lib/auth/store';
import { logger } from '../lib/logger';
import { ROLE_PERMISSIONS } from '../types/roles';
import { sessionManager } from '../lib/auth/sessionManager';
import type { UserRole } from '../types/roles';
//import { useQueryClient } from '@tanstack/react-query';

//const queryClient = new QueryClient();

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { isTransitioning } = useRoleStore();
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const location = useLocation();
  const { user, loading } = context;
  
  // Add loading state check
  useEffect(() => {
    if (loading) {
      logger.info('Auth loading state active', {
        source: 'useAuth'
      });
    }
  }, [loading]);

  // Auto-refresh session when it's about to expire
  useEffect(() => {
    if (!user) return;
    const refreshInterval = setInterval(async () => {
      try {
        await sessionManager.refreshSession();
      } catch (err) {
        logger.error('Failed to refresh session', {
          context: { error: err },
          source: 'useAuth'
        });
      }
    }, 4 * 60 * 1000); // Check every 4 minutes
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      logger.debug('Auth state check on route change', {
        context: {
          role: user.role,
          path: location.pathname,
          permissions: ROLE_PERMISSIONS[user.role]?.permissions
        },
        source: 'useAuth'
      });
    }
  }, [user, location.pathname]);
  const changeRole = async (newRole: UserRole): Promise<void> => {
    if (!context.user || isTransitioning) return;

    try {
      await roleTransitionManager.transitionRole(newRole);
      
      // Clear cache and refetch with new role
      queryClient.clear();
      await queryClient.resetQueries();
      
      // Update context user
      context.setUser({
        ...context.user,
        role: newRole
      });

      // Navigate to home with fresh data
      navigate('/', { replace: true });
    } catch (err) {
      logger.error('Failed to change role', {
        context: { error: err },
        source: 'useAuth'
      });
      throw err;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      context.setUser(data.user);
      return data;
    } catch (error) {
      logger.error('Login failed', {
        context: { error: error },
        source: 'useAuth'
      });
      throw error;
    }
  };

  return {
    ...context,
    changeRole,
    isTransitioning,
    login
  };
};