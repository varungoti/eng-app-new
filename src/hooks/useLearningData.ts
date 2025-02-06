import { useEffect } from 'react';
import { useLearning } from '@/contexts/LearningContext';
import { fetchLearningPath, fetchUserActivities } from '@/lib/api/learning';
import { useToast } from '@/components/ui/use-toast';

export function useLearningData(userId: string) {
  const { state, dispatch } = useLearning();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [topics, activities] = await Promise.all([
          fetchLearningPath(),
          fetchUserActivities(userId)
        ]);

        dispatch({ type: 'SET_TOPICS', payload: topics });
        // Add more dispatch actions for activities if needed
      } catch (error) {
        console.error('Error loading learning data:', error);
        toast({
          title: "Error",
          description: "Failed to load learning content",
          variant: "destructive"
        });
        dispatch({ type: 'SET_ERROR', payload: error as Error });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    loadData();
  }, [userId, dispatch, toast]);

  return state;
} 