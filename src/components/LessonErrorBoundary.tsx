import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { logger } from "@/lib/logger";

interface Props {
  children: React.ReactNode;
  source?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

export default class LessonErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Lesson component error caught', {
      source: this.props.source || 'LessonErrorBoundary',
      context: {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        retryCount: this.state.retryCount
      }
    });

    // Store error state in sessionStorage for recovery
    try {
      sessionStorage.setItem('lessonErrorState', JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString(),
        retryCount: this.state.retryCount
      }));
    } catch (err) {
      logger.warn('Failed to store error state', { error: err });
    }
  }

  handleRetry = () => {
    const newRetryCount = this.state.retryCount + 1;
    
    logger.info('Retrying lesson component', {
      source: this.props.source || 'LessonErrorBoundary',
      context: { retryCount: newRetryCount }
    });

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: newRetryCount
    });
  };

  handleNavigateBack = () => {
    logger.info('Navigating back from error state', {
      source: this.props.source || 'LessonErrorBoundary'
    });
    
    // Clean up error state
    sessionStorage.removeItem('lessonErrorState');
    
    // Use window.history to navigate back
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/teacher/lessons';
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Error Loading Lesson
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {this.state.error?.message || 'An unexpected error occurred while loading the lesson.'}
              </p>
              
              <div className="flex flex-col gap-2">
                {this.state.retryCount < 3 && (
                  <Button 
                    onClick={this.handleRetry}
                    className="w-full"
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry ({3 - this.state.retryCount} attempts remaining)
                  </Button>
                )}
                
                <Button 
                  onClick={this.handleNavigateBack}
                  variant="default"
                  className="w-full"
                >
                  Return to Lessons
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p className="text-xs font-mono whitespace-pre-wrap">
                    {this.state.error?.stack}
                  </p>
                  {this.state.errorInfo && (
                    <p className="text-xs font-mono whitespace-pre-wrap mt-2">
                      {this.state.errorInfo.componentStack}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
