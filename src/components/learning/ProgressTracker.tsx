import { useEffect } from 'react';
import { useProgressSync } from '@/hooks/useProgressSync';
import { trackLearningEvent } from '@/lib/api/analytics';

interface ProgressTrackerProps {
  userId: string;
  lessonId: string;
  progress: number;
  onMilestoneReached?: () => void;
}

export function ProgressTracker({ 
  userId, 
  lessonId, 
  progress, 
  onMilestoneReached 
}: ProgressTrackerProps) {
  const { syncProgress } = useProgressSync();

  useEffect(() => {
    // Track progress milestones
    if (progress === 100) {
      trackLearningEvent({
        userId,
        eventType: 'lesson_complete',
        metadata: { lessonId, completedAt: new Date().toISOString() }
      });
      onMilestoneReached?.();
    }

    // Sync progress at regular intervals
    const syncInterval = setInterval(() => {
      syncProgress({
        id: `${userId}-${lessonId}`,
        progress,
        lastUpdated: new Date().toISOString()
      });
    }, 30000); // Sync every 30 seconds

    return () => clearInterval(syncInterval);
  }, [userId, lessonId, progress, syncProgress, onMilestoneReached]);

  return null; // This is a utility component, no UI needed
} 