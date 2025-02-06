"use client";

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useTheme } from 'next-themes';
import { Sun, Moon, Lock, LucideIcon } from "lucide-react";
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface SidebarProps {
  className?: string;
  sidebarItems: SidebarItem[];
}

interface SidebarItemProps extends SidebarItem {
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  isActive,
  isCollapsed 
}) => {
  const location = useLocation();
  const active = location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center px-2 py-2 rounded-md transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        active && "bg-primary/10 text-primary",
        isCollapsed ? "justify-center" : "justify-start"
      )}
    >
      <Icon className={cn(
        "flex-shrink-0",
        isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
      )} />
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
};

export default function Sidebar({ className = "", sidebarItems }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
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

  return (
    <aside 
      className={cn(
        "flex flex-col h-full transition-all duration-300 bg-background border-r",
        isCollapsed ? 'w-16' : 'w-72',
        className
      )}
      aria-label="Sidebar"
    >
      {/* Header with Lock/Unlock */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h1 className="text-2xl font-bold text-primary">
            <span className="text-[#3C4DFF]">Eng</span>Engspiration
          </h1>
        )}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLock}
            aria-label={isLocked ? "Unlock sidebar" : "Lock sidebar"}
            className="hover:bg-accent"
          >
            <Lock className={cn(
              "h-4 w-4 transition-colors",
              isLocked ? "text-primary" : "text-muted-foreground"
            )} />
          </Button>
          {!isLocked && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hover:bg-accent"
            >
              {isCollapsed ? '→' : '←'}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        <ScrollArea className="h-[calc(100vh-10rem)]">
          <div className="space-y-1">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.href}
                  className="w-full"
                >
                  <Button
                    variant={location.pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      location.pathname === item.href && "bg-primary/10"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full justify-start"
          aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Light Mode</span>}
            </>
          ) : (
            <>
              <Moon className="h-4 w-4 mr-2" />
              {!isCollapsed && <span>Dark Mode</span>}
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
