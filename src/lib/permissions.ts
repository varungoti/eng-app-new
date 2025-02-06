import Classes from '@/app/teacher/classes/page';
import type { UserRole } from '../types/roles';
import { ROLE_PERMISSIONS } from '../types/roles';
import { TEACHER_ROUTES } from './content/routes';
import { 
  Home, 
  Users, 
  Calendar, 
  Settings, 
  BookOpen, 
  BarChart2, 
  FolderOpen,
  GraduationCap,
  School,
  FileText,
  DollarSign,
  Bell,
  Bookmark,
  FolderPlus,
  Building,
  Folders,
  Eye,
  Edit,
  Code,
  ServerIcon,
  CreditCard,
  FileBarChart,
  AlertTriangle,
  LucideCloudHail,
  CloudHailIcon
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';


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
  icon: LucideIcon;
  submenu?: { 
    name: string; 
    href: string; 
    icon: LucideIcon;
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
    icon: Bookmark 
  });

  if (permissions.content) {
    items.push({ 
      name: 'Learning Management', 
      href: '/app/learning', 
      icon: BookOpen
    });
  }

  if (permissions.content_management) {
    items.push({ 
      name: 'Content Management', 
      href: '/content-management', 
      icon: FolderPlus
    });
  }

  if (permissions.myclasses) {
    items.push({ 
      name: 'My Classes', 
      href: TEACHER_ROUTES.LESSONS,
      icon: CloudHailIcon
    });
  }

  // Add menu items based on permissions
  if (permissions.schools) {
    items.push({ 
      name: 'Schools', 
      href: '/schools', 
      icon: Building
    });
  }

  if (permissions.schools || permissions.staff) {
    items.push({ 
      name: 'Students', 
      href: '/students', 
      icon: Users
    });
  }

  if (permissions.sales) {
    items.push({ 
      name: 'Sales', 
      href: '/sales', 
      icon: DollarSign 
    });
  }

  if (permissions.content) {
    items.push({
      name: 'Content',
      icon: Folders,
      submenu: [
        { 
          name: 'View Content', 
          href: '/content/view', 
          icon: Eye 
        },
        { 
          name: 'Edit Content', 
          href: '/content/edit', 
          icon: Edit
        },
        {
          name: 'Lesson Management',
          href: '/content/lesson-management',
          icon: BookOpen 
        }
      ]
    });
  }

  if (permissions.development) {
    items.push({ 
      name: 'Development', 
      href: '/development', 
      icon: Code 
    });
  }

  if (permissions.infrastructure) {
    items.push({ 
      name: 'Infrastructure', 
      href: '/infrastructure', 
      icon: ServerIcon 
    });
  }

  if (permissions.finance) {
    items.push({
      name: 'Finance',
      icon: DollarSign,
      submenu: [
        {
          name: 'Overview',
          href: '/finance',
          icon: BarChart2
        },
        {
          name: 'Invoices',
          href: '/finance/invoices',
          icon: FileText
        },
        {
          name: 'Payments',
          href: '/finance/payments',
          icon: CreditCard
        }
      ]
    });
  }

  if (permissions.staff) {
    items.push({ 
      name: 'Staff', 
      href: '/staff', 
      icon: Users 
    });
  }

  if (permissions.schedule) {
    items.push({ 
      name: 'Schedule', 
      href: '/schedule', 
      icon: Calendar 
    });
  }

  if (permissions.reports) {
    items.push({ 
      name: 'Reports', 
      href: '/reports', 
      icon: FileBarChart 
    });
  }

  // Events are available for all roles but with different permissions
  items.push({ 
    name: 'Events', 
    href: '/events', 
    icon: Calendar 
  });

  // Error Test only for technical roles
  if (role === 'super_admin' || role === 'technical_head' || role === 'developer') {
    items.push({ 
      name: 'Error Test', 
      href: '/error-test', 
      icon: AlertTriangle 
    });
  }

  // Settings based on permissions
  if (permissions.settings) {
    items.push({ 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings 
    });
  }

  return items;
};

