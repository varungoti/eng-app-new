"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from "next/navigation";
import { LucideIcon, FileText, Lock, Sun, Moon, ChevronDown } from "lucide-react";
import { useComponentLogger } from "@/hooks/useComponentLogger";

interface SidebarItem {
  href: string;
  label: string;
  icon: LucideIcon;
  _isActive?: boolean;
  children?: SidebarItem[];
}

interface SidebarProps {
  className?: string;
  currentPath: string;
  sidebarItems: SidebarItem[];
}

export default function Sidebar({ className = "", sidebarItems, currentPath }: SidebarProps) {
  const { logError } = useComponentLogger('Sidebar');
  const { theme, setTheme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const pathname = usePathname();

  try {
    // Persist locked state in localStorage
    useEffect(() => {
      try {
        const savedLockState = localStorage.getItem('sidebarLocked');
        if (savedLockState !== null) {
          setIsLocked(JSON.parse(savedLockState));
        }
      } catch (error) {
        logError(error);
      }
    }, [logError]);

    const toggleLock = () => {
      try {
        const newLockState = !isLocked;
        setIsLocked(newLockState);
        localStorage.setItem('sidebarLocked', JSON.stringify(newLockState));
      } catch (error) {
        logError(error);
      }
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
        isActive: item._isActive
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
              <Lock 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isLocked ? "text-primary" : "text-muted-foreground"
                )} 
              />
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
                currentPath={currentPath}
                nestedItems={item.children}
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
      </div>
    );
  } catch (error) {
    logError(error);
    return <div>Error loading sidebar</div>;
  }
}

function SidebarItem({ 
  icon, 
  label, 
  href, 
  isActive, 
  isCollapsed,
  nestedItems,
  currentPath 
}: { 
  icon: LucideIcon;
  label: string; 
  href: string; 
  isActive: boolean;
  isCollapsed: boolean;
  nestedItems?: SidebarItem[];
  currentPath: string;
}) {
  const { logError } = useComponentLogger('SidebarItem');
  const IconComponent = icon || FileText;
  const [isOpen, setIsOpen] = useState(false);

  try {
    return (
      <div>
        <Link
          href={href}
          className={cn(
            "flex items-center px-2 py-2 rounded-md transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isActive && "bg-primary/10 text-primary",
            isCollapsed ? "justify-center" : "justify-start"
          )}
          onClick={(e) => {
            if (nestedItems && nestedItems.length > 0) {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
        >
          <IconComponent 
            className={cn(
              "flex-shrink-0",
              isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
            )} 
          />
          {!isCollapsed && (
            <>
              <span className="text-sm flex-1">{label}</span>
              {nestedItems && nestedItems.length > 0 && (
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isOpen && "transform rotate-180"
                  )} 
                />
              )}
            </>
          )}
        </Link>
        
        {!isCollapsed && isOpen && nestedItems && nestedItems.length > 0 && (
          <div className="ml-4 mt-1 space-y-1">
            {nestedItems.map((child, index) => (
              <SidebarItem
                key={`${child.href}-${index}`}
                {...child}
                isCollapsed={isCollapsed}
                isActive={currentPath === child.href}
                currentPath={currentPath}
                nestedItems={child.children}
              />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    logError(error);
    return null;
  }
}