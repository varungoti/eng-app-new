"use client";
import React, { createContext, ReactNode, useContext } from 'react';
import { useTheme } from 'next-themes';
import { themes } from '@/lib/themes';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

interface ThemeContextProps {
  children: ReactNode;
}

type ThemeContextType = {
  currentTheme: typeof themes.light;
};

const ThemeContext = createContext<ThemeContextType>({ currentTheme: themes.light });

export function ThemeContextProvider({ children }: ThemeContextProps) {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes] || themes[resolvedTheme as keyof typeof themes] || themes.light;

  return (
    <ThemeContext.Provider value={{ currentTheme }}>
      <NextThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        {children}
      </NextThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useCurrentTheme = () => useContext(ThemeContext);