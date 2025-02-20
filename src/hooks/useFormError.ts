"use client";

import { useState } from 'react';
import { toast } from '@/components/ui/toast';

export function useFormError() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (error: unknown) => {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    setError(message);
    toast({
      title: 'Error',
      description: message,
      variant: 'destructive'
    });
  };

  const clearError = () => setError(null);

  return {
    error,
    handleError,
    clearError
  };
} 