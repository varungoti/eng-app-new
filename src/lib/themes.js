/**
 * Theme configuration for the application
 */

export const themes = {
  light: {
    name: 'light',
    background: '#ffffff',
    foreground: '#000000',
    primary: '#0070f3',
    secondary: '#f5f5f5',
    accent: '#ff4081',
    muted: '#f1f1f1',
    border: '#e2e8f0',
    card: {
      background: '#ffffff',
      foreground: '#000000',
      border: '#e2e8f0',
    },
    button: {
      background: '#0070f3',
      foreground: '#ffffff',
      hover: '#0060df',
    },
  },
  dark: {
    name: 'dark',
    background: '#1a1a1a',
    foreground: '#ffffff',
    primary: '#0070f3',
    secondary: '#2d2d2d',
    accent: '#ff4081',
    muted: '#2a2a2a',
    border: '#333333',
    card: {
      background: '#2d2d2d',
      foreground: '#ffffff',
      border: '#333333',
    },
    button: {
      background: '#0070f3',
      foreground: '#ffffff',
      hover: '#0060df',
    },
  },
  system: {
    name: 'system',
  },
};

export const defaultTheme = themes.system;
