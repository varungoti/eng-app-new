import { useState, useCallback } from 'react';

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: string;
  lesson_id: string;
  created_at: string;
  name: string;
}

export function useLearning() {
  const [activities] = useState<Activity[]>([
    {
      id: '1',
      title: 'Introduction to Grammar',
      description: 'Learn the basics of English grammar including nouns, verbs, and adjectives.',
      duration: 30,
      type: 'lesson',
      lesson_id: 'grammar-101',
      created_at: new Date().toISOString(),
      name: 'Grammar Basics'
    },
    {
      id: '2',
      title: 'Reading Comprehension',
      description: 'Practice reading and understanding short stories with interactive exercises.',
      duration: 45,
      type: 'exercise',
      lesson_id: 'reading-101',
      created_at: new Date().toISOString(),
      name: 'Reading Skills'
    }
  ]);

  const [completedActivities] = useState<string[]>(['1']);

  const startActivity = useCallback((activityId: string) => {
    console.log('Starting activity:', activityId);
    // Implement activity start logic here
  }, []);

  const reviewActivity = useCallback((activityId: string) => {
    console.log('Reviewing activity:', activityId);
    // Implement activity review logic here
  }, []);

  return {
    activities,
    completedActivities,
    startActivity,
    reviewActivity
  };
} 