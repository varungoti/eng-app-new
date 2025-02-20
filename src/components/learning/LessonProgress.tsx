import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function LessonProgress({ lessonId, studentId }: { lessonId: string, studentId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('progress_data')
        .eq('lesson_id', lessonId)
        .eq('student_id', studentId)
        .single();

      if (data) {
        const totalSteps = data.progress_data.totalSteps || 1;
        const completedSteps = data.progress_data.completedSteps || 0;
        setProgress((completedSteps / totalSteps) * 100);
      }
    };

    fetchProgress();
  }, [lessonId, studentId]);

  return (
    <div className="w-full">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-gray-500 mt-1">{Math.round(progress)}% Complete</p>
    </div>
  );
} 