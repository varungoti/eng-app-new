"use client";

import { useContext, useEffect, useState } from 'react';
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
  // import { supabase } from '../lib/supabase';
  // import { AuthLoader } from '../lib/auth/AuthLoader';
  // import type { AuthError } from '@supabase/supabase-js';
import { sessionMonitor } from '@/lib/auth/SessionMonitor';
//import type { SessionState } from '@/lib/auth/sessionManager';
import type { User } from '../types';

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
  // 1. CONTEXT AND STATE - All state declarations first
  const context = useContext(AuthContext);
  const { isTransitioning } = useRoleStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [_authState, setAuthState] = useState(sessionMonitor.getState());
  const queryClient = new QueryClient();
  
  // 2. Compute derived state - These must come before hooks that depend on them
  const user = context?.user;
  const loading = context?.loading || false;
  //const _isAuthenticated = !!user;

  // 3. ALL EFFECTS - Always called, regardless of context
  // Session monitor subscription
  useEffect(() => {
    const unsubscribe = sessionMonitor.subscribeToStateUpdates(setAuthState);
    return () => unsubscribe();
  }, []);

  // Auth state monitoring
  useEffect(() => {
    // Only execute the inner logic if we have context
    if (!context) return;
    
    if (loading) {
      logger.info('Auth loading state active', { 
        source: 'useAuth', 
        context: { loading } 
      });
    }
    
    if (user && !loading && !isTransitioning) {
      logger.debug('Auth state check on route change', {
        source: 'useAuth',
        context: { 
          role: user.role, 
          path: location.pathname,
          permissions: ROLE_PERMISSIONS[user.role]?.permissions 
        }
      });
      
      logger.info('Auth Context:', { 
        context: {
          hasUser: !!user,
          userRole: user.role
        }
      });
    }
  }, [context, user, loading, isTransitioning, location.pathname]);

  // Session refresh effect
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
    }, 4 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [user]);

  // 4. CONDITIONAL RETURN - Only after all hooks are defined
  if (!context) {
    logger.warn('useAuth must be used within an AuthProvider');
    return { user: null, loading: false };
  }

  // 5. REGULAR FUNCTIONS - These don't contain hooks
  const changeRole = async (newRole: UserRole): Promise<void> => {
    if (!user || isTransitioning) return;
    
    try {
      await roleTransitionManager.transitionRole(newRole);
      
      // Clear cache and refetch with new role
      queryClient.clear();
      await queryClient.resetQueries();
      
      // Update context user with explicit type assertion to fix the error
      context.setUser({
        ...user,
        role: newRole,
        id: user.id || '', // Ensure id is not undefined
      } as User & { role: UserRole }); // Using proper type instead of any

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
      logger.info('[Auth] Attempting login:', { 
        context: {
          email: credentials.email,
          timestamp: new Date().toISOString()
        }
      });
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        logger.error('[Auth] Supabase login error:', { 
          context: {
            message: error.message,
            status: error.status
          },
          error
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

      logger.info('[Auth] Login response:', { 
        context: {
          hasUser: !!data.user,
          userId: data.user?.id
        }
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

      logger.info('[Auth] Mapped user:', { context: mappedUser });

      context.setUser(mappedUser);
      return { user: mappedUser };
    } catch (error) {
      const errorDetails = error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error;

      logger.error('[Auth] Login error details:', { 
        context: {
          timestamp: new Date().toISOString()
        },
        error: errorDetails
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
      logger.info('[Auth] Attempting signup:', { 
        context: {
          email: credentials.email,
          timestamp: new Date().toISOString()
        }
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
        logger.error('[Auth] Supabase signup error:', { 
          context: {
            message: error.message,
            status: error.status
          },
          error
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

      logger.info('[Auth] Signup response:', { 
        context: {
          hasUser: !!data.user,
          userId: data.user?.id
        }
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

      logger.info('[Auth] Mapped user:', { context: mappedUser });

      context.setUser(mappedUser);
      return { user: mappedUser };
    } catch (error) {
      const errorDetails = error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : error;

      logger.error('[Auth] Signup error details:', { 
        context: {
          timestamp: new Date().toISOString()
        },
        error: errorDetails
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
      logger.info('[Auth] Attempting password reset:', { 
        context: {
          email: credentials.email,
          timestamp: new Date().toISOString()
        }
      });
      
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(
        credentials.email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );

      if (error) {
        logger.error('[Auth] Supabase password reset error:', { 
          context: {
            message: error.message,
            status: error.status
          },
          error
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

      logger.error('[Auth] Password reset error details:', { 
        context: {
          timestamp: new Date().toISOString()
        },
        error: errorDetails
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

  // const checkAndRefreshSession = async (): Promise<void> => {
  //   try {
  //     await sessionManager.checkAndRefreshSession();
  //   } catch (error) {
  //     logger.error('Failed to check and refresh session', {
  //       context: { error },
  //       source: 'useAuth'
  //     });
  //   }
  // };

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