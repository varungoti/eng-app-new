import { type LucideIcon } from 'lucide-react';

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission: string;
}

export type NavigationItems = NavigationItem[]; 