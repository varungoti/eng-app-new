import { useRouter } from 'next/router';
import { getNavigationItems } from '../../lib/navigation';
import Sidebar from '@/components/common/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';
import { ROLE_PERMISSIONS } from '@/types/roles';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();
  const { user } = useAuth();
  
  // Get user permissions
  const userPermissions = user?.role ? ROLE_PERMISSIONS[user.role]?.permissions : null;
  
  // Debug permissions
  console.log('User Permissions:', {
    role: user?.role,
    permissions: userPermissions,
    hasContentManagement: userPermissions?.content_management
  });
  
  const navigationItems = getNavigationItems(user?.role || '', pathname);
  
  // Debug navigation items
  console.log('Navigation Items:', {
    total: navigationItems.length,
    items: navigationItems.map(item => item.label),
    contentManagementIndex: navigationItems.findIndex(item => item.label === 'Content Management')
  });

  return (
    <div className="flex h-screen">
      <Sidebar 
        sidebarItems={navigationItems}
        className="fixed left-0 top-0 z-40"
        currentPath={pathname}
      />
      <main className="flex-1 ml-72 p-6">
        {children}
      </main>
    </div>
  );
} 