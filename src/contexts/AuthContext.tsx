import React, { createContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useRoleStore } from '../lib/auth/store';
import { useQueryClient } from '@tanstack/react-query';
import { logger } from '../lib/logger';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import type { UserRole } from '../types/roles';

interface AuthContextType {
  user: (User & { role: UserRole }) | null;
  loading: boolean;
  error: string | null;
  setUser: (user: (User & { role: UserRole }) | null) => void;
  login: (email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  setUser: () => {},
  login: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<(User & { role: UserRole }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setRole = useRoleStore((state) => state.setRole);
  const mounted = useRef(true);
  const queryClient = useQueryClient();
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
          
          // Prefetch critical data in parallel
          const prefetchPromises = [
            ['role_settings'],
            ['user_preferences'], 
            ['schools'],
            ['grades']
          ].map(key => queryClient.prefetchQuery({ queryKey: key }));
          
          await Promise.all([
            ...prefetchPromises
          ]);
          
          setUser({
            id: session.user.id,
            name: session.user.user_metadata?.name || 'User',
            email: session.user.email!,
            role: role || 'user',
          });
          
          // Navigate to home after successful login
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session?.user) {
        const role = session.user.user_metadata?.role as UserRole;
        setRole(role || 'user');
        
        // Prefetch critical data
        await Promise.all([
          queryClient.prefetchQuery({ queryKey: ['role_settings'] }),
          queryClient.prefetchQuery({ queryKey: ['user_preferences'] }),
          queryClient.prefetchQuery({ queryKey: ['schools'] }),
          queryClient.prefetchQuery({ queryKey: ['grades'] }),
          queryClient.prefetchQuery({ queryKey: ['sales_leads'] }),
          queryClient.prefetchQuery({ queryKey: ['students'] })
        ]);
        
        const userData = {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'User',
          email: session.user.email!,
          role: role || 'user',
        };
        setUser(userData);
        
        // Navigate to home after successful login
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

  return (
    <AuthContext.Provider value={{ user, loading, error, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};