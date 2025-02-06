import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle } from "lucide-react";
import type { Question, ExercisePrompt } from "@/types";

interface QuizComponentProps {
  questions: (Question & { exercise_prompts: ExercisePrompt[] })[];
  onComplete: (results: { [key: string]: any }) => void;
}

export function QuizComponent({ questions, onComplete }: QuizComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(answers);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Question {currentIndex + 1} of {questions.length}
        </CardTitle>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-lg font-medium">
          {currentQuestion.title}
        </div>


        <div className="space-y-2">
          {currentQuestion.exercise_prompts.map((prompt) => (
            <Button
              key={prompt.id}
              onClick={() => handleAnswer(prompt.id)}
              variant="outline"
              className="w-full justify-start text-left"
              disabled={showFeedback}
            >
              {prompt.text}
              {showFeedback && answers[currentQuestion.id] === prompt.id && (
                <span className="ml-auto">
                  {prompt.correct ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </span>
              )}
            </Button>
          ))}
        </div>

        {showFeedback && (
          <Button onClick={handleNext} className="w-full">
            {currentIndex + 1 < questions.length ? "Next Question" : "Complete Quiz"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
} 