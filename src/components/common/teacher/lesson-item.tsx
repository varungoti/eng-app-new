import { Button } from '@/components/ui/button';
import { ChevronDown, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/types';

interface LessonItemProps {
  lesson: Lesson;
  isExpanded: boolean;
  onToggle: () => void;
}

export function LessonItem({ lesson, isExpanded, onToggle }: LessonItemProps) {
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={onToggle}
    >
      <ChevronDown
        className={cn(
          'mr-2 h-4 w-4 transition-transform',
          isExpanded ? 'transform rotate-180' : ''
        )}
      />
      <BookOpen className="mr-2 h-4 w-4" />
      {lesson.title}
    </Button>
  );
}