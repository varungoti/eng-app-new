import { useQuery, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../lib/content/ContentService';
//import { logger } from '../lib/logger';
//import type { Grade, Topic, SubTopic, Lesson } from '../types';

export const useContent = () => {
  const queryClient = useQueryClient();

  // Fetch grades
  const { data: grades = [], isLoading: gradesLoading } = useQuery({
    queryKey: ['grades'],
    queryFn: () => contentService.fetchGrades(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch topics
  const { data: topics = [], isLoading: topicsLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: () => contentService.fetchTopics("all"),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch sub-topics
  const { data: subTopics = [], isLoading: subTopicsLoading } = useQuery({
    queryKey: ['sub_topics'],
    queryFn: () => contentService.fetchSubtopics("all"),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch lessons
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => contentService.fetchLessons("all"),
    staleTime: 5 * 60 * 1000,
  });

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['grades'] }),
      queryClient.invalidateQueries({ queryKey: ['topics'] }),
      queryClient.invalidateQueries({ queryKey: ['sub_topics'] }),
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    ]);
  };

  return {
    grades,
    topics,
    subTopics,
    lessons,
    loading: gradesLoading || topicsLoading || subTopicsLoading || lessonsLoading,
    refresh
  };
};