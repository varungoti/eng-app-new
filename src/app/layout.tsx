'use client';

import React from 'react';
import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/toaster';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from "@/lib/utils"
import { fontSans } from "@/lib/fonts"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryClientProvider client={queryClient}>
            <div className="relative min-h-screen">
              <div className="absolute top-4 right-8">
                <ThemeToggle />
              </div>
              {children}
              <Toaster />
              <ReactQueryDevtools initialIsOpen={false} />
            </div>
          </QueryClientProvider>
        </NextThemesProvider>
      </body>
    </html>
  );
} 