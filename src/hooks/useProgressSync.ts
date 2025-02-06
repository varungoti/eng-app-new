import { useEffect, useCallback } from 'react';
import { useLearning } from '@/contexts/LearningContext';
import { updateLessonProgress } from '@/lib/api/learning';
import { useToast } from '@/components/ui/use-toast';

export function useProgressSync() {
  const { state, dispatch } = useLearning();
  const { toast } = useToast();

  const syncProgress = useCallback(async (progressData: any) => {
    try {
      await updateLessonProgress(progressData.id, progressData);
      dispatch({ 
        type: 'UPDATE_PROGRESS', 
        payload: progressData 
      });
    } catch (error) {
      console.error('Error syncing progress:', error);
      toast({
        title: "Sync Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  }, [dispatch, toast]);

  // Auto-sync on component unmount
  useEffect(() => {
    return () => {
      if (state.currentLesson?.progress) {
        syncProgress(state.currentLesson.progress);
      }
    };
  }, [state.currentLesson, syncProgress]);

  return { syncProgress };
} 