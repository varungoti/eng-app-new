import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CompletionCardProps {
  score: number;
  onRetry: () => void;
}

export function CompletionCard({ score, onRetry }: CompletionCardProps) {
  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exercise Completed!</h2>
      <p className="text-lg mb-4">Your score: {score}%</p>
      <Progress value={score} className="mb-4" />
      <Button onClick={onRetry}>Try Again</Button>
    </Card>
  );
}