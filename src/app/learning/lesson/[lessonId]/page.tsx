import { Suspense } from "react";
import { LessonComponent } from "@/components/learning/Lesson";
import { QuizComponent } from "@/components/learning/QuizComponent";

export default function LessonPage() {
  return (
    <>
      <div className="container mx-auto p-6">
        <Suspense fallback={<div>Loading...</div>}>
          <LessonComponent />
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <QuizComponent questions={[]} onComplete={() => {}} />
      </Suspense>
    </>
  );
} 