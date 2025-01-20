'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Icon, PhosphorIconName } from '@/components/ui/icons';
import { useSupabase } from '@/providers/supabase-provider';
import type { Role } from '@/types/user';

interface NavigationItem {
  title: string;
  href: string;
  icon: PhosphorIconName;
  roles: Role[];
}

const navigationItems: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'BOOK_OPEN',
    roles: ['SUPER_ADMIN', 'ADMIN', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL', 'TEACHER_HEAD']
  },
  {
    title: 'Content Management',
    href: '/content-management',
    icon: 'FOLDERS_PLUS',
    roles: ['SUPER_ADMIN', 'ADMIN', 'TEACHER_HEAD']
  },
  {
    title: 'My Classes',
    href: '/my-classes',
    icon: 'GRADUATION_CAP',
    roles: ['SUPER_ADMIN', 'ADMIN', 'SALES_HEAD', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL', 'TEACHER_HEAD', 'TEACHER', 'STUDENT']
  },
  {
    title: 'Users',
    href: '/users',
    icon: 'USERS',
    roles: ['SUPER_ADMIN', 'ADMIN', 'SCHOOL_LEADER']
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: 'BOOK_OPEN',
    roles: ['SUPER_ADMIN', 'ADMIN', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL', 'TEACHER_HEAD']
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: 'LOCK_SIMPLE',
    roles: ['SUPER_ADMIN', 'ADMIN', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL', 'TEACHER_HEAD', 'TEACHER']
  }
];

export function NavigationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useSupabase();
  const userRole = user?.user_metadata?.role as Role;

  const filteredNavItems = navigationItems.filter(
    item => item.roles.includes(userRole)
  );

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r bg-background lg:block">
        <nav className="space-y-1 p-4">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon 
                  type="phosphor"
                  name={item.icon}
                  className="h-4 w-4"
                  weight={isActive ? "fill" : "regular"}
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </main>
    </div>
  );
} 