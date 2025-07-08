"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useOnboardingWithSchoolId } from '@/hooks/useOnboarding';
import OnboardingProgress from '@/components/OnboardingProgress';
import OnboardingSteps from '@/components/school/OnboardingSteps';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function SchoolOnboardingPage() {
  const { schoolId } = useParams();
  const { 
    tasks, 
    progress, 
    stats, 
    loading, 
    error,
    updateProgress,
    refresh 
  } = useOnboardingWithSchoolId(schoolId as string);

  useEffect(() => {
    refresh();
  }, [schoolId, refresh]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !tasks || !stats) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error || "Failed to load onboarding data"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">School Onboarding</h1>
        <p className="text-gray-600">Complete these steps to set up your school</p>
      </div>

      {/* Progress Overview */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Overall Progress</p>
            <p className="text-2xl font-semibold text-primary">
              {Math.round((stats?.completedTasks / (stats?.totalTasks || 1)) * 100)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed Tasks</p>
            <p className="text-2xl font-semibold text-green-600">
              {stats?.completedTasks || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending Tasks</p>
            <p className="text-2xl font-semibold text-yellow-600">
              {(stats?.totalTasks || 0) - (stats?.completedTasks || 0)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Required Remaining</p>
            <p className="text-2xl font-semibold text-red-600">
              {stats?.remainingRequired || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Onboarding Steps */}
      <OnboardingSteps
        schoolId={schoolId as string}
        onComplete={() => refresh()}
      />

      {/* Task Progress */}
      <div className="mt-8">
        <OnboardingProgress
          tasks={tasks}
          progress={progress}
          onUpdateProgress={updateProgress}
        />
      </div>
    </div>
  );
} 