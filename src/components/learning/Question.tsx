import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExercisePrompt } from './ExercisePrompt';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Question, ExercisePrompt as ExercisePromptType } from '@/types/learning';

interface QuestionProps {
  question: Question & {
    exercise_prompts: ExercisePromptType[];
  };
  onComplete: (results: any) => Promise<void>;
}

export function QuestionComponent({ question, onComplete }: QuestionProps) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handlePromptComplete = async (promptAnswer: any) => {
    const updatedAnswers = {
      ...answers,
      [question.exercise_prompts[currentPromptIndex].id]: promptAnswer
    };
    setAnswers(updatedAnswers);

    if (currentPromptIndex + 1 < question.exercise_prompts.length) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    } else {
      await onComplete(updatedAnswers);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{question.text}</CardTitle>
        <Progress 
          value={(currentPromptIndex / question.exercise_prompts.length) * 100} 
          className="w-full"
        />
      </CardHeader>
      <CardContent>
        {question.exercise_prompts[currentPromptIndex] && (
          <ExercisePrompt
            prompt={question.exercise_prompts[currentPromptIndex]}
            onComplete={handlePromptComplete}
          />
        )}
      </CardContent>
    </Card>
  );
} 