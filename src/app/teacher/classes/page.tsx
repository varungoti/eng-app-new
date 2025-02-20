"use client";

import { ClassTabs } from "@/components/common/ClassTab";
import { CourseCard } from "@/components/common/CourseCard";
import { useClasses } from "@/hooks/useApiQueries";
import React, { useState, useCallback, useTransition, useRef, useEffect, useMemo } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Users,
  GraduationCap,
  Trophy,
  Target,
  AlertCircle,
  RefreshCcw
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Debug logger
const DEBUG = true;
const debugLog = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[Classes] ${message}`, data ? data : '');
  }
};

// Types
interface ClassAttributes {
  name: string;
  description: string;
  grade?: {
    id: string;
    name: string;
  };
  students: any[];
  lessons: any[];
}

interface Class {
  id: string;
  attributes: ClassAttributes;
}

// Memoized error component to prevent unnecessary re-renders
const ErrorDisplay = React.memo(({ 
  errorDetails, 
  onRetry 
}: { 
  errorDetails: { title: string; message: string; error?: Error }; 
  onRetry: () => void;
}) => (
  <div className="container mx-auto px-4 py-8">
    <Card className="border-destructive">
      <CardContent className="pt-6">
        <div className="text-destructive text-center space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <div>
            <p className="text-lg font-semibold">{errorDetails.title}</p>
            <p className="text-sm mt-2">{errorDetails.message}</p>
            {errorDetails.error && (
              <pre className="mt-4 p-4 bg-destructive/10 rounded text-left text-xs overflow-auto">
                {JSON.stringify(errorDetails.error, null, 2)}
              </pre>
            )}
            <Button 
              variant="outline" 
              onClick={onRetry}
              className="mt-4"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Retry Loading Classes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
));

ErrorDisplay.displayName = 'ErrorDisplay';

// Memoized empty state component
const EmptyState = React.memo(() => (
  <div className="container mx-auto px-4 py-8">
    <Card>
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <div>
            <p className="text-lg font-semibold">No Classes Found</p>
            <p className="text-sm text-muted-foreground mt-2">
              You don't have any classes yet. Create your first class to get started.
            </p>
            <Button 
              variant="default" 
              className="mt-4"
            >
              Create New Class
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
));

EmptyState.displayName = 'EmptyState';

function Classes() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // Component state
  const [isPending, startTransition] = useTransition();
  const mountedRef = useRef(true);
  const errorRef = useRef<Error | null>(null);
  const initialLoadRef = useRef(false);
  
  // Classes query with error handling - only fetch when auth is ready
  const { 
    data: classesData, 
    isLoading: classesLoading, 
    error: classesError,
    refetch 
  } = useClasses(user?.id || '');

  // Debug logging for auth state - only log on mount or real changes
  useEffect(() => {
    if (!initialLoadRef.current || mountedRef.current) {
      debugLog('Auth state changed:', { user, authLoading });
      initialLoadRef.current = true;
    }
  }, [user, authLoading]);

  // Debug logging for data state - only log actual changes
  useEffect(() => {
    if (mountedRef.current) {
      debugLog('Classes data state:', { 
        hasData: !!classesData, 
        isLoading: classesLoading, 
        error: classesError 
      });
    }
  }, [classesData, classesLoading, classesError]);

  // Local state with proper types
  const selectedClassRef = useRef<Class | null>(null);
  const [showError, setShowError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{ 
    title: string; 
    message: string; 
    type: 'data' | 'other';
    error?: Error;
  } | null>(null);
  const { toast } = useToast();

  // Memoized classes data with proper typing and validation
  const classes = useMemo<Class[]>(() => {
    if (!user?.id) return [];

    try {
      if (!classesData?.data) {
        if (mountedRef.current) {
          debugLog('No classes data available:', classesData);
        }
        return [];
      }

      return classesData.data
        .filter((cls: any): cls is Class => {
          const isValid = cls && cls.id && cls.attributes;
          if (!isValid && mountedRef.current) {
            debugLog('Invalid class object structure:', cls);
          }
          return isValid;
        })
        .map((cls: Class) => ({
          ...cls,
          attributes: {
            ...cls.attributes,
            students: cls.attributes.students || [],
            lessons: cls.attributes.lessons || [],
          }
        }));
    } catch (error) {
      if (mountedRef.current) {
        debugLog('Error processing classes data:', error);
      }
      return [];
    }
  }, [classesData, user]);

  // Error effect with cleanup and type safety
  useEffect(() => {
    if (!mountedRef.current) return;

    if (classesError || errorRef.current) {
      const error = classesError || errorRef.current;
      setErrorDetails({
        title: 'Error Loading Classes',
        message: error?.message || 'Failed to load classes. Please try again.',
        type: 'data',
        error: error as Error
      });
      setShowError(true);
    }
  }, [classesError]);

  // Cleanup effect
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      initialLoadRef.current = false;
    };
  }, []);

  // Memoized handlers with proper typing
  const handleClassSelect = useCallback((classId: string) => {
    if (!mountedRef.current) return;

    try {
      const selected = classes.find((cls) => cls.id.toString() === classId);
      if (!selected) {
        throw new Error(`Class with ID ${classId} not found`);
      }
      selectedClassRef.current = selected;
      startTransition(() => {
        navigate(`/teacher/classes/${classId}`, { replace: true });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error)?.message || "Failed to select class",
        variant: "destructive",
      });
    }
  }, [classes, toast, navigate]);

  // Loading states - show auth loading first
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner 
          message="Checking authentication..."
          showProgress={true}
          timeout={15000}
        />
      </div>
    );
  }

  // Check if user is authenticated
  if (!user?.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <div>
                <p className="text-lg font-semibold">Authentication Required</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please sign in to view your classes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state for classes data
  if (classesLoading || isPending) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner 
          message="Loading your classes..."
          showProgress={true}
          timeout={15000}
        />
      </div>
    );
  }

  // Error state
  if (showError && errorDetails) {
    return <ErrorDisplay errorDetails={errorDetails} onRetry={refetch} />;
  }

  // Empty state
  if (classes.length === 0) {
    return <EmptyState />;
  }

  // Main content
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              My Classes
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor your English language classes
            </p>
          </div>
          <Badge variant="secondary" className="px-4 py-2">
            <Users className="h-4 w-4 mr-2" />
            {classes.length} Active Classes
          </Badge>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Total Students
              </CardTitle>
              <div className="text-3xl font-bold text-primary">
                {classes.reduce((acc, cls) => acc + (cls.attributes.students?.length || 0), 0)}
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-secondary/5 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="h-5 w-5 mr-2 text-secondary" />
                Active Lessons
              </CardTitle>
              <div className="text-3xl font-bold text-secondary">
                {classes.reduce((acc, cls) => acc + (cls.attributes.lessons?.length || 0), 0)}
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <GraduationCap className="h-5 w-5 mr-2 text-accent" />
                Total Grades
              </CardTitle>
              <div className="text-3xl font-bold text-accent">
                {new Set(classes.map(cls => cls.attributes.grade?.name)).size}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Classes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <CourseCard
              key={cls.id}
              course={{
                id: parseInt(cls.id),
                title: cls.attributes.name,
                description: cls.attributes.description || 'No description available',
                grade: cls.attributes.grade?.name || 'No grade assigned',
                level: cls.attributes.grade?.name,
                progress: 0,
                topicsCount: cls.attributes.lessons?.length || 0
              }}
              onClick={() => handleClassSelect(cls.id.toString())}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Export with error boundary
export default function ClassesWithErrorBoundary() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Classes />
    </ErrorBoundary>
  );
}

// Error boundary fallback
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-destructive text-center space-y-4">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
            <div>
              <p className="text-lg font-semibold">Something went wrong</p>
              <p className="text-sm mt-2">{error.message}</p>
              <Button 
                variant="outline" 
                onClick={resetErrorBoundary}
                className="mt-4"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
