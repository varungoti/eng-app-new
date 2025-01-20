'use client';

import { useEffect } from 'react';
import { ThemeProvider } from "next-themes";
import ErrorBoundary from '@/components/ErrorBoundary';
import { checkApiHealth } from "@/services/api";
import { Providers } from "@/components/common/providers";
import { logger } from '@/lib/logger';

export function RootLayoutClient({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await checkApiHealth();
        logger.info('API health status', {
          context: { isHealthy },
          source: 'RootLayoutClient'
        });
      } catch (error) {
        logger.error('Failed to check API health', {
          context: { error: error instanceof Error ? error.message : String(error) },
          source: 'RootLayoutClient'
        });
      }
    };

    checkHealth();
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
        <ErrorBoundary source="RootLayout">
          {children}
        </ErrorBoundary>
      </ThemeProvider>
    </Providers>
  );
} 