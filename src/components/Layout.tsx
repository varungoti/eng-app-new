"use client";

import React, { useState } from 'react';
import { useLocation, Link, Outlet } from 'react-router-dom';
import { useTheme } from "next-themes";
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
import ThemeSelector from './ThemeSelector';
import { ThemeToggle } from "./theme-toggle";
import { SidebarItem } from '../types/navigation';
import { 
  Home, 
  Bookmark, 
  ChevronUp, 
  ChevronDown, 
  Loader, 
  AlertTriangle, 
  BookOpen, 
  Book,
  type LucideIcon 
} from 'lucide-react';
//import { Books } from '@phosphor-icons/react/dist/ssr';

interface NavItem  {
  name: string;
  href?: string;
  icon: LucideIcon;
  current?: boolean;
  submenu?: { 
    name: string; 
    href: string;
    icon: LucideIcon;
    current?: boolean; 
  }[];
}

const Layout: React.FC = () => {
  const location = useLocation();
  const { theme, resolvedTheme } = useTheme();
  const { user, loading } = React.useContext(AuthContext);
  const { error } = useError();
  const currentTheme = themes[theme as keyof typeof themes] || themes[resolvedTheme as keyof typeof themes] || themes.light;
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

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-2">
          <Loader 
            className="h-12 w-12 text-indigo-600 animate-spin mx-auto"
          />
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <AlertTriangle 
            className="h-12 w-12 text-red-600 mx-auto"
          />
          <h2 className="text-lg font-medium text-gray-900">Application Error</h2>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
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
        <div className="mb-2">
          <button
            onClick={() => setOpenSubmenu(openSubmenu === item.name ? null : item.name)}
            className={`${
              isSubmenuActive || isOpen
                ? `bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500/20`
                : `text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50`
            } w-full group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out hover:shadow-md`}
          >
            <div className="flex items-center">
              <item.icon 
                className={`${
                  isSubmenuActive || isOpen
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400'
                } mr-3 flex-shrink-0 h-5 w-5 transition-all duration-200 group-hover:scale-110`}
              />
              {item.name}
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
            )}
          </button>
          
          {isOpen && (
            <div className="mt-1 ml-4 space-y-1 animate-slideDown">
              {item.submenu.map((subitem, subIndex) => (
                <Link
                  key={subitem.href}
                  to={subitem.href}
                  className={`${
                    location.pathname.startsWith(subitem.href)
                      ? `bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500/20`
                      : `text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50`
                  } group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-sm`}
                  style={{ animationDelay: `${subIndex * 50}ms` }}
                >
                  <subitem.icon 
                    className={`${
                      location.pathname === subitem.href 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400'
                    } mr-3 flex-shrink-0 h-4 w-4 transition-all duration-200 group-hover:scale-110`}
                  />
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
            ? `bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500/20`
            : `text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50`
        } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-md mb-1`}
      >
        <item.icon 
          className={`${
            location.pathname === item.href
              ? 'text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400'
          } mr-3 flex-shrink-0 h-5 w-5 transition-all duration-200 group-hover:scale-110`}
        />
        {item.name}
      </Link>
    );
  };

  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
      <div className="flex h-screen overflow-hidden">
        <ErrorBoundary source="Notifications">
          <div className="fixed top-4 right-16 z-50">
            <NotificationBell />
          </div>
        </ErrorBoundary>

        <div className="hidden md:flex md:flex-shrink-0 relative">
          <div className="flex flex-col w-80">
            <ErrorBoundary source="Sidebar">
              <div className={`flex flex-col flex-grow pt-6 overflow-y-auto ${currentTheme.sidebar} border-r ${currentTheme.border} shadow-xl backdrop-blur-sm bg-opacity-95 transition-all duration-300 ease-in-out`}>
                <div className="flex items-center justify-between px-6 mb-8">
                  <div className="flex items-center space-x-3 group">
                    <Bookmark 
                      className={`w-8 h-8 ${currentTheme.primary.replace('bg-', 'text-')} transform transition-transform group-hover:scale-110 duration-200`}
                    />
                    <span className={`text-xl font-bold tracking-tight ${currentTheme.text} group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200`}>
                      SpeakWell Admin
                    </span>
                  </div>
                </div>

                <div className="flex-grow flex flex-col px-3">
                  <nav className="flex-1 space-y-1.5">
                    {navigation.map((item, index) => (
                      <div key={item.name} 
                        className="animate-fadeIn" 
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {renderNavItem(item)}
                      </div>
                    ))}
                  </nav>
                </div>

                <div className="p-5 mt-6 border-t border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
                  <UserProfileMenu />
                </div>
              </div>
            </ErrorBoundary>
          </div>
        </div>

        <div className={`flex flex-col flex-1 overflow-hidden ${currentTheme.background}`}>
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className={`py-6 ${currentTheme.background} ${currentTheme.text}`}>
              <div className={`max-w-9xl mx-auto px-4 sm:px-6 md:px-2 ${currentTheme.background}`}>
                <ErrorBoundary source="MainContent">
                  <div className={`${currentTheme.card} rounded-lg p-1`}>
                    <Outlet />
                  </div>
                </ErrorBoundary>
              </div>
            </div>
          </main>
        </div>
      </div>

      <ErrorBoundary source="Monitoring">
        <div className="fixed bottom-4 right-4 z-50 space-y-4">
          <PerformanceIndicator source="Layout" showCompleted={true} />
          <LoadingIndicator resource="Layout" />
          <ErrorMetricsDisplay />
        </div>
      </ErrorBoundary>

      <ErrorBoundary source="UserRole">
        <UserRoleIndicator />
      </ErrorBoundary>

      <ThemeToggle />
    </div>
  );
};

export default Layout;