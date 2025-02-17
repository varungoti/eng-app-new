"use client";

import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { QueryClient } from '@tanstack/query-core';
import { roleTransitionManager } from '../lib/auth/RoleTransitionManager';
import { useRoleStore } from '../lib/auth/store';
import { logger } from '../lib/logger';
import { ROLE_PERMISSIONS } from '../types/roles';
import { sessionManager } from '../lib/auth/sessionManager';
import type { UserRole } from '../types/roles';
import { supabaseClient } from '../lib/supabaseClient';
import { supabase } from '../lib/supabase';
import { AuthLoader } from '../lib/auth/AuthLoader';
import type { AuthError } from '@supabase/supabase-js';
import { sessionMonitor } from '@/lib/auth/SessionMonitor';
import type { SessionState } from '@/lib/auth/sessionManager';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignUpCredentials extends LoginCredentials {
  name?: string;
}

interface ResetPasswordCredentials {
  email: string;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    console.warn('useAuth must be used within an AuthProvider');
    return { user: null, loading: false };
  }

  const { user, loading } = context;

  // Add debug logging
  console.log('Auth Context:', {
    hasUser: !!user,
    userRole: user?.role,
    userId: user?.id,
    isLoading: loading,
    fullUser: user // Log the full user object for debugging
  });

  const { isTransitioning } = useRoleStore();
  const navigate = useNavigate();
  const queryClient = new QueryClient();
  const location = useLocation();
  
  // Add loading state check
  useEffect(() => {
    if (loading) {
      logger.info('Auth loading state active', {
        source: 'useAuth',
        context: { loading }
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
          source: 'useAuth',
          context: { error: err }
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
        source: 'useAuth',
        context: {
          role: user.role,
          path: location.pathname,
          permissions: ROLE_PERMISSIONS[user.role]?.permissions
        }
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
        source: 'useAuth',
        context: { error: err }
      });
      throw err;
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('[Auth] Attempting login:', {
        email: credentials.email,
        timestamp: new Date().toISOString()
      });
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('[Auth] Supabase login error:', {
          message: error.message,
          status: error.status,
          name: error.name,
          timestamp: new Date().toISOString()
        });
        
        // Provide more specific error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        
        logger.error('Login failed', {
          context: { 
            error,
            credentials: { email: credentials.email }
          },
          source: 'useAuth'
        });
        throw new Error(error.message);
      }

      console.log('[Auth] Login response:', {
        hasUser: !!data.user,
        userId: data.user?.id,
        userEmail: data.user?.email,
        metadata: data.user?.user_metadata,
        timestamp: new Date().toISOString()
      });

      if (!data.user) {
        throw new Error('Login successful but user data is missing');
      }

      // Map Supabase user to our user format
      const mappedUser = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
        role: data.user.user_metadata?.role || 'student',
        photoUrl: data.user.user_metadata?.avatar_url,
      };

      console.log('[Auth] Mapped user:', mappedUser);

      context.setUser(mappedUser);
      return { user: mappedUser };
    } catch (error) {
      const errorDetails = error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error;

      console.error('[Auth] Login error details:', {
        error: errorDetails,
        timestamp: new Date().toISOString()
      });

      logger.error('Login failed', {
        context: { 
          error: errorDetails,
          credentials: { email: credentials.email }
        },
        source: 'useAuth'
      });

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      
      if (error) {
        throw error;
      }

      context.setUser(null);
      queryClient.clear();
      navigate('/login');
    } catch (error) {
      logger.error('Logout failed', {
        context: { error },
        source: 'useAuth'
      });
      throw error;
    }
  };

  const signUp = async (credentials: SignUpCredentials) => {
    try {
      console.log('[Auth] Attempting signup:', {
        email: credentials.email,
        timestamp: new Date().toISOString()
      });
      
      const { data, error } = await supabaseClient.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name || credentials.email.split('@')[0],
            role: 'student'
          }
        }
      });

      if (error) {
        console.error('[Auth] Supabase signup error:', {
          message: error.message,
          status: error.status,
          name: error.name,
          timestamp: new Date().toISOString()
        });
        
        logger.error('Signup failed', {
          context: { 
            error,
            credentials: { email: credentials.email }
          },
          source: 'useAuth'
        });
        throw new Error(error.message);
      }

      console.log('[Auth] Signup response:', {
        hasUser: !!data.user,
        userId: data.user?.id,
        userEmail: data.user?.email,
        metadata: data.user?.user_metadata,
        timestamp: new Date().toISOString()
      });

      if (!data.user) {
        throw new Error('Signup successful but user data is missing');
      }

      // Map Supabase user to our user format
      const mappedUser = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
        role: data.user.user_metadata?.role || 'student',
        photoUrl: data.user.user_metadata?.avatar_url,
      };

      console.log('[Auth] Mapped user:', mappedUser);

      context.setUser(mappedUser);
      return { user: mappedUser };
    } catch (error) {
      const errorDetails = error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error;

      console.error('[Auth] Signup error details:', {
        error: errorDetails,
        timestamp: new Date().toISOString()
      });

      logger.error('Signup failed', {
        context: { 
          error: errorDetails,
          credentials: { email: credentials.email }
        },
        source: 'useAuth'
      });

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred during signup. Please try again.');
      }
    }
  };

  const resetPassword = async (credentials: ResetPasswordCredentials) => {
    try {
      console.log('[Auth] Attempting password reset:', {
        email: credentials.email,
        timestamp: new Date().toISOString()
      });
      
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
        credentials.email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (error) {
        console.error('[Auth] Supabase password reset error:', {
          message: error.message,
          status: error.status,
          name: error.name,
          timestamp: new Date().toISOString()
        });
        
        logger.error('Password reset failed', {
          context: { 
            error,
            credentials: { email: credentials.email }
          },
          source: 'useAuth'
        });
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      const errorDetails = error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error;

      console.error('[Auth] Password reset error details:', {
        error: errorDetails,
        timestamp: new Date().toISOString()
      });

      logger.error('Password reset failed', {
        context: { 
          error: errorDetails,
          credentials: { email: credentials.email }
        },
        source: 'useAuth'
      });

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unexpected error occurred during password reset. Please try again.');
      }
    }
  };

  const [authState, setAuthState] = useState(sessionMonitor.getState());

  useEffect(() => {
    const unsubscribe = sessionMonitor.subscribeToStateUpdates(setAuthState);
    return () => unsubscribe();
  }, []);

  const checkAndRefreshSession = async (): Promise<void> => {
    try {
      await sessionManager.checkAndRefreshSession();
    } catch (error) {
      logger.error('Failed to check and refresh session', {
        context: { error },
        source: 'useAuth'
      });
    }
  };

  return {
    user: user ? {
      ...user,
      role: user.role || 'unknown'
    } : null,
    loading,
    changeRole,
    isTransitioning,
    login,
    logout,
    signUp,
    resetPassword,
    sessionManager
  };
}