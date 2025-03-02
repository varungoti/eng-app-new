import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Activity } from '../api/types';

interface SaveStatus {
  id: string;
  status: 'draft' | 'saved' | 'saving' | 'error';
  lastSaved?: string;
}

export const useActivityManager = (currentLessonId: string | null) => {
  // State
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitySaveStatuses, setActivitySaveStatuses] = useState<SaveStatus[]>([]);
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);

  // Fetch activities when lesson changes
  useEffect(() => {
    const fetchActivities = async () => {
      if (!currentLessonId) return;

      try {
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('lesson_id', currentLessonId)
          .order('created_at');

        if (error) throw error;

        setActivities(data || []);
        setActivitySaveStatuses(
          (data || []).map(activity => ({
            id: activity.id,
            status: 'saved'
          }))
        );
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to fetch activities');
      }
    };

    fetchActivities();
  }, [currentLessonId]);

  // Add activity
  const addActivity = useCallback(async () => {
    if (!currentLessonId) {
      toast.error('Please select a lesson first');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error('Please sign in to add activities');
      return;
    }

    const newActivity: Activity = {
      id: crypto.randomUUID(),
      lesson_id: currentLessonId,
      type: 'practice',
      title: 'New Activity',
      name: '',
      instructions: '',
      media: [],
      data: {
        prompt: '',
        teacher_script: '',
        media: []
      },
      created_at: new Date().toISOString()
    };

    setActivities(prev => [...prev, newActivity]);
    setActivitySaveStatuses(prev => [
      ...prev,
      { id: newActivity.id, status: 'draft' }
    ]);
    setExpandedActivity(activities.length); // Expand the new activity
  }, [currentLessonId, activities.length]);

  // Update activity
  const updateActivity = useCallback((index: number, updatedActivity: Activity) => {
    setActivities(prev => {
      const newActivities = [...prev];
      newActivities[index] = updatedActivity;
      return newActivities;
    });

    setActivitySaveStatuses(prev => prev.map(status => 
      status.id === updatedActivity.id 
        ? { ...status, status: 'draft' } 
        : status
    ));
  }, []);

  // Remove activity
  const removeActivity = useCallback(async (index: number) => {
    try {
      const activityToDelete = activities[index];

      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityToDelete.id);

      if (error) throw error;

      setActivities(prev => prev.filter((_, i) => i !== index));
      setActivitySaveStatuses(prev => 
        prev.filter(status => status.id !== activityToDelete.id)
      );
      
      toast.success('Activity deleted successfully');
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast.error('Failed to delete activity');
    }
  }, [activities]);

  // Save activity
  const saveActivity = useCallback(async (activity: Activity, index: number) => {
    if (!currentLessonId) {
      toast.error('Please select a lesson first');
      return;
    }

    const loadingToast = toast.loading(`Saving activity ${index + 1}...`);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to save activity', { id: loadingToast });
        return;
      }

      // Update status to saving
      setActivitySaveStatuses(prev => prev.map(status =>
        status.id === activity.id
          ? { ...status, status: 'saving' }
          : status
      ));

      // Save activity
      const { error } = await supabase
        .from('activities')
        .upsert({
          ...activity,
          user_id: session.user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update status to saved
      setActivitySaveStatuses(prev => prev.map(status =>
        status.id === activity.id
          ? { ...status, status: 'saved', lastSaved: new Date().toISOString() }
          : status
      ));

      toast.success(`Activity ${index + 1} saved successfully`, { id: loadingToast });
    } catch (error) {
      console.error('Error saving activity:', error);
      setActivitySaveStatuses(prev => prev.map(status =>
        status.id === activity.id
          ? { ...status, status: 'error' }
          : status
      ));
      toast.error(`Failed to save activity ${index + 1}`, { id: loadingToast });
    }
  }, [currentLessonId]);

  return {
    // State
    activities,
    activitySaveStatuses,
    expandedActivity,

    // Actions
    setActivities,
    setExpandedActivity,
    addActivity,
    updateActivity,
    removeActivity,
    saveActivity,
  };
}; 