import React, { createContext, useState, useContext } from 'react';
import { logger } from '../lib/logger';

interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  addError: (error: string, timeout?: number) => void;
}

const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
  clearError: () => {},
  addError: () => {},
});

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

export const ErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const handleSetError = (newError: string | null) => {
    if (newError) {
      logger.error(newError, {
        source: 'ErrorContext'
      });
    }
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setError(newError);
  };

  const clearError = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setError(null);
  };

  const addError = (newError: string, timeout = 5000) => {
    handleSetError(newError);
    const id = window.setTimeout(clearError, timeout);
    setTimeoutId(id);
  };

  return (
    <ErrorContext.Provider value={{ error, setError: handleSetError, clearError, addError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export { ErrorContext };