'use client';

import { useEffect } from 'react';
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from './ErrorBoundary';
import { checkApiHealth } from "@/services/api";
import { Providers } from "@/components/common/providers";

export function RootLayoutClient({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    checkApiHealth().then(isHealthy => {
      console.log('API is healthy:', isHealthy);
    });
  }, []);

  return (
    <Providers>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="theme"
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </ThemeProvider>
    </Providers>
  );
} 