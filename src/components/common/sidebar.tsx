import { useState, useEffect } from 'react';
import Link from "next/link";
import { useTheme } from 'next-themes';
import { Icon } from "@/components/ui/icons";
import { APP_ICONS } from "@/lib/constants/icons";
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  className?: string;
  currentPath: string;
  sidebarItems: Array<{
    href: string;
    label: string;
    icon: keyof typeof APP_ICONS;
    isActive?: boolean;
  }>;
}

export default function Sidebar({ className = "", sidebarItems, currentPath }: SidebarProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  // Persist locked state in localStorage
  useEffect(() => {
    const savedLockState = localStorage.getItem('sidebarLocked');
    if (savedLockState !== null) {
      setIsLocked(JSON.parse(savedLockState));
    }
  }, []);

  const toggleLock = () => {
    const newLockState = !isLocked;
    setIsLocked(newLockState);
    localStorage.setItem('sidebarLocked', JSON.stringify(newLockState));
  };

  const toggleCollapse = () => {
    if (!isLocked) {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Debug log the sidebar items
  console.log('Sidebar Items:', {
    count: sidebarItems.length,
    items: sidebarItems.map(item => ({
      label: item.label,
      href: item.href,
      icon: item.icon
    }))
  });

  console.log('Rendering Sidebar with items:', 
    sidebarItems.map(item => ({
      label: item.label,
      href: item.href,
      isActive: item.isActive
    }))
  );

  // Debug sidebar items before render
  console.log('Sidebar Render:', {
    itemCount: sidebarItems.length,
    items: sidebarItems.map(item => ({
      label: item.label,
      href: item.href,
      icon: item.icon,
      isActive: currentPath === item.href
    }))
  });

  return (
    <div 
      className={cn(
        "flex flex-col h-full transition-all duration-300 bg-background border-r",
        isCollapsed ? 'w-16' : 'w-72',
        className
      )}
    >
      {/* Header with Lock/Unlock */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-primary">
            <span className="text-[#3C4DFF]">Engspiration</span>
          </h1>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLock}
            className="hover:bg-accent"
          >
            <Icon name={APP_ICONS.LOCK} className={cn(
              "h-4 w-4 transition-colors",
              isLocked ? "text-primary" : "text-muted-foreground"
            )} />
          </Button>
          {!isLocked && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              className="hover:bg-accent"
            >
              {isCollapsed ? '→' : '←'}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={`${item.href}-${index}`}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={currentPath === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full justify-start"
        >
          {theme === 'dark' ? (
            <>
              <Icon name={APP_ICONS.SUN} className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Light Mode</span>}
            </>
          ) : (
            <>
              <Icon name={APP_ICONS.MOON} className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Dark Mode</span>}
            </>
          )}
        </Button>

        {user && !isCollapsed && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Signed in as {user.name}
            </p>
            <Button
              variant="destructive"
              onClick={logout}
              className="w-full"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ 
  icon, 
  label, 
  href, 
  isActive, 
  isCollapsed 
}: { 
  icon: keyof typeof APP_ICONS;
  label: string; 
  href: string; 
  isActive: boolean;
  isCollapsed: boolean;
}) {
  // Debug icon rendering
  console.log('Rendering SidebarItem:', {
    label,
    icon,
    iconValue: APP_ICONS[icon],
    exists: icon in APP_ICONS
  });

  const iconName = APP_ICONS[icon];
  if (!iconName) {
    console.warn(`Icon not found: ${icon}`);
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-2 py-2 rounded-md transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-primary/10 text-primary",
        isCollapsed ? "justify-center" : "justify-start"
      )}
    >
      <Icon 
        name={iconName || 'FileText'}
        className={cn(
          "flex-shrink-0",
          isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
        )} 
      />
      {!isCollapsed && <span className="text-sm">{label}</span>}
    </Link>
  );
}