import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Grade, Topic, Subtopic, Lesson } from '../api/types';
import { useContentStore } from '@/lib/content/store';
import { contentService } from '@/lib/content/ContentService';

export const useContentState = () => {
  // Local State
  const [grades, setGrades] = useState<Grade[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Selection State
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  // Global State
  const { 
    selectedGrade,
    setSelectedGrade,
    selectedTopic,
    setSelectedTopic,
    selectedSubtopic,
    setSelectedSubtopic,
    selectedLesson,
    setSelectedLesson
  } = useContentStore();

  // Fetch Grades
  const fetchGrades = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('name');

      if (error) throw error;

      const validGrades = data.map((grade: any) => ({
        _id: grade.id,
        id: grade.id,
        name: grade.name,
        level: grade.level || 0,
        orderIndex: grade.order_index || 0,
        topics: []
      }));
      
      setGrades(validGrades);
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast.error('Failed to fetch grades');
    }
  }, []);

  // Fetch Topics
  const fetchTopics = useCallback(async () => {
    if (!selectedGradeId) return;
    
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('grade_id', selectedGradeId)
        .order('title');

      if (error) throw error;

      const validTopics = data.map((topic: any) => ({
        _id: topic.id,
        id: topic.id,
        name: topic.title,
        title: topic.title,
        grade_id: topic.grade_id,
        subtopics: []
      }));
      
      setTopics(validTopics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to fetch topics');
    }
  }, [selectedGradeId]);

  // Fetch Subtopics
  const fetchSubtopics = useCallback(async () => {
    if (!selectedTopicId) return;
    
    try {
      const subtopicsData = await contentService.fetchSubtopics(selectedTopicId);

      const validSubtopics = subtopicsData.map((subtopic: any) => ({
        id: subtopic.id,
        title: subtopic.title,
        description: subtopic.description,
        topic_id: subtopic.topic_id,
        lessons: [],
        order_index: subtopicsData.length
      }));
      
      setSubtopics(validSubtopics);
      
      if (selectedSubtopic) {
        setSelectedSubtopic(selectedSubtopic);
      }
    } catch (error) {
      console.error('Error fetching subtopics:', error);
      toast.error('Failed to fetch subtopics');
    }
  }, [selectedTopicId, selectedSubtopic, setSelectedSubtopic]);

  // Fetch Lessons
  const fetchLessons = useCallback(async () => {
    if (!selectedSubtopicId) return;
    
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('subtopic_id', selectedSubtopicId)
        .order('title');

      if (error) throw error;
      
      const validLessons = data.map((lesson: any) => ({
        ...lesson,
        _id: lesson._id || lesson.id,
        title: lesson.title || 'Untitled Lesson'
      })).filter((lesson: any) => lesson._id);
      
      setLessons(validLessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Failed to fetch lessons');
    }
  }, [selectedSubtopicId]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  useEffect(() => {
    fetchSubtopics();
  }, [fetchSubtopics]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  // Selection Handlers
  const handleGradeSelect = useCallback((gradeId: string) => {
    setSelectedGradeId(gradeId);
    setSelectedGrade(gradeId);
    setSelectedTopicId(null);
    setSelectedTopic('');
    setSelectedSubtopicId(null);
    setSelectedSubtopic('');
    setCurrentLessonId(null);
  }, [setSelectedGrade, setSelectedTopic, setSelectedSubtopic]);

  const handleTopicSelect = useCallback((topicId: string) => {
    setSelectedTopicId(topicId);
    setSelectedTopic(topicId);
    setSelectedSubtopicId(null);
    setSelectedSubtopic('');
    setCurrentLessonId(null);
  }, [setSelectedTopic, setSelectedSubtopic]);

  const handleSubtopicSelect = useCallback((subtopicId: string) => {
    setSelectedSubtopicId(subtopicId);
    setSelectedSubtopic(subtopicId);
    setCurrentLessonId(null);
  }, [setSelectedSubtopic]);

  // Refresh Content
  const refreshContent = useCallback(async () => {
    if (selectedGradeId) {
      await fetchGrades();
      if (selectedTopicId) {
        await fetchTopics();
        if (selectedSubtopicId) {
          await fetchSubtopics();
          await fetchLessons();
        }
      }
    }
  }, [selectedGradeId, selectedTopicId, selectedSubtopicId, fetchGrades, fetchTopics, fetchSubtopics, fetchLessons]);

  return {
    // State
    grades,
    topics,
    subtopics,
    lessons,
    selectedGradeId,
    selectedTopicId,
    selectedSubtopicId,
    currentLessonId,

    // Actions
    setSelectedGradeId,
    setSelectedTopicId,
    setSelectedSubtopicId,
    setCurrentLessonId,
    handleGradeSelect,
    handleTopicSelect,
    handleSubtopicSelect,
    refreshContent,

    // Fetch Functions
    fetchGrades,
    fetchTopics,
    fetchSubtopics,
    fetchLessons
  };
}; 