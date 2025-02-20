"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useCourse, useLessons } from "@/hooks/useApiQueries";
import { Sidebar } from "@/components/common/teacher/sidebar";
import { ExerciseContent } from "@/components/common/teacher/exercise-content";
import { CourseCard } from "@/components/common/CourseCard";
import Link from "next/link";
import { useComponentLogger } from "@/hooks/useComponentLogger";

interface Lesson {
  documentId: string;
  name: string;
  description?: string;
}

interface CourseData {
  data: {
    name: string;
    lessons: Lesson[];
  };
}

export default function CoursePage() {
  const { logError } = useComponentLogger('CoursePage');
  const params = useParams();
  const { subLesson } = params;
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const { data: courseData, isLoading, error } = useLessons(subLesson as string);
  // const { data: lessonData } = useLessons(subLesson as string);

  try {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (error) {
      logError(error);
      return <div>Error loading course</div>;
    }

    return (
      <div className="flex h-screen">
        <div className="container  px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">
            {courseData?.data?.name}
          </h1>
          {courseData && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courseData?.data?.lessons?.map((lesson) => (
                <Link
                  href={`/teacher/classes/lesson/${lesson.documentId}`}
                  key={lesson.documentId}
                >
                  <CourseCard key={lesson.documentId} course={lesson} />
                </Link>
              ))}
            </div>
          )}
        </div> 
      </div>
    );
  } catch (error) {
    logError(error);
    return <div>Error loading course page</div>;
  }
}
