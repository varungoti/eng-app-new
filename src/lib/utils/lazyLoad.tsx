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

export const lazyLoad = (
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
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
      fallback={
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">
            Failed to load {name.toLowerCase()}
          </h3>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 underline"
          >
            Retry loading
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
  const LazyComponent = React.lazy(() => {
    const startTime = Date.now();
    let attempts = 0;
    
    const loadComponent = async (): Promise<{ default: React.ComponentType<any> }> => {
      try {
        const module = await importFn();
        if (!module?.default) {
          throw new Error(`Module ${name} does not have a default export`);
        }
        return module;
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

    return new Promise((resolve) => {
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
        .then(module => {
          clearTimeout(timeoutId);
          logger.debug(`${name} loaded successfully`, {
            context: { loadTime: Date.now() - startTime },
            source: 'lazyLoad'
          });
          resolve(module);
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

  return function WrappedComponent(props: any) {
    const Wrapper = errorBoundary ? ErrorBoundary : React.Fragment;
    const wrapperProps = errorBoundary ? { source: name } : {};

    return (
      <Wrapper {...wrapperProps}>
        <Suspense fallback={fallback || <LoadingSpinner message={`Loading ${name.toLowerCase()}...`} />}>
          <LazyComponent {...props} />
        </Suspense>
      </Wrapper>
    );
  };
};