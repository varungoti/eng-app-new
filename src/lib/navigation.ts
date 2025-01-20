import { ROLE_PERMISSIONS } from '../types/roles';
//import { LayoutDashboard } from '@lucide-react';
import { APP_ICONS } from '@/lib/constants/icons';
import { useQuery } from '@tanstack/react-query';

// Add type for sidebar consumption
export interface SidebarItem {
  label: string;
  href: string;
  icon: keyof typeof APP_ICONS;
  isActive: boolean;
}

export const getNavigationItems = (role: string, pathname: string = ''): SidebarItem[] => {
  const permissions = ROLE_PERMISSIONS[role]?.permissions;
  if (!permissions) return [];
  
  // Debug permissions
  console.log('Navigation Initialization:', {
    role,
    permissions,
    hasContentManagement: permissions.content_management,
    pathname
  });

  const navigationItems: SidebarItem[] = [];

  // 1. Always add Dashboard first
  navigationItems.push({
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LAYOUT_DASHBOARD',
    isActive: pathname === '/dashboard'
  });

  // Debug after Dashboard
  console.log('After Dashboard:', navigationItems);

  // 2. Add Content Management second (if permitted)
  if (permissions.content_management) {
    console.log('Adding Content Management menu item');
    navigationItems.push({
      label: 'Content Management',
      href: '/content-management/index',
      icon: 'CONTENT_MANAGEMENT',
      isActive: pathname === '/content-management/index'
    });

    // Debug Content Management addition
    console.log('Content Management Added:', {
      itemCount: navigationItems.length,
      items: navigationItems.map(i => i.label)
    });
  }

  // Debug after Content Management
  console.log('After Content Management:', navigationItems.map(i => i.label));

  // 3. Add Schools third (if permitted)
  if (permissions.schools) {
    navigationItems.push({
      label: 'Schools',
      href: '/schools',
      icon: 'BUILDING',
      isActive: pathname === '/schools'
    });
  }

  // Add remaining items directly
  if (permissions.schools || permissions.staff) {
    navigationItems.push({
      label: 'Students',
      href: '/students',
      icon: 'USERS',
      isActive: pathname === '/students'
    });
  }

  if (permissions.sales) {
    navigationItems.push({
      label: 'Sales',
      href: '/sales',
      icon: 'DOLLAR_SIGN',
      isActive: pathname === '/sales'
    });
  }

  if (permissions.content) {
    navigationItems.push({
      label: 'Content',
      href: '/content/view',
      icon: 'EYE',
      isActive: pathname === '/content/view'
    });
  } else if (permissions.content_editor) {
    navigationItems.push({
      label: 'Lessons',
      href: '/content/lessons',
      icon: 'FILE_TEXT',
      isActive: pathname === '/content/lessons'
    });
  }

  if (permissions.development) {
    navigationItems.push({
      label: 'Development',
      href: '/development',
      icon: 'CODE',
      isActive: pathname === '/development'
    });
  }

  if (permissions.infrastructure) {
    navigationItems.push({
      label: 'Infrastructure',
      href: '/infrastructure',
      icon: 'SERVER',
      isActive: pathname === '/infrastructure'
    });
  }

  if (permissions.finance) {
    navigationItems.push({
      label: 'Finance',
      href: '/finance',
      icon: 'DOLLAR_SIGN',
      isActive: pathname === '/finance'
    });
  }

  if (permissions.staff) {
    navigationItems.push({
      label: 'Staff',
      href: '/staff',
      icon: 'FILE_TEXT',
      isActive: pathname === '/staff'
    });
  }

  if (permissions.schedule) {
    navigationItems.push({
      label: 'Schedule',
      href: '/schedule',
      icon: 'CALENDAR',
      isActive: pathname === '/schedule'
    });
  }

  if (permissions.reports) {
    navigationItems.push({
      label: 'Reports',
      href: '/reports',
      icon: 'FILE_BAR_CHART',
      isActive: pathname === '/reports'
    });
  }

  navigationItems.push({
    label: 'Events',
    href: '/events',
    icon: 'CALENDAR_DAYS',
    isActive: pathname === '/events'
  });

  if (role === 'super_admin' || role === 'technical_head' || role === 'developer') {
    navigationItems.push({
      label: 'Error Test',
      href: '/error-test',
      icon: 'ALERT_TRIANGLE',
      isActive: pathname === '/error-test'
    });
  }

  if (permissions.settings) {
    navigationItems.push({
      label: 'Settings',
      href: '/settings',
      icon: 'SETTINGS',
      isActive: pathname === '/settings'
    });
  }

  // Final debug check
  console.log('Final navigation items:', navigationItems.map(item => ({
    label: item.label,
    href: item.href,
    hasPermission: permissions[item.label.toLowerCase().replace(' ', '_') as keyof typeof permissions]
  })));

  return navigationItems;
}