'use client';

import { Loader as Loader2 } from '@phosphor-icons/react';
import { monitors } from '../../lib/monitoring';
import { useEffect, useState } from 'react';

interface LoadingUIProps {
  component: string;
}

export function LoadingUI({ component }: LoadingUIProps) {
  const [state, setState] = useState<any>(null);

  useEffect(() => {
    try {
      setState(monitors.loadingMonitor.getLoadingState(component));
      const interval = setInterval(() => {
        setState(monitors.loadingMonitor.getLoadingState(component));
      }, 100);

      return () => clearInterval(interval);
    } catch (error) {
      console.warn('Loading monitor not available:', error);
      return () => {};
    }
  }, [component]);

  if (!state?.isLoading) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Loading {component}</h3>
        <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
      </div>
      {state.duration && (
        <div className="text-sm text-gray-600">
          Duration: {state.duration.toFixed(0)}ms
        </div>
      )}
    </div>
  );
} 