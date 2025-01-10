import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';
import { logger } from '../lib/logger';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); 
  const auth = useAuth();
  const { user, loading } = auth;
  const mountedRef = useRef(true);
  const [loadingProgress, setLoadingProgress] = React.useState(0);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !loading) {
      logger.debug('Redirecting to login', {
        context: {
          from: location.pathname,
          reason: 'No authenticated user'
        },
        source: 'PrivateRoute'
      });

      navigate('/login', { state: { from: location }, replace: true });
      // Clear cache only when redirecting
      queryClient.clear();
    }
    
  }, [user, loading, location, navigate, queryClient]);

  useEffect(() => {
    // Only log authentication failure once per session
    if (!user && !loading && !sessionStorage.getItem('auth_redirect_logged')) {
      sessionStorage.setItem('auth_redirect_logged', 'true');
      // Clear query cache on auth failure
      queryClient.clear();
      logger.warn('Authentication required', {
        context: { path: location.pathname },
        source: 'PrivateRoute'
      });
    }
  }, [user, loading, location.pathname, queryClient]);

  // Handle loading state
  if (loading) {
    return (
      <LoadingSpinner 
        message="Authenticating..." 
        showProgress={true}
        progress={loadingProgress}
        timeout={15000}
        showRetry={true}
        onRetry={() => {
          queryClient.invalidateQueries(['auth']);
          window.location.reload();
        }}
      />
    );
  }

  // Handle unauthenticated state
  if (!user) {
    // Clear cache before redirecting
    logger.info('Redirecting to login - no authenticated user', {
      source: 'PrivateRoute'
    });
    queryClient.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;