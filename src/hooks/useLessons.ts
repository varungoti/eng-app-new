import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Lesson } from '@/types/content';
import { contentService } from '@/lib/content/ContentService';
import { logger } from '@/lib/logger';
import { API_CONFIG } from '@/config/api';

export function useLessons(subtopicId?: string): UseQueryResult<Lesson[]> {
  return useQuery({
    queryKey: ['lessons', subtopicId] as const,
    queryFn: async () => {
      try {
        if (!subtopicId) return [];
        return await contentService.fetchLessons(subtopicId);
      } catch (error) {
        logger.error('Error fetching lessons', { 
          context: { error: String(error) },
          source: 'useLessons'
        });
        throw new Error('Failed to fetch lessons');
      }
    },
    enabled: !!subtopicId,
    retry: API_CONFIG.RETRY_COUNT,
    staleTime: API_CONFIG.STALE_TIME,
    onError: (error: Error) => {
      logger.error('Error in lessons query', { 
        context: { error: String(error) },
        source: 'useLessons'
      });
    }
  });
} 