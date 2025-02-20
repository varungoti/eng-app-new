"use client";

import React, { createContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useRoleStore } from '../lib/auth/store';
import { QueryClient } from '@tanstack/react-query';
import { logger } from '../lib/logger';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import type { UserRole } from '../types/roles';
import type { UserPreferences } from '../types/preferences';
import type { AuthError, Session, AuthChangeEvent } from '@supabase/gotrue-js';

interface AuthContextType {
  user: (User & { role: UserRole }) | null;
  loading: boolean;
  error: string | null;
  setUser: (user: (User & { role: UserRole }) | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: ({ email }: { email: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  setUser: () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

// Move QueryClient instance outside of component
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const fetchRoleSettings = async (role: string) => {
  const { data, error } = await supabase
    .from('role_settings')
    .select(`
      id,
      role_key,
      settings,
      created_at,
      updated_at
    `)
    .eq('role_key', role);

  if (error) {
    logger.error('Failed to fetch role settings', {
      context: { error },
      source: 'AuthContext'
    });
    return null;
  }
  return data;
};

const fetchUserPreferences = async (userId: string): Promise<UserPreferences | null> => {
  try {
    const { data, error } = await supabase
      .from('user_preference')
      .select(`
        id,
        user_id,
        preferences,
        created_at,
        updated_at
      `)
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      const { data: newData, error: insertError } = await supabase
        .from('user_preference')
        .insert([{
          user_id: userId,
          preferences: {
            theme: 'light',
            language: 'en',
            notifications: true
          }
        }])
        .select()
        .single();

      if (insertError) {
        logger.error('Failed to create user preferences', {
          context: { error: insertError },
          source: 'AuthContext'
        });
        return null;
      }

      return newData;
    }

    if (error) {
      logger.error('Failed to fetch user preferences', {
        context: { error },
        source: 'AuthContext'
      });
      return null;
    }
    if (data) {
      return {
        theme: data.preferences.theme || 'light',
        language: data.preferences.language || 'en',
        notifications: data.preferences.notifications ?? true
      };
    }

    return data;
  } catch (error) {
    logger.error('Error in fetchUserPreferences', {
      context: { error },
      source: 'AuthContext'
    });
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { role: UserRole }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setRole = useRoleStore((state) => state.setRole);
  const mounted = useRef(true);
  const navigate = useNavigate(); 
  const initializeRef = useRef(false);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    // Prevent multiple initializations
    if (initializeRef.current) {
      return;
    }
    initializeRef.current = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (session?.user && mounted) {
          const role = session.user.user_metadata?.role as UserRole;
          setRole(role || 'user');
          
          // Prefetch critical data with proper query functions
          await Promise.all([
            queryClient.prefetchQuery({
              queryKey: ['role_settings', role],
              queryFn: () => fetchRoleSettings(role),
              retry: 1,
              staleTime: 5 * 60 * 1000
            }),
            queryClient.prefetchQuery({
              queryKey: ['user_preferences', session.user.id],
              queryFn: () => fetchUserPreferences(session.user.id),
              retry: 1,
              staleTime: 5 * 60 * 1000
            }),
            queryClient.prefetchQuery({
              queryKey: ['schools'],
              queryFn: async () => {
                const { data, error } = await supabase
                  .from('schools')
                  .select('*');
                if (error) throw error;
                return data;
              }
            }),
            queryClient.prefetchQuery({
              queryKey: ['grades'],
              queryFn: async () => {
                const { data, error } = await supabase
                  .from('grades')
                  .select('*')
                  .order('name');
                if (error) throw error;
                return data;
              }
            })
          ]);
          
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || 'User',
            email: session.user.email!,
            role: role || 'user',
          });
          
          navigate('/', { replace: true });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize auth';
        logger.error(message, {
          context: { error: err },
          source: 'AuthContext'
        });
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        const role = session.user.user_metadata?.role as UserRole;
        setRole(role || 'user');
        
        // Prefetch with proper query functions
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ['role_settings', role],
            queryFn: () => fetchRoleSettings(role),
            retry: 1,
            staleTime: 5 * 60 * 1000
          }),
          queryClient.prefetchQuery({
            queryKey: ['user_preferences', session.user.id],
            queryFn: () => fetchUserPreferences(session.user.id),
            retry: 1,
            staleTime: 5 * 60 * 1000
          }),
          queryClient.prefetchQuery({
            queryKey: ['schools'],
            queryFn: async () => {
              const { data, error } = await supabase
                .from('schools')
                .select('*');
              if (error) throw error;
              return data;
            }
          }),
          queryClient.prefetchQuery({
            queryKey: ['grades'],
            queryFn: async () => {
              const { data, error } = await supabase
                .from('grades')
                .select('*')
                .order('name');
              if (error) throw error;
              return data;
            }
          }),
          queryClient.prefetchQuery({
            queryKey: ['sales_leads'],
            queryFn: async () => {
              const { data, error } = await supabase
                .from('sales_leads')
                .select('*');
              if (error) throw error;
              return data;
            }
          }),
          queryClient.prefetchQuery({
            queryKey: ['students'],
            queryFn: async () => {
              const { data, error } = await supabase
                .from('students')
                .select('*');
              if (error) throw error;
              return data;
            }
          }),
          queryClient.prefetchQuery({
            queryKey: ['teachers'],
            queryFn: async () => {
              const { data, error } = await supabase
                .from('teachers')
                .select('*');
              if (error) throw error;
              return data;
            }
          }),
          queryClient.prefetchQuery({
            queryKey: ['users'],
            queryFn: async () => {
              const { data, error } = await supabase
                .from('users')
                .select('*');
              if (error) throw error;
              return data;
            }
          }),
          queryClient.prefetchQuery({
            queryKey: ['permissions'],
            queryFn: async () => {
              const { data, error } = await supabase
                .from('permissions')
                .select('*');
              if (error) throw error;
              return data;
            }
          })
        ]);
        
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email!,
          role: role || 'user',
        };
        setUser(userData);
        
        navigate('/', { replace: true });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setRole(null);
        queryClient.clear();
        navigate('/login', { replace: true });
        queryClient.clear();
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setRole]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      if (!authData.session) throw new Error('No session created');
      
      // Set session expiry to 7 days
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      
      // Update session in localStorage
      const sessionData = {
        ...authData.session,
        expires_at: expiryDate.toISOString()
      };
      localStorage.setItem('sb-auth-token', JSON.stringify(sessionData));

      const role = authData.session.user.user_metadata?.role as UserRole;
      setRole(role || 'user');
      const userData = {
        id: authData.session.user.id,
        name: authData.session.user.user_metadata?.name || 'User',
        email: authData.session.user.email!,
        photoUrl: authData.session.user.user_metadata?.avatar_url,
        role: role || 'user',
      };
      setUser(userData);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to login';
      logger.error(message, {
        context: { error: err },
        source: 'AuthContext'
      });
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    queryClient.clear();
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  const resetPassword = async ({ email }: { email: string }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, setUser, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};