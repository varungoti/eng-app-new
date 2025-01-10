import React from 'react';
import { Sun, Moon, Palette, Eye } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import type { Theme } from '../lib/themes';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; icon: React.ElementType; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'gray', icon: Palette, label: 'Gray' },
    { value: 'contrast', icon: Eye, label: 'High Contrast' },
  ];

  return (
    <div className="flex items-center space-x-2 px-4 py-2">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded-lg flex items-center space-x-2 transition-colors ${
            theme === value
              ? 'bg-indigo-100 text-indigo-700'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={label}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;