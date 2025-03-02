import React from 'react';
import { ToastProvider as InternalToastProvider } from '@/components/ui/Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InternalToastProvider>
      {children}
    </InternalToastProvider>
  );
} 