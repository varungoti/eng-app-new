"use client";

import { useState, useEffect } from 'react';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useCache } from '../useCache';
import { logger } from '../../lib/logger';
import type { Grade, Topic, SubTopic, Lesson, ExercisePrompt, Question, School, Class, Activity } from '../../types';

interface QueryState {
  grades: Grade[];
  topics: Topic[];
  subTopics: SubTopic[];
  lessons: Lesson[];
  activities: Activity[];
  questions: Question[];
  exercises: ExercisePrompt[];
  schools: School[];
  classes: Class[];
  loading: boolean;
  progress: number;
  error: string | null;
  refresh: () => Promise<void>;
}

interface ContentQueryOptions {
  selectedGrade: string;
  selectedTopic: string;
  selectedSubTopic: string;
  selectedLesson: string;
  selectedQuestion: string;
  selectedExercise: string;
  selectedActivity: string;
  selectedSchool: string;
  selectedClass: string;
  onProgress?: (progress: number) => void;
}

// Then create the client
const queryClient = new QueryClient();

export const useContentQuery = (options: ContentQueryOptions): QueryState => {
  const { cache } = useCache();
  const [loadProgress, setLoadProgress] = useState<number>(0);

  // Fetch grades
  const gradesQuery = useQuery({
    queryKey: ['grades'],
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    initialData: [],
    queryFn: async () => {
      // Check cache first
      const cached = cache.get<Grade[]>('grades');
      if (cached) {
        return cached;
      }

      logger.info('Fetching grades', {
        source: 'useContentQuery'
      });

      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('level');
      
      if (error) {
        logger.error('Failed to fetch grades', {
          context: { error },
          source: 'useContentQuery'
        });
        throw error;
      }

      // Cache the results
      cache.set('grades', data || [], 5 * 60 * 1000); // 5 min TTL
      return data || [];
    },
    staleTime: 60 * 60 * 1000, // 60 minutes
  });

  // Fetch topics
  const topicsQuery = useQuery({
    queryKey: ['topics', options.selectedGrade],
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    initialData: [],
    queryFn: async () => {
      if (!options.selectedGrade) {
        logger.debug('No grade selected, skipping topics fetch', {
          source: 'useContentQuery'
        });
        return [];
      }

      // Check cache first
      const cacheKey = `topics:${options.selectedGrade}`;
      const cached = cache.get<Topic[]>(cacheKey);
      if (cached) {
        return cached;
      }

      logger.info('Fetching topics', {
        context: { gradeId: options.selectedGrade },
        source: 'useContentQuery'
      });

      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('grade_id', options.selectedGrade)
        .order('order');  

      if (error) {
        logger.error('Failed to fetch topics', {
          context: { error, gradeId: options.selectedGrade },
          source: 'useContentQuery'
        });
        throw error;
      }

      logger.debug('Topics fetched successfully', {
        context: { count: data?.length || 0 },
        source: 'useContentQuery'
      });

      // Cache the results
      cache.set(cacheKey, data || [], 5 * 60 * 1000);
      return data || [];
    },
    enabled: Boolean(options.selectedGrade),
    staleTime: 60 * 60 * 1000,
  });

    // Fetch sub-topics for selected topic
  const subTopicsQuery = useQuery({
      queryKey: ['subTopics', options.selectedTopic],
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    initialData: [],
    queryFn: async () => {
      if (!options.selectedTopic) {
        return [];
      }

      // Check cache first  
      const cacheKey = `subtopics:${options.selectedTopic}`;
      const cached = cache.get<SubTopic[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const { data, error } = await supabase
        .from('sub_topics')
        .select('*')
        .eq('topic_id', options.selectedTopic)
        .order('order');

      if (error) throw error;

      // Cache the results
      cache.set(cacheKey, data || [], 5 * 60 * 1000);
      return data || [];
    },
    enabled: Boolean(options.selectedTopic),
    staleTime: 60 * 60 * 1000,
    meta: {
      source: 'useContentQuery'
    }
  });

  // Fetch lessons for selected sub-topic
  const lessonsQuery = useQuery({
    queryKey: ['lessons', options.selectedSubTopic],
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    initialData: [],
    queryFn: async () => {
      if (!options.selectedSubTopic) {
        return [];
      }

      const { data, error } = await supabase
        .from('lessons')
        .select('*, exercises(*)')
        .eq('sub_topic_id', options.selectedSubTopic)
        .order('order');

      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(options.selectedSubTopic),
    meta: {
      source: 'useContentQuery'
    }
  });
  
// Fetch questions
const questionsQuery = useQuery({
  queryKey: ['questions', options.selectedLesson],
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  initialData: [],
  queryFn: async () => {
    if (!options.selectedLesson) {
      logger.debug('No lesson selected, skipping questions fetch', {
        source: 'useContentQuery'
      });
      return [];
    }

    const cacheKey = `questions:${options.selectedLesson}`;
    const cached = cache.get<Question[]>(cacheKey);
    if (cached) {
      return cached;
    }

    logger.info('Fetching questions', {
      context: { lessonId: options.selectedLesson },
      source: 'useContentQuery'
    });

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('lesson_id', options.selectedLesson)
      .order('created_at');

    if (error) {
      logger.error('Failed to fetch questions', {
        context: { error, lessonId: options.selectedLesson },
        source: 'useContentQuery'
      });
      throw error;
    }

    cache.set(cacheKey, data || [], 5 * 60 * 1000);
    return data || [];
  },
  enabled: Boolean(options.selectedLesson),
  staleTime: 60 * 60 * 1000,
});

// Fetch activities
const activitiesQuery = useQuery({
  queryKey: ['activities', options.selectedLesson],
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  initialData: [],
  queryFn: async () => {
    if (!options.selectedLesson) {
      logger.debug('No lesson selected, skipping activities fetch', {
        source: 'useContentQuery'
      });
      return [];
    }
    const cacheKey = `activities:${options.selectedLesson}`;
    const cached = cache.get<Activity[]>(cacheKey);
    if (cached) {
      return cached;
    }

    logger.info('Fetching activities', {
      context: { lessonId: options.selectedLesson },
      source: 'useContentQuery'
    });

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('lesson_id', options.selectedLesson)
      .order('created_at');

    if (error) {
      logger.error('Failed to fetch activities', {
        context: { error, lessonId: options.selectedLesson },
        source: 'useContentQuery'
      });
      throw error;
    }

    cache.set(cacheKey, data || [], 5 * 60 * 1000);
    return data || [];
  },
  enabled: Boolean(options.selectedLesson),
  staleTime: 60 * 60 * 1000,
});

// Fetch exercise prompts
const exercisePromptsQuery = useQuery({
  queryKey: ['exercisePrompts', options.selectedQuestion],
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  initialData: [],
  queryFn: async () => {
    if (!options.selectedQuestion) {
      logger.debug('No question selected, skipping exercise prompts fetch', {
        source: 'useContentQuery'
      });
      return [];
    }

    const cacheKey = `exercisePrompts:${options.selectedQuestion}`;
    const cached = cache.get<ExercisePrompt[]>(cacheKey);
    if (cached) {
      return cached;
    }

    logger.info('Fetching exercise prompts', {
      context: { questionId: options.selectedQuestion },
      source: 'useContentQuery'
    });

    const { data, error } = await supabase
      .from('exercise_prompts')
      .select('*')
      .eq('question_id', options.selectedQuestion)
      .order('created_at');

    if (error) {
      logger.error('Failed to fetch exercise prompts', {
        context: { error, questionId: options.selectedQuestion },
        source: 'useContentQuery'
      });
      throw error;
    }

    cache.set(cacheKey, data || [], 5 * 60 * 1000);
    return data || [];
  },
  enabled: Boolean(options.selectedQuestion),
  staleTime: 60 * 60 * 1000,
});

// Fetch School
const schoolsQuery = useQuery({
  queryKey: ['schools'],
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  initialData: [],
  queryFn: async () => {

// Check cache first  
      const cacheKey = `schools`;
      const cached = cache.get<School[]>(cacheKey);
      if (cached) {
        return cached;
      }


    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('created_at');

      if (error) {
        logger.error('Failed to fetch schools', {
          context: { error },
          source: 'useContentQuery'
        });
        throw error;
      }

      // Cache the results
      cache.set(cacheKey, data || [], 5 * 60 * 1000);
      
    return data || [];
  },
  enabled: true,
  staleTime: 60 * 60 * 1000,
  meta: {
    source: 'useContentQuery'
  }
});

// Fetch classes
const classesQuery = useQuery({
  queryKey: ['classes', options.selectedSchool],
  retry: 2,
  retryDelay: (attemptIndex: number) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  initialData: [],
  queryFn: async () => {
    if (!options.selectedSchool) {
      logger.debug('No school selected, skipping classes fetch', {
        source: 'useContentQuery'
      });
      return [];
    }
    const cacheKey = `classes:${options.selectedSchool}`;
    const cached = cache.get<Class[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('school_id', options.selectedSchool)
      .order('created_at');

      if (error) {
        logger.error('Failed to fetch classes', {
          context: { error, schoolId: options.selectedSchool },
          source: 'useContentQuery'
        });
        throw error;
      }

      // Cache the results
      cache.set(cacheKey, data || [], 5 * 60 * 1000);
      return data || [];
  },
  enabled: Boolean(options.selectedSchool),
  staleTime: 60 * 60 * 1000,
  meta: {
    source: 'useContentQuery'
  }
});


  // Update progress based on query states
  useEffect(() => {
    let progress = 0;
    if (gradesQuery.isLoading) progress = 25;
    else if (topicsQuery.isLoading) progress = 50;
    else if (subTopicsQuery.isLoading) progress = 75;
    else if (lessonsQuery.isLoading) progress = 90;
    else if (questionsQuery.isLoading) progress = 95;
    else if (exercisePromptsQuery.isLoading) progress = 100;
    else progress = 100;
    
    setLoadProgress(progress);
    if (options.onProgress) options.onProgress(progress);
  }, [gradesQuery.isLoading, topicsQuery.isLoading, subTopicsQuery.isLoading, lessonsQuery.isLoading, options.onProgress]);


  return {
    grades: gradesQuery.data || [],
    topics: topicsQuery.data || [],
    subTopics: subTopicsQuery.data || [],
    lessons: lessonsQuery.data || [],
    activities: activitiesQuery.data || [],
    questions: questionsQuery.data || [],
    exercises: exercisePromptsQuery.data || [],
    schools: schoolsQuery.data || [],
    classes: classesQuery.data || [],
    loading: gradesQuery.isLoading || topicsQuery.isLoading || subTopicsQuery.isLoading || lessonsQuery.isLoading,
    progress: loadProgress,
    error: subTopicsQuery.error instanceof Error ? subTopicsQuery.error.message :
              lessonsQuery.error instanceof Error ? lessonsQuery.error.message :
              null,
    refresh: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['grades'] }),
        queryClient.refetchQueries({ queryKey: ['topics', options.selectedGrade] }),
        subTopicsQuery.refetch()
      ]);
    }
  };
};