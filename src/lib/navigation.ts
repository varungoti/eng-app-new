import { ROLE_PERMISSIONS } from '../types/roles';
import { 
  LayoutDashboard,
  Settings,
  Users,
  BookOpen,
  FolderPlus,
  GraduationCap,
  FileText,
  BarChart,
  type LucideIcon 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {   Home,   DollarSign, Eye, Code, Server, Calendar, AlertTriangle, FileBarChart, CalendarDays, Building,} from 'lucide-react';
import { TEACHER_ROUTES } from './content/routes';
  // ... import other icons you need


// Add type for sidebar consumption
export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
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
    icon: LayoutDashboard,
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
      icon: FolderPlus,
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
      icon: Building,
      isActive: pathname === '/schools'
    });
  }
  if (permissions.staff) {
    navigationItems.push({
      label: 'Staff',
      href: '/staff',
      icon: Users,
      isActive: pathname === '/staff'
    });
  } 
  
  if (permissions.myclasses) {
    navigationItems.push({
      label: 'My Classes',
      href: TEACHER_ROUTES.LESSONS,
      icon: Users,
      isActive: pathname === TEACHER_ROUTES.LESSONS
    });
  }

  // Add remaining items directly
  if (permissions.schools || permissions.staff) {
    navigationItems.push({
      label: 'Students',
      href: '/students',
      icon: Users,
      isActive: pathname === '/students'
    });
  }

  if (permissions.sales) {
    navigationItems.push({
      label: 'Sales',
      href: '/sales',
      icon: DollarSign,
      isActive: pathname === '/sales'
    });
  }

  if (permissions.content) {
    navigationItems.push({
      label: 'Content',
      href: '/content/view',
      icon: Eye,
      isActive: pathname === '/content/view'
    });
  } else if (permissions.content_editor) {
    navigationItems.push({
      label: 'Lessons',
      href: '/content/lessons',
      icon: FileText,
      isActive: pathname === '/content/lessons'
    });
  }

  if (permissions.development) {
    navigationItems.push({
      label: 'Development',
      href: '/development',
      icon: Code,
      isActive: pathname === '/development'
    });
  }

  if (permissions.infrastructure) {
    navigationItems.push({
      label: 'Infrastructure',
      href: '/infrastructure',
      icon: Server,
      isActive: pathname === '/infrastructure'
    });
  }

  if (permissions.finance) {
    navigationItems.push({
      label: 'Finance',
      href: '/finance',
      icon: DollarSign,
      isActive: pathname === '/finance'
    });
  }

  if (permissions.staff) {
    navigationItems.push({
      label: 'Staff',
      href: '/staff',
      icon: FileText,
      isActive: pathname === '/staff'
    });
  }

  if (permissions.schedule) {
    navigationItems.push({
      label: 'Schedule',
      href: '/schedule',
      icon: Calendar,
      isActive: pathname === '/schedule'
    });
  }

  if (permissions.reports) {
    navigationItems.push({
      label: 'Reports',
      href: '/reports',
      icon: BarChart,
      isActive: pathname === '/reports'
    });
  }

  navigationItems.push({
    label: 'Events',
    href: '/events',
    icon: CalendarDays,
    isActive: pathname === '/events'
  });

  if (role === 'super_admin' || role === 'technical_head' || role === 'developer') {
    navigationItems.push({
      label: 'Error Test',
      href: '/error-test',
      icon: AlertTriangle,
      isActive: pathname === '/error-test'
    });
  }

  if (permissions.settings) {
    navigationItems.push({
      label: 'Settings',
      href: '/settings',
      icon: Settings,
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