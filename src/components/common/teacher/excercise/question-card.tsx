import { Button } from '@/components/ui/button';
import type { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  return (
    <div className="bg-muted p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">{question.question}</h3>
      {question.type === 'repeat' ? (
        <div className="space-y-4">
          <p className="text-muted-foreground">{question.correctAnswer}</p>
          <Button onClick={() => onAnswer(question.correctAnswer)}>
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
              onAnswer((e.target as HTMLInputElement).value);
            }
          }}
        />
      )}
    </div>
  );
}