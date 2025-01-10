import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import type { Exercise } from '@/types';

interface ExerciseItemProps {
  exercise: Exercise;
  onSelect: (exerciseId: string) => void;
}

export function ExerciseItem({ exercise, onSelect }: ExerciseItemProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start"
      onClick={() => onSelect(exercise.documentId)}
    >
      <GraduationCap className="mr-2 h-4 w-4" />
      {exercise.title}
    </Button>
  );
}