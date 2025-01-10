import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { roleTransitionManager } from '../lib/auth/RoleTransitionManager';
import { useRoleStore } from '../lib/auth/store';
import { logger } from '../lib/logger';
import { ROLE_PERMISSIONS } from '../types/roles';
import { sessionManager } from '../lib/auth/sessionManager';
import type { UserRole } from '../types/roles';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { isTransitioning } = useRoleStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  React.useEffect(() => {
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

  return {
    ...context,
    changeRole,
    isTransitioning
  };
};