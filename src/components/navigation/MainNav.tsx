import { Role } from '@/types/user';

interface MenuItem {
  title: string;
  href: string;
  icon: string;
  roles: Role[];
}

export const menuItems: MenuItem[] = [
  // ... existing items
  {
    title: 'My Classes',
    href: '/my-classes',
    icon: 'GRADUATION_CAP',
    roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_HEAD', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL', 'TEACHER_HEAD', 'TEACHER', 'STUDENT']
  }
]; 