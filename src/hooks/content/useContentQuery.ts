import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useCache } from '../useCache';
import { logger } from '../../lib/logger';
import type { Grade, Topic, SubTopic, Lesson } from '../../types';

interface QueryState {
  grades: Grade[];
  topics: Topic[];
  subTopics: SubTopic[];
  lessons: Lesson[];
  loading: boolean;
  progress: number;
  error: string | null;
}

export const useContentQuery = (
  selectedGrade?: string,
  selectedTopic?: string,
  selectedSubTopic?: string,
  onProgress?: (progress: number) => void
): QueryState => {
  const { cache } = useCache();
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const queryClient = useQueryClient();

  // Fetch grades
  const gradesQuery = useQuery({
    queryKey: ['grades'],
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch topics
  const topicsQuery = useQuery({
    queryKey: ['topics', selectedGrade],
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    initialData: [],
    queryFn: async () => {
      if (!selectedGrade) {
        logger.debug('No grade selected, skipping topics fetch', {
          source: 'useContentQuery'
        });
        return [];
      }

      // Check cache first
      const cacheKey = `topics:${selectedGrade}`;
      const cached = cache.get<Topic[]>(cacheKey);
      if (cached) {
        return cached;
      }

      logger.info('Fetching topics', {
        context: { gradeId: selectedGrade },
        source: 'useContentQuery'
      });

      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('grade_id', selectedGrade)
        .order('order');

      if (error) {
        logger.error('Failed to fetch topics', {
          context: { error, gradeId: selectedGrade },
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
    enabled: Boolean(selectedGrade),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch sub-topics for selected topic
  const subTopicsQuery = useQuery({
    queryKey: ['subTopics', selectedTopic],
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    initialData: [],
    queryFn: async () => {
      if (!selectedTopic) {
        return [];
      }

      // Check cache first  
      const cacheKey = `subtopics:${selectedTopic}`;
      const cached = cache.get<SubTopic[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const { data, error } = await supabase
        .from('sub_topics')
        .select('*')
        .eq('topic_id', selectedTopic)
        .order('order');

      if (error) throw error;

      // Cache the results
      cache.set(cacheKey, data || [], 5 * 60 * 1000);
      return data || [];
    },
    enabled: Boolean(selectedTopic),
    meta: {
      source: 'useContentQuery'
    }
  });

  // Fetch lessons for selected sub-topic
  const lessonsQuery = useQuery({
    queryKey: ['lessons', selectedSubTopic],
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    initialData: [],
    queryFn: async () => {
      if (!selectedSubTopic) {
        return [];
      }

      const { data, error } = await supabase
        .from('lessons')
        .select('*, exercises(*)')
        .eq('sub_topic_id', selectedSubTopic)
        .order('order');

      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(selectedSubTopic),
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
    else progress = 100;
    
    setLoadProgress(progress);
    if (onProgress) onProgress(progress);
  }, [gradesQuery.isLoading, topicsQuery.isLoading, subTopicsQuery.isLoading, lessonsQuery.isLoading, onProgress]);

  return {
    grades: gradesQuery.data || [],
    topics: topicsQuery.data || [],
    subTopics: subTopicsQuery.data || [],
    lessons: lessonsQuery.data || [],
    loading: gradesQuery.isLoading || topicsQuery.isLoading || subTopicsQuery.isLoading || lessonsQuery.isLoading,
    progress: loadProgress,
    error: subTopicsQuery.error instanceof Error ? subTopicsQuery.error.message :
           lessonsQuery.error instanceof Error ? lessonsQuery.error.message :
           null,
    refresh: async () => {
      await Promise.all([
        queryClient.refetchQueries(['grades']),
        queryClient.refetchQueries(['topics', selectedGrade]),
        subTopicsQuery.refetch(),
        lessonsQuery.refetch()
      ]);
    }
  };
};