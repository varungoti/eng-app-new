import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../lib/logger';

interface Props {
  children: ReactNode;
  source: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Prevent error propagation
    error.stopPropagation?.();

    // Handle specific component errors
    if (this.props.source === 'LessonManagement') {
      logger.error('Lesson management error', {
        context: {
          error: error.message,
          componentStack: errorInfo.componentStack
        },
        source: 'LessonManagement'
      });
    }

    logger.error('Component error caught', {
      context: { 
        error: error.message,
        componentStack: errorInfo.componentStack,
        source: this.props.source
      },
      source: 'ErrorBoundary'
    });
  }

  public render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An error occurred';
      
      return this.props.fallback || (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">
            {this.props.source === 'BuggyComponent' ? 'Test Error Caught' : 'Component Error'}
          </h3>
          <p className="mt-2 text-sm text-red-600">
            {errorMessage}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;