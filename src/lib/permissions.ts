import type { UserRole } from '../types/roles';
import { ROLE_PERMISSIONS } from '../types/roles';
import { House, Users, Calendar, Gear, BookOpen, ChartLine, FolderOpen } from "@phosphor-icons/react";
import type { Icon } from '@/Components/ui/icons';
import { IconName } from '@/types/icons';

// Get allowed roles for staff management based on user role
export const getAllowedStaffRoles = (userRole: UserRole): string[] => {
  switch (userRole) {
    case 'super_admin':
      return Object.keys(ROLE_PERMISSIONS);
    case 'admin':
      return Object.keys(ROLE_PERMISSIONS).filter(role => role !== 'super_admin');
    case 'school_leader':
      return ['school_principal', 'teacher_head', 'teacher'];
    case 'school_principal':
      return ['teacher_head', 'teacher'];
    case 'teacher_head':
      return ['teacher'];
    default:
      return [];
  }
};

// Check if a user can access a specific role's dashboard
export const canAccessDashboard = (userRole: UserRole, targetRole: string): boolean => {
  if (userRole === 'super_admin') return true;
  return userRole === targetRole;
};

interface NavigationItem {
  name: string;
  href?: string;
  icon: IconName;
  submenu?: { 
    name: string; 
    href: string; 
    icon: IconName;
  }[];
}

// Get navigation items based on role permissions
export const getNavigationItems = (role: string): NavigationItem[] => {
  const permissions = ROLE_PERMISSIONS[role]?.permissions;
  if (!permissions) return [];

  const items: NavigationItem[] = [];

  // Dashboard is available for all roles
  items.push({ 
    name: 'Dashboard', 
    href: '/dashboard',
    icon: 'BOOKMARK' as IconName 
  });

  if (permissions.content) {
    items.push({ 
      name: 'Lesson Management', 
      href: '/content/lesson-management', 
      icon: 'BOOK_OPEN' as IconName 
    });
  }

  if (permissions.content_management) {
    items.push({ 
      name: 'Content Management', 
      href: '/content-management', 
      icon: 'BOOKS' as IconName 
    });
  }

  if (permissions.myclasses) {
    items.push({ 
      name: 'My Classes', 
      href: '/MyClasses', 
      icon: 'ChalkboardTeacher' as IconName 
    });
  }

  // Add menu items based on permissions
  if (permissions.schools) {
    items.push({ 
      name: 'Schools', 
      href: '/schools', 
      icon: 'BUILDING' as IconName 
    });
  }

  if (permissions.schools || permissions.staff) {
    items.push({ 
      name: 'Students', 
      href: '/students', 
      icon: 'USERS' as IconName 
    });
  }

  if (permissions.sales) {
    items.push({ 
      name: 'Sales', 
      href: '/sales', 
      icon: 'DollarSign' as IconName 
    });
  }

  if (permissions.content) {
    items.push({
      name: 'Content',
      icon: 'FOLDER' as IconName,
      submenu: [
        { 
          name: 'View Content', 
          href: '/content/view', 
          icon: 'Eye' as IconName 
        },
        { 
          name: 'Edit Content', 
          href: '/content/edit', 
          icon: 'Edit' as IconName
        },
        {
          name: 'Lesson Management',
          href: '/content/lesson-management',
          icon: 'BookOpen' as IconName
        }
      ]
    });
  }

  if (permissions.development) {
    items.push({ 
      name: 'Development', 
      href: '/development', 
      icon: 'Code' as IconName 
    });
  }

  if (permissions.infrastructure) {
    items.push({ 
      name: 'Infrastructure', 
      href: '/infrastructure', 
      icon: 'Server' as IconName 
    });
  }

  if (permissions.finance) {
    items.push({
      name: 'Finance',
      icon: 'DollarSign' as IconName,
      submenu: [
        {
          name: 'Overview',
          href: '/finance',
          icon: 'BarChart' as IconName
        },
        {
          name: 'Invoices',
          href: '/finance/invoices',
          icon: 'FileText' as IconName
        },
        {
          name: 'Payments',
          href: '/finance/payments',
          icon: 'CreditCard' as IconName
        }
      ]
    });
  }

  if (permissions.staff) {
    items.push({ 
      name: 'Staff', 
      href: '/staff', 
      icon: 'USERS' as IconName 
    });
  }

  if (permissions.schedule) {
    items.push({ 
      name: 'Schedule', 
      href: '/schedule', 
      icon: 'CALENDAR' as IconName 
    });
  }

  if (permissions.reports) {
    items.push({ 
      name: 'Reports', 
      href: '/reports', 
      icon: 'FileBarChart' as IconName 
    });
  }

  // Events are available for all roles but with different permissions
  items.push({ 
    name: 'Events', 
    href: '/events', 
    icon: 'CALENDAR' as IconName 
  });

  // Error Test only for technical roles
  if (role === 'super_admin' || role === 'technical_head' || role === 'developer') {
    items.push({ 
      name: 'Error Test', 
      href: '/error-test', 
      icon: 'AlertTriangle' as IconName 
    });
  }

  // Settings based on permissions
  if (permissions.settings) {
    items.push({ 
      name: 'Settings', 
      href: '/settings', 
      icon: 'GEAR' as IconName 
    });
  }

  return items;
};

