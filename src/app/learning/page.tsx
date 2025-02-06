"use client";

import { Suspense } from "react";
import { LearningProvider } from "@/contexts/LearningContext";
import { LearningDashboard } from "@/components/learning/LearningDashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LearningErrorBoundary } from "@/components/learning/ErrorBoundary";

export default function LearningPage() {
  return (
    <LearningProvider>
      <LearningErrorBoundary>
        <div className="container mx-auto p-6">
          <Suspense fallback={<LoadingSpinner />}>
            <LearningDashboard />
          </Suspense>
        </div>
      </LearningErrorBoundary>
    </LearningProvider>
  );
} 