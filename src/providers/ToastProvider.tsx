import React from 'react';
import { ToastProvider as InternalToastProvider } from '@/components/ui/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <InternalToastProvider>
      {children}
    </InternalToastProvider>
  );
} 