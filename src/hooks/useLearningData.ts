import { useEffect } from 'react';
import { useLearning } from '@/contexts/LearningContext';
import { fetchLearningPath, fetchUserActivities } from '@/lib/api/learning';
import { useToast } from '@/components/ui/use-toast';

// Use ReturnType to infer the state type from useLearning
type LearningReturnType = ReturnType<typeof useLearning>;
type LearningStateType = LearningReturnType['state']; 

export function useLearningData(userId: string): LearningStateType {
  const { state, dispatch } = useLearning();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const [topics, _activities] = await Promise.all([
          fetchLearningPath(),
          fetchUserActivities(userId)
        ]);

        dispatch({ type: 'SET_TOPICS', payload: topics });
        // Add more dispatch actions for activities if needed
      } catch (error) {
        console.error('Error loading learning data:', error);
        toast({
          title: "Error",
          description: "Failed to load learning content"
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