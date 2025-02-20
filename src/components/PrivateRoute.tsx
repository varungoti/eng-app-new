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
  const initialLoadRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Handle route persistence
  useEffect(() => {
    if (user && !loading && initialLoadRef.current) {
      const lastRoute = localStorage.getItem('lastRoute');
      const currentPath = location.pathname + location.search;
      
      // Don't redirect if we're already on the lastRoute or if it's a lesson page
      if (lastRoute && 
          lastRoute !== currentPath && 
          lastRoute !== '/login' && 
          !currentPath.includes('/lessons/')) {
        logger.debug('Restoring last route', {
          context: {
            from: currentPath,
            to: lastRoute,
            userId: user.id
          },
          source: 'PrivateRoute'
        });
        navigate(lastRoute, { replace: true });
      }
      initialLoadRef.current = false;
    }
  }, [user, loading, location, navigate]);

  // Store current route with enhanced persistence
  useEffect(() => {
    if (user && !loading && location.pathname !== '/login') {
      const currentPath = location.pathname + location.search;
      
      // Store route in both localStorage and sessionStorage for redundancy
      localStorage.setItem('lastRoute', currentPath);
      sessionStorage.setItem('currentRoute', currentPath);
      
      // Store additional context for lesson pages
      if (currentPath.includes('/lessons/')) {
        const lessonContext = {
          path: currentPath,
          userId: user.id,
          timestamp: new Date().toISOString(),
          role: user.role
        };
        sessionStorage.setItem('lessonContext', JSON.stringify(lessonContext));
      }

      logger.debug('Route stored', {
        context: { 
          route: currentPath,
          isLessonPage: currentPath.includes('/lessons/'),
          userId: user.id,
          role: user.role
        },
        source: 'PrivateRoute'
      });
    }
  }, [location, user, loading]);

  // Enhanced session check
  useEffect(() => {
    const checkSession = async () => {
      if (!user && !loading) {
        const currentPath = location.pathname + location.search;
        const isLessonPage = currentPath.includes('/lessons/');
        
        // Try to recover session from storage
        const lessonContext = sessionStorage.getItem('lessonContext');
        const currentRoute = sessionStorage.getItem('currentRoute');
        
        if (isLessonPage && lessonContext) {
          logger.info('Attempting to recover lesson session', {
            context: {
              path: currentPath,
              lessonContext: JSON.parse(lessonContext)
            },
            source: 'PrivateRoute'
          });
        }

        logger.debug('Session check', {
          context: {
            path: currentPath,
            isLessonPage,
            hasLessonContext: !!lessonContext,
            currentRoute
          },
          source: 'PrivateRoute'
        });

        // Store the attempted route before redirecting
        if (location.pathname !== '/login') {
          localStorage.setItem('lastRoute', currentPath);
          sessionStorage.setItem('redirectPath', currentPath);
        }

        navigate('/login', { state: { from: location }, replace: true });
        queryClient.clear();
      }
    };

    checkSession();
  }, [user, loading, location, navigate, queryClient]);

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
          queryClient.invalidateQueries({ queryKey: ['auth'] });
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