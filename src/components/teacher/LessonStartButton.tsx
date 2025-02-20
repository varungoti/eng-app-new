import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface LessonStartButtonProps {
  lessonId: string;
  isDisabled: boolean;
  onStart: () => void;
}

export function LessonStartButton({ lessonId, isDisabled, onStart }: LessonStartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStart = async () => {
    try {
      setIsLoading(true);
      await onStart();
    } catch (err) {
      logger.error(`Failed to start lesson ${lessonId}: ${err instanceof Error ? err.message : String(err)}`, 'LessonStartButton');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleStart}
      disabled={isDisabled || isLoading}
      className={cn(
        "w-full",
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {isLoading ? "Starting..." : "Start Lesson"}
    </Button>
  );
} 