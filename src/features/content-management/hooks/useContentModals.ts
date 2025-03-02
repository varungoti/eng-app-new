import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { contentService } from '@/lib/content/ContentService';

interface ModalState {
  addGrade: boolean;
  addTopic: boolean;
  addSubtopic: boolean;
  addLesson: boolean;
}

interface UseContentModalsProps {
  selectedGradeId: string | null;
  selectedTopicId: string | null;
  selectedSubtopicId: string | null;
  onSuccess?: () => void;
}

export const useContentModals = ({
  selectedGradeId,
  selectedTopicId,
  selectedSubtopicId,
  onSuccess
}: UseContentModalsProps) => {
  const [modalState, setModalState] = useState<ModalState>({
    addGrade: false,
    addTopic: false,
    addSubtopic: false,
    addLesson: false
  });

  const openModal = useCallback((modalKey: keyof ModalState) => {
    setModalState(prev => ({ ...prev, [modalKey]: true }));
  }, []);

  const closeModal = useCallback((modalKey: keyof ModalState) => {
    setModalState(prev => ({ ...prev, [modalKey]: false }));
  }, []);

  const handleCreateGrade = useCallback(async (data: { title: string; description?: string }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to create a grade');
        return;
      }

      const { data: grade, error } = await supabase
        .from('grades')
        .insert({
          name: data.title,
          level: 0, // Default level
          order_index: 0, // Default order
          user_id: session.user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Grade created successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating grade:', error);
      toast.error('Failed to create grade');
    }
  }, [onSuccess]);

  const handleCreateTopic = useCallback(async (data: { title: string; description?: string }) => {
    if (!selectedGradeId) {
      toast.error('Please select a grade first');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to create a topic');
        return;
      }

      const { data: topic, error } = await supabase
        .from('topics')
        .insert({
          title: data.title,
          description: data.description,
          grade_id: selectedGradeId,
          user_id: session.user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Topic created successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Failed to create topic');
    }
  }, [selectedGradeId, onSuccess]);

  const handleCreateSubtopic = useCallback(async (data: { title: string; description?: string }) => {
    if (!selectedTopicId) {
      toast.error('Please select a topic first');
      return;
    }

    try {
      const newSubtopic = await contentService.createSubtopic({
        title: data.title,
        description: data.description,
        topicId: selectedTopicId
      });

      toast.success('Subtopic created successfully');
      onSuccess?.();
      return newSubtopic;
    } catch (error) {
      console.error('Error creating subtopic:', error);
      toast.error('Failed to create subtopic');
    }
  }, [selectedTopicId, onSuccess]);

  const handleCreateLesson = useCallback(async (data: { title: string; description?: string }) => {
    if (!selectedSubtopicId) {
      toast.error('Please select a subtopic first');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to create a lesson');
        return;
      }

      // Create the lesson
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          title: data.title,
          description: data.description,
          subtopic_id: selectedSubtopicId,
          status: 'draft',
          user_id: session.user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (lessonError) throw lessonError;

      // Create initial lesson content
      const { error: contentError } = await supabase
        .from('lesson_content')
        .insert({
          lesson_id: lesson.id,
          content: [],
          content_type: 'html',
          metadata: {
            version: 1,
            status: 'draft'
          },
          user_id: session.user.id,
          created_at: new Date().toISOString()
        });

      if (contentError) throw contentError;

      toast.success('Lesson created successfully');
      onSuccess?.();
      return lesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Failed to create lesson');
    }
  }, [selectedSubtopicId, onSuccess]);

  return {
    modalState,
    openModal,
    closeModal,
    handlers: {
      grade: handleCreateGrade,
      topic: handleCreateTopic,
      subtopic: handleCreateSubtopic,
      lesson: handleCreateLesson
    }
  };
}; 