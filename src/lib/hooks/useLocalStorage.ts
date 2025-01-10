import { useState, useEffect } from 'react';
import { logger } from '../logger';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      logger.error('Failed to read from localStorage', {
        context: { key, error },
        source: 'useLocalStorage'
      });
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      logger.error('Failed to write to localStorage', {
        context: { key, error },
        source: 'useLocalStorage'
      });
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}