import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { Grade, Topic, SubTopic, Lesson } from '../../types';

export const useContent = () => {
  const queryClient = useQueryClient();

  const { data: grades = [], isLoading: gradesLoading } = useQuery({
    queryKey: ['grades'],
    queryFn: () => api.get('grades'),
  });

  const { data: topics = [], isLoading: topicsLoading } = useQuery({
    queryKey: ['topics'],
    queryFn: () => api.get('topics'),
  });

  const { data: subTopics = [], isLoading: subTopicsLoading } = useQuery({
    queryKey: ['sub_topics'],
    queryFn: () => api.get('sub_topics'),
  });

  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ['lessons'],
    queryFn: () => api.get('lessons'),
  });

  const upsertTopic = useMutation({
    mutationFn: async (topic: Partial<Topic>) => {
      if (topic.id) {
        return api.put('topics', topic.id, topic);
      }
      return api.post('topics', topic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });

  const upsertSubTopic = useMutation({
    mutationFn: async (subTopic: Partial<SubTopic>) => {
      if (subTopic.id) {
        return api.put('sub_topics', subTopic.id, subTopic);
      }
      return api.post('sub_topics', subTopic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sub_topics'] });
    },
  });

  const upsertLesson = useMutation({
    mutationFn: async (lesson: Partial<Lesson>) => {
      if (lesson.id) {
        return api.put('lessons', lesson.id, lesson);
      }
      return api.post('lessons', lesson);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
  });

  return {
    grades,
    topics,
    subTopics,
    lessons,
    loading: gradesLoading || topicsLoading || subTopicsLoading || lessonsLoading,
    upsertTopic,
    upsertSubTopic,
    upsertLesson,
  };
};