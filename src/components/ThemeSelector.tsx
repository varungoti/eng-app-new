"use client";

'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';

export function ThemeSelector({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { theme, setTheme } = useTheme();

  return (
    <div {...props} className={className}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        <Icon
          type="phosphor"
          name={theme === 'dark' ? 'SUN' : 'MOON'}
          className="h-5 w-5"
        />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}

export default ThemeSelector;