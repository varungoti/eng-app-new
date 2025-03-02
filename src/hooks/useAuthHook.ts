import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  userRole: string | null;
  userDetails: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  } | null;
}

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/classes',
  '/content',
  '/lessons',
  '/students'
];

// Routes that require admin access
const ADMIN_ROUTES = [
  '/admin',
  '/users',
  '/settings'
];

export const useAuthHook = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    user: null,
    isAuthenticated: false,
    userRole: null,
    userDetails: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          // User is authenticated
          const user = session.user;
          
          // Get user role from metadata if available
          const userRole = user.user_metadata?.role || 'STUDENT';
          
          // Get additional user details if needed
          const { data: userProfile, error: userError } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('id', user.id)
            .single();
            
          if (userError && userError.code !== 'PGRST116') {
            console.error('Error fetching user profile:', userError);
          }
          
          setAuthState({
            session,
            user,
            isAuthenticated: true,
            userRole,
            userDetails: {
              id: user.id,
              email: user.email || '',
              firstName: userProfile?.first_name || user.user_metadata?.first_name || '',
              lastName: userProfile?.last_name || user.user_metadata?.last_name || ''
            }
          });
        } else {
          // User is not authenticated
          setAuthState({
            session: null,
            user: null,
            isAuthenticated: false,
            userRole: null,
            userDetails: null
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        setIsLoading(false);
      }
    };

    // Initial auth check
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, _session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          await checkAuth();
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            session: null,
            user: null,
            isAuthenticated: false,
            userRole: null,
            userDetails: null
          });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      // Don't perform checks during loading
      if (isLoading) return;
      
      const currentPath = location.pathname;
      
      // Check if this path needs authentication
      const needsAuth = PROTECTED_ROUTES.some(route => 
        currentPath.startsWith(route) || currentPath === route
      );
      
      // Check if this path needs admin access
      const needsAdmin = ADMIN_ROUTES.some(route => 
        currentPath.startsWith(route) || currentPath === route
      );
      
      // Redirect unauthenticated users trying to access protected routes
      if (needsAuth && !authState.isAuthenticated) {
        console.log('Redirecting to login: Protected route access attempted without authentication');
        navigate('/login', { state: { from: currentPath } });
        return;
      }
      
      // Redirect non-admin users trying to access admin routes
      if (needsAdmin && authState.userRole !== 'ADMIN' && authState.userRole !== 'SUPER_ADMIN') {
        console.log('Redirecting to dashboard: Admin route access attempted without proper permissions');
        navigate('/dashboard');
        return;
      }
      
      // Redirect authenticated users trying to access login/register
      if ((currentPath === '/login' || currentPath === '/register') && authState.isAuthenticated) {
        navigate('/dashboard');
        return;
      }
    };

    handleRouteChange();
  }, [location.pathname, authState.isAuthenticated, authState.userRole, isLoading, navigate]);

  const checkAndRefreshSession = async () => {
    if (!authState.session) return false;
    
    // Check if session is expired or about to expire (within 5 minutes)
    const expiresAt = authState.session.expires_at;
    const expirationTime = expiresAt ? expiresAt * 1000 : 0; // Convert to milliseconds
    const fiveMinutes = 5 * 60 * 1000;
    
    if (expirationTime - Date.now() < fiveMinutes) {
      console.log('Session about to expire, refreshing...');
      
      try {
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error('Error refreshing session:', error);
          return false;
        }
        
        if (data.session) {
          setAuthState(prev => ({
            ...prev,
            session: data.session!,
            user: data.session!.user
          }));
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Session refresh error:', error);
        return false;
      }
    }
    
    return true; // Session is still valid
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return false;
    }
    navigate('/login');
    return true;
  };

  return {
    isLoading,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    userDetails: authState.userDetails,
    userRole: authState.userRole,
    refreshSession: checkAndRefreshSession,
    signOut
  };
}; 