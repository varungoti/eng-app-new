import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import { logger } from '../lib/logger';
import { useError } from '../hooks/useError';
import NotificationBell from './notifications/NotificationBell';
import UserProfileMenu from './UserProfileMenu';
import ErrorBoundary from './ErrorBoundary';
import { PerformanceIndicator } from './PerformanceIndicator';
import { LoadingIndicator } from './LoadingIndicator';
import { ErrorMetricsDisplay } from './ErrorMonitor/ErrorMetricsDisplay';
import { themes } from '../lib/themes';
import { getNavigationItems } from '../lib/permissions';
import UserRoleIndicator from './UserRoleIndicator';

interface NavItem {
  name: string;
  href?: string;
  icon: string;
  submenu?: { name: string; href: string; icon: string; }[];
}

const Layout: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const { user, loading } = React.useContext(AuthContext);
  const { error } = useError();
  const currentTheme = themes[theme];
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const navigation = user ? getNavigationItems(user.role).map(item => ({
    ...item,
    current: item.submenu 
      ? item.submenu.some(subitem => location.pathname === subitem.href)
      : location.pathname === item.href
  })) : [];

  React.useEffect(() => {
    logger.debug('Navigation state updated', {
      context: {
        pathname: location.pathname,
        role: user?.role,
        navigationItems: navigation.length
      },
      source: 'Layout'
    });
  }, [location.pathname, user?.role, navigation.length]);

  // Show loading state while initializing
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-2">
          <Icons.Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading application...</p>
          <p className="text-sm text-gray-500">Please wait while we initialize your session</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <Icons.AlertTriangle className="h-12 w-12 text-red-600 mx-auto" />
          <h2 className="text-lg font-medium text-gray-900">Application Error</h2>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Icons.RefreshCw className="h-4 w-4 mr-2" />
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  const renderNavItem = (item: NavItem) => {
    if (item.submenu) {
      const isSubmenuActive = item.submenu.some(subitem => location.pathname.startsWith(subitem.href));
      const isOpen = openSubmenu === item.name;
      
      return (
        <div key={item.name}>
          <button
            onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
            className={`${
              isSubmenuActive || isOpen
                ? `${currentTheme.primary.replace('bg-', 'bg-opacity-10')} ${currentTheme.primary.replace('bg-', 'text-')}`
                : `${currentTheme.textMuted} ${currentTheme.sidebarHover}`
            } w-full group flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md`}
          >
            <div className="flex items-center">
              {React.createElement(Icons[item.icon], {
                className: `${
                  isSubmenuActive || isOpen
                    ? currentTheme.primary.replace('bg-', 'text-') 
                    : currentTheme.textMuted
                } mr-3 flex-shrink-0 h-6 w-6`
              })}
              {item.name}
            </div>
            <Icons.ChevronDown 
              className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
          
          {isOpen && (
            <div className="mt-1 ml-4 space-y-0.5">
              {item.submenu.map(subitem => (
                <Link
                  key={subitem.href}
                  to={subitem.href}
                  className={`${
                    location.pathname.startsWith(subitem.href)
                      ? `${currentTheme.primary.replace('bg-', 'bg-opacity-10')} ${currentTheme.primary.replace('bg-', 'text-')}`
                      : `${currentTheme.textMuted} ${currentTheme.sidebarHover}`
                  } group flex items-center px-4 py-2 text-sm font-medium rounded-md`}
                >
                  {React.createElement(Icons[subitem.icon], {
                    className: `${
                      location.pathname === subitem.href 
                        ? currentTheme.primary.replace('bg-', 'text-') 
                        : currentTheme.textMuted
                    } mr-3 flex-shrink-0 h-4 w-4`
                  })}
                  {subitem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        to={item.href || '#'}
        className={`${
          location.pathname === item.href
            ? `${currentTheme.primary.replace('bg-', 'bg-opacity-10')} ${currentTheme.primary.replace('bg-', 'text-')}`
            : `${currentTheme.textMuted} ${currentTheme.sidebarHover}`
        } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
      >
        {React.createElement(Icons[item.icon], {
          className: `${
            item.current 
              ? currentTheme.primary.replace('bg-', 'text-') 
              : currentTheme.textMuted
          } mr-3 flex-shrink-0 h-6 w-6`
        })}
        {item.name}
      </Link>
    );
  };

  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
      <div className="flex h-screen overflow-hidden">
        <ErrorBoundary source="Notifications">
          <div className="fixed top-4 right-4 z-50">
            <NotificationBell />
          </div>
        </ErrorBoundary>

        <div className="hidden md:flex md:flex-shrink-0 relative">
          <div className="flex flex-col w-64">
            <ErrorBoundary source="Sidebar">
              <div className={`flex flex-col flex-grow pt-5 overflow-y-auto ${currentTheme.sidebar} border-r ${currentTheme.border} shadow-sm`}>
                <div className="flex items-center justify-between px-4">
                  <Icons.Book className={`w-8 h-8 ${currentTheme.primary.replace('bg-', 'text-')}`} />
                  <span className={`ml-2 text-xl font-semibold ${currentTheme.text}`}>
                    SpeakWell Admin
                  </span>
                  <UserProfileMenu />
                </div>
                <div className="mt-8 flex-grow flex flex-col">
                  <nav className="flex-1 px-2 space-y-1">
                    {navigation.map(renderNavItem)}
                  </nav>
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </div>

        <div className={`flex flex-col flex-1 overflow-hidden ${currentTheme.background}`}>
          <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
            <div className="py-6 min-h-screen">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
                <ErrorBoundary source="MainContent">
                  <Outlet />
                </ErrorBoundary>
              </div>
            </div>
          </main>
        </div>
      </div>

      <ErrorBoundary source="Monitoring">
        <div className="fixed bottom-4 right-4 z-50 space-y-4">
          <PerformanceIndicator source="Layout" showCompleted={true} />
          <LoadingIndicator source="Layout" />
          <ErrorMetricsDisplay />
        </div>
      </ErrorBoundary>

      <ErrorBoundary source="UserRole">
        <UserRoleIndicator />
      </ErrorBoundary>
    </div>
  );
};

export default Layout;