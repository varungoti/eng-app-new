import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { QuestionComponent } from './Question';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type { Lesson, Question, LessonProgress, ExercisePrompt } from '@/types/learning';
import { Progress } from "@/components/ui/progress";

export function LessonComponent() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<(Question & { exercise_prompts: ExercisePrompt[] })[]>([]);
  const [progress, setProgress] = useState<LessonProgress | null>(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        // Fetch lesson with questions and prompts
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select(`
            *,
            questions:questions!inner (
              *,
              exercise_prompts:exercise_prompts!inner (*)
            )
          `)
          .eq('id', params.lessonId)
          .single();

        if (lessonError) throw lessonError;

        setLesson(lessonData);
        setQuestions(lessonData.questions);

        // Fetch or create progress record
        const { data: progressData, error: progressError } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('lesson_id', params.lessonId)
          .eq('student_id', 'current-user-id') // Replace with actual user ID
          .single();

        if (progressError && progressError.code !== 'PGRST116') {
          throw progressError;
        }

        if (progressData) {
          setProgress(progressData);
          setCurrentQuestionIndex(progressData.progress_data.lastQuestionIndex || 0);
        } else {
          // Create new progress record
          const { data: newProgress, error: createError } = await supabase
            .from('lesson_progress')
            .insert({
              lesson_id: params.lessonId,
              student_id: 'current-user-id', // Replace with actual user ID
              status: 'in_progress',
              progress_data: { lastQuestionIndex: 0, answers: {} }
            })
            .single();

          if (createError) throw createError;
          setProgress(newProgress);
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
        toast({
          title: "Error",
          description: "Failed to load lesson content",
          variant: "destructive"
        });
      }
    };

    fetchLessonData();
  }, [params.lessonId, toast]);

  const handleQuestionComplete = async (questionAnswers: any) => {
    try {
      const nextIndex = currentQuestionIndex + 1;
      const isComplete = nextIndex >= questions.length;

      // Update progress
      const { error: updateError } = await supabase
        .from('lesson_progress')
        .update({
          status: isComplete ? 'completed' : 'in_progress',
          completed_at: isComplete ? new Date().toISOString() : null,
          progress_data: {
            ...progress?.progress_data,
            lastQuestionIndex: nextIndex,
            answers: {
              ...progress?.progress_data.answers,
              [questions[currentQuestionIndex].id]: questionAnswers
            }
          }
        })
        .eq('id', progress?.id);

      if (updateError) throw updateError;

      if (isComplete) {
        toast({
          title: "Lesson Completed!",
          description: "Great job completing this lesson",
        });
        router.push('/learning-path');
      } else {
        setCurrentQuestionIndex(nextIndex);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
    }
  };

  if (!lesson || !questions.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Progress 
              value={(currentQuestionIndex / questions.length) * 100} 
              className="flex-1"
            />
            <span className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
        </CardContent>
      </Card>

      {questions[currentQuestionIndex] && (
        <QuestionComponent
          question={questions[currentQuestionIndex]}
          onComplete={handleQuestionComplete}
        />
      )}
    </div>
  );
} 