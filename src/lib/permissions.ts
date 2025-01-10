import type { UserRole } from '../types/roles';
import { ROLE_PERMISSIONS } from '../types/roles';
import * as Icons from 'lucide-react';

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

// Get navigation items based on role permissions
export const getNavigationItems = (role: string) => {
  const permissions = ROLE_PERMISSIONS[role]?.permissions;
  if (!permissions) return [];

  const items = [];

  // Dashboard is available for all roles
  items.push({ 
    name: 'Dashboard', 
    href: '/dashboard',
    icon: 'LayoutDashboard' 
  });

  // Add menu items based on permissions
  if (permissions.schools) {
    items.push({ 
      name: 'Schools', 
      href: '/schools', 
      icon: 'Building2' 
    });
  }

  if (permissions.schools || permissions.staff) {
    items.push({ 
      name: 'Students', 
      href: '/students', 
      icon: 'Users' 
    });
  }

  if (permissions.sales) {
    items.push({ 
      name: 'Sales', 
      href: '/sales', 
      icon: 'DollarSign' 
    });
  }

  if (permissions.content) {
    items.push({
      name: 'Content',
      icon: 'FileText',
      submenu: [
        { 
          name: 'View Content', 
          href: '/content/view', 
          icon: 'Eye' 
        },
        { 
          name: 'Edit Content', 
          href: '/content/edit', 
          icon: 'Edit'
        },
        {
          name: 'Lesson Management',
          href: '/content/lesson-management',
          icon: 'BookOpen'
        }
      ]
    });
  }

  if (permissions.development) {
    items.push({ 
      name: 'Development', 
      href: '/development', 
      icon: 'Code' 
    });
  }

  if (permissions.infrastructure) {
    items.push({ 
      name: 'Infrastructure', 
      href: '/infrastructure', 
      icon: 'Server' 
    });
  }

  if (permissions.finance) {
    items.push({
      name: 'Finance',
      icon: 'DollarSign',
      submenu: [
        {
          name: 'Overview',
          href: '/finance',
          icon: 'BarChart'
        },
        {
          name: 'Invoices',
          href: '/finance/invoices',
          icon: 'FileText'
        },
        {
          name: 'Payments',
          href: '/finance/payments',
          icon: 'CreditCard'
        }
      ]
    });
  }

  if (permissions.staff) {
    items.push({ 
      name: 'Staff', 
      href: '/staff', 
      icon: 'Users' 
    });
  }

  if (permissions.schedule) {
    items.push({ 
      name: 'Schedule', 
      href: '/schedule', 
      icon: 'Calendar' 
    });
  }

  if (permissions.reports) {
    items.push({ 
      name: 'Reports', 
      href: '/reports', 
      icon: 'FileBarChart' 
    });
  }

  // Events are available for all roles but with different permissions
  items.push({ 
    name: 'Events', 
    href: '/events', 
    icon: 'Calendar' 
  });

  // Error Test only for technical roles
  if (role === 'super_admin' || role === 'technical_head' || role === 'developer') {
    items.push({ 
      name: 'Error Test', 
      href: '/error-test', 
      icon: 'AlertTriangle' 
    });
  }

  // Settings based on permissions
  if (permissions.settings) {
    items.push({ 
      name: 'Settings', 
      href: '/settings', 
      icon: 'Settings' 
    });
  }

  return items;
};