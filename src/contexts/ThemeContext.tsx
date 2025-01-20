import React, { createContext, useContext } from 'react';
import { useTheme } from 'next-themes';
import { themes } from '@/lib/themes';

type ThemeContextType = {
  currentTheme: typeof themes.light;
};

const ThemeContext = createContext<ThemeContextType>({ currentTheme: themes.light });

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes] || themes[resolvedTheme as keyof typeof themes] || themes.light;

  return (
    <ThemeContext.Provider value={{ currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useCurrentTheme = () => useContext(ThemeContext);