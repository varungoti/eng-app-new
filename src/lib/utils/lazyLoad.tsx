import React, { Suspense } from 'react';
import { logger } from '../logger';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

interface LazyLoadOptions {
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
  loadingDelay?: number;
  retryCount?: number;
  timeout?: number;
  name?: string;
}

export const lazyLoad = <T extends Record<string, unknown> = Record<string, unknown>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: LazyLoadOptions = {}
) => {
  const {
    fallback,
    errorBoundary = true, // Always use error boundary by default
    loadingDelay = 300,
    retryCount = 3,
    timeout = 10000,
    name = 'Component'
  } = options;

  // Create isolated error boundary for this component
  const ComponentErrorBoundary = ({ children }: { children: React.ReactNode }) => (
    <ErrorBoundary 
      source={name}
    >
      {children}
    </ErrorBoundary>
  );
  const LazyComponent = React.lazy(() => {
    const startTime = Date.now();
    let attempts = 0;
    
    const loadComponent = async (): Promise<{ default: React.ComponentType<T> }> => {
      try {
        const componentModule = await importFn();
        if (!componentModule?.default) {
          throw new Error(`Module ${name} does not have a default export`);
        }
        return componentModule;
      } catch (err) {
        attempts++;
        if (attempts >= retryCount) {
          throw err;
        }
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, loadingDelay * Math.pow(2, attempts - 1)));
        return loadComponent();
      }
    };

    return new Promise<{ default: React.ComponentType<T> }>((resolve) => {
      const timeoutId = setTimeout(() => {
        resolve({
          default: () => (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-lg font-medium text-red-800">Failed to load {name.toLowerCase()}</h3>
              <p className="mt-2 text-sm text-red-600">
                Please try refreshing the page. If the problem persists, contact support.
              </p>
            </div>
          )
        });
      }, timeout);

      loadComponent()
        .then(componentModule => {
          clearTimeout(timeoutId);
          logger.debug(`${name} loaded successfully`, {
            context: { loadTime: Date.now() - startTime },
            source: 'lazyLoad'
          });
          resolve(componentModule);
        })
        .catch(err => {
          clearTimeout(timeoutId);
          logger.error(`Failed to load ${name}`, {
            context: { error: err },
            source: 'lazyLoad'
          });
          resolve({
            default: () => (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-medium text-red-800">Failed to load {name.toLowerCase()}</h3>
                <p className="mt-2 text-sm text-red-600">
                  Please try refreshing the page. If the problem persists, contact support.
                </p>
              </div>
            )
          });
        });
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function WrappedComponent(props: T) {
    const Wrapper = errorBoundary ? ErrorBoundary : React.Fragment;
    const wrapperProps = errorBoundary ? { source: name } : {};

    return (
      <Wrapper {...wrapperProps}>
        <Suspense fallback={fallback || <LoadingSpinner message={`Loading ${name.toLowerCase()}...`} />}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <LazyComponent {...props as any} />
        </Suspense>
      </Wrapper>
    );
  };
};