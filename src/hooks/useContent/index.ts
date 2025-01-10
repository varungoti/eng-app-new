import { useState, useEffect, useCallback } from 'react';
import { logger } from '../../lib/logger';
import { mapGrade, mapTopic, mapSubTopic, mapLesson } from './mappers';
import * as api from './api';
import type { Grade, Topic, SubTopic, Lesson } from '../../types';

export const useContent = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      logger.info('Starting content fetch', {
        context: { timestamp: new Date().toISOString() },
        source: 'ContentLoader'
      });

      const [gradesData, topicsData, subTopicsData, lessonsData] = await Promise.all([
        api.fetchGrades(),
        api.fetchTopics(),
        api.fetchSubTopics(),
        api.fetchLessons()
      ]);

      const mappedGrades = gradesData.map(mapGrade);
      const mappedTopics = topicsData.map(mapTopic);
      const mappedSubTopics = subTopicsData.map(mapSubTopic);
      const mappedLessons = lessonsData.map(mapLesson);

      logger.info('Content data loaded successfully', {
        context: {
          gradesCount: mappedGrades.length,
          topicsCount: mappedTopics.length,
          subTopicsCount: mappedSubTopics.length,
          lessonsCount: mappedLessons.length
        },
        source: 'ContentLoader'
      });

      setGrades(mappedGrades);
      setTopics(mappedTopics);
      setSubTopics(mappedSubTopics);
      setLessons(mappedLessons);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch content';
      logger.error(message, {
        context: { error: err },
        source: 'ContentLoader'
      });
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const upsertTopic = async (topic: Partial<Topic>) => {
    try {
      await api.upsertTopic(topic);
      await fetchContent();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update topic';
      setError(message);
      throw err;
    }
  };

  const upsertSubTopic = async (subTopic: Partial<SubTopic>) => {
    try {
      await api.upsertSubTopic(subTopic);
      await fetchContent();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update sub-topic';
      setError(message);
      throw err;
    }
  };

  const upsertLesson = async (lesson: Partial<Lesson>) => {
    try {
      await api.upsertLesson(lesson);
      await fetchContent();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update lesson';
      setError(message);
      throw err;
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      await api.deleteTopic(id);
      await fetchContent();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete topic';
      setError(message);
      throw err;
    }
  };

  const deleteSubTopic = async (id: string) => {
    try {
      await api.deleteSubTopic(id);
      await fetchContent();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete sub-topic';
      setError(message);
      throw err;
    }
  };

  const deleteLesson = async (id: string) => {
    try {
      await api.deleteLesson(id);
      await fetchContent();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete lesson';
      setError(message);
      throw err;
    }
  };

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    grades,
    topics,
    subTopics,
    lessons,
    loading,
    error,
    upsertTopic,
    upsertSubTopic,
    upsertLesson,
    deleteTopic,
    deleteSubTopic,
    deleteLesson,
    refresh: fetchContent,
  };
};