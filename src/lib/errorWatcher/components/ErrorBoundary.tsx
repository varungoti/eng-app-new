import  { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorWatcher } from '../ErrorWatcher';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  source: string;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Handle simulated errors differently
    const isSimulatedError = error.message.includes('simulated') || 
                            this.props.source === 'BuggyComponent' ||
                            this.props.source === 'ErrorTest';
    
    ErrorWatcher.getInstance().trackError({
      message: error.message,
      severity: isSimulatedError ? 'info' : 'error',
      context: {
        name: error.name,
        stack: error.stack,
        isSimulated: isSimulatedError
      },
      componentStack: errorInfo.componentStack || '',
      source: this.props.source,
    });
  }

  public render() {
    if (this.state.hasError) {
      const isTestError = this.props.source === 'BuggyComponent';
      return this.props.fallback || (
        <div className={`p-4 ${isTestError ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'} border rounded-lg`}>
          <h2 className={`text-lg font-medium ${isTestError ? 'text-blue-800' : 'text-red-800'}`}>
            {isTestError ? 'Test Error Caught' : 'Something went wrong'}
          </h2>
          <p className={`mt-2 text-sm ${isTestError ? 'text-blue-600' : 'text-red-600'}`}>
            An error occurred while rendering this component. Please try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}