"use client"


import { useQuery } from '@tanstack/react-query'
import { contentService } from '@/lib/content/ContentService'
import { useContentStore } from '@/lib/content/store'
import { UseQueryOptions } from '@tanstack/react-query'

export function useContentHierarchy() {
  const { 
    selectedGrade,
    selectedTopic,
    selectedSubtopic,
    selectedLesson
  } = useContentStore()

  const { data: grades = [], isLoading: gradesLoading } = useQuery<any>({
    queryKey: ['grades'],
    queryFn: () => contentService.fetchGrades(),
    staleTime: Infinity // Only fetch once unless explicitly invalidated
  } as UseQueryOptions)

  const { data: topics = [], isLoading: topicsLoading } = useQuery<any>({
    queryKey: ['topics', selectedGrade],
    queryFn: () => selectedGrade ? contentService.fetchTopics(selectedGrade) : Promise.resolve([]),
    enabled: !!selectedGrade,
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  } as UseQueryOptions)

  const { data: subtopics = [], isLoading: subtopicsLoading } = useQuery<any>({
    queryKey: ['subtopics', selectedTopic],
    queryFn: () => selectedTopic ? contentService.fetchSubtopics(selectedTopic) : Promise.resolve([]),
    enabled: !!selectedTopic,
    staleTime: 5 * 60 * 1000
  } as UseQueryOptions)

  const { data: lessons = [], isLoading: lessonsLoading, error: lessonsError } = useQuery<any>({
    queryKey: ['lessons', selectedSubtopic],
    queryFn: async () => {
      try {
        if (!selectedSubtopic) {
          console.log('[ContentHierarchy] No subtopic selected');
          return [];
        }
        
        console.log('[ContentHierarchy] Fetching lessons for subtopic:', selectedSubtopic);
        const data = await contentService.fetchLessons(selectedSubtopic);
        console.log('[ContentHierarchy] Lessons fetched:', data);
        return data;
      } catch (error) {
        console.error('[ContentHierarchy] Error fetching lessons:', error);
        throw error;
      }
    },
    enabled: !!selectedSubtopic,
    staleTime: 5 * 60 * 1000,
    onError: (error: Error) => {
      console.error('[ContentHierarchy] Query error:', error);
    }
  } as UseQueryOptions)

  const { data: lessonContent, isLoading: lessonContentLoading } = useQuery({
    queryKey: ['lesson-content', selectedLesson] as const,
    queryFn: async () => {
      try {
        if (!selectedLesson) {
          console.log('[ContentHierarchy] No lesson selected');
          return null;
        }
        
        console.log('[ContentHierarchy] Fetching lesson content:', selectedLesson);
        const data = await contentService.fetchLessonContent(selectedLesson);
        console.log('[ContentHierarchy] Lesson content fetched:', data);
        return data;
      } catch (error) {
        console.error('[ContentHierarchy] Error fetching lesson content:', error);
        throw error;
      }
    },
    enabled: !!selectedLesson,
    staleTime: 5 * 60 * 1000
  } as UseQueryOptions<any, Error>);

  return {
    grades,
    topics,
    subtopics,
    lessons,
    lessonContent,
    isLoading: gradesLoading || topicsLoading || subtopicsLoading || lessonsLoading || lessonContentLoading,
    errors: { lessonsError }
  }
} 