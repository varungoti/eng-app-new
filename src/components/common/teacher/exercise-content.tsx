'use client';

import { useState } from 'react';
import { useExercise, useUpdateTeacherProgress } from '@/hooks/useApiQueries';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ExerciseContentProps {
  exerciseId: string;
}

export function ExerciseContent({ exerciseId }: ExerciseContentProps) {
  const { data: exerciseData, isLoading } = useExercise(exerciseId);
  const updateProgress = useUpdateTeacherProgress();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  if (isLoading) return <div>Loading exercise...</div>;

  const questions = exerciseData?.data?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate score
      const correctAnswers = questions.filter(
        (q: any, idx: number) => q.correctAnswer === answers[idx]
      ).length;
      const finalScore = (correctAnswers / questions.length) * 100;
      setScore(finalScore);
      setIsCompleted(true);

      // Update teacher progress
      updateProgress.mutate({
        teacherId: 'mrmftgf6ooqptvw7hu8ki8uy', // This should come from auth context
        data: {
          reward_points: finalScore,
          // Add other progress data as needed
        },
      });
    }
  };

  if (isCompleted) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Exercise Completed!</h2>
        <p className="text-lg mb-4">Your score: {score}%</p>
        <Progress value={score} className="mb-4" />
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{exerciseData?.data?.title}</h2>
        <Progress value={progress} className="mb-2" />
        <p className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">{currentQuestion?.question}</h3>
          {currentQuestion?.type === 'repeat' ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">{currentQuestion.correctAnswer}</p>
              <Button onClick={() => handleAnswer(currentQuestion.correctAnswer)}>
                I have repeated this
              </Button>
            </div>
          ) : (
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Enter your answer"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAnswer((e.target as HTMLInputElement).value);
                }
              }}
            />
          )}
        </div>
      </div>
    </Card>
  );
}