import { APP_ICONS } from '@/lib/constants/icons';

export interface NavigationItem {
  label: string;
  href: string;
  icon: keyof typeof APP_ICONS;
  isActive: boolean;
}

export type NavigationItems = NavigationItem[]; 