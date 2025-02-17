"use client";

import { Suspense, useEffect } from "react";
import { LearningPathTeacher } from "@/components/common/learningpathTeacher";
import StudentProgress from "@/components/teacher/StudentProgress";
import UpcomingClasses from "@/components/teacher/UpcomingClasses";
// import { useLockStore } from "@/lib/store/lockStore";
// import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logger } from "@/lib/logger";
import LessonErrorBoundary from "@/components/LessonErrorBoundary";
import { useLocation } from "react-router-dom";

function LoadingComponent() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

// Add performance monitoring
const usePageLoadMetrics = () => {
  useEffect(() => {
    const pageLoadTime = window.performance.now();
    
    logger.info('Teacher lessons page mounted', {
      source: 'TeacherLessonsPage',
      context: {
        loadTime: `${pageLoadTime.toFixed(2)}ms`,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    });

    return () => {
      const pageUnloadTime = window.performance.now();
      logger.info('Teacher lessons page unmounted', {
        source: 'TeacherLessonsPage',
        context: {
          totalTime: `${(pageUnloadTime - pageLoadTime).toFixed(2)}ms`,
          timestamp: new Date().toISOString()
        }
      });
    };
  }, []);
};

export default function TeacherLessonsPage() {
  const location = useLocation();
  usePageLoadMetrics();

  // Log navigation state
  useEffect(() => {
    logger.info('Teacher lessons page navigation', {
      source: 'TeacherLessonsPage',
      context: {
        pathname: location.pathname,
        search: location.search,
        state: location.state,
        timestamp: new Date().toISOString()
      }
    });
  }, [location]);

  // const isCoursesLocked = useLockStore((state) => state.isCoursesLocked);
  // const unlockCourses = useLockStore((state) => state.unlockCourses);

  // if (isCoursesLocked) {
  //   return (
  //     <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
  //       <div className="text-center space-y-4 p-8 rounded-lg bg-white dark:bg-gray-800 shadow-lg">
  //         <Lock className="w-16 h-16 mx-auto text-gray-400" />
  //         <h1 className="text-2xl font-bold">This Section is Locked</h1>
  //         <p className="text-gray-500">This section is currently locked for maintenance or updates.</p>
  //         <Button onClick={unlockCourses} variant="outline">
  //           Unlock Section
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <LessonErrorBoundary source="TeacherLessonsPage">
      <div className="w-full flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
        {/* Main content area */}
        <main className="w-full flex-grow p-1 md:p-2">
          <Suspense fallback={<LoadingComponent />}>
            <LearningPathTeacher />
          </Suspense>
        </main>
 
        <aside className="w-full max-w-lg"> 
          <div className="sticky top-0 p-4 md:p-6 space-y-4">
            <Suspense fallback={<LoadingComponent />}>
              <UpcomingClasses />
            </Suspense>
            <Suspense fallback={<LoadingComponent />}>
              <StudentProgress />
            </Suspense>
          </div>
        </aside>
      </div>
    </LessonErrorBoundary>
  );
}
