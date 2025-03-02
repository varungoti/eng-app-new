import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Question } from '../api/types';
import { QUESTION_TYPES, isQuestionType } from '../utils/constants';

interface SaveStatus {
  id: string;
  status: 'draft' | 'saved' | 'saving' | 'error';
  lastSaved?: string;
}

export const useQuestionManager = (currentLessonId: string | null) => {
  // Questions State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('');
  const [questionSaveStatuses, setQuestionSaveStatuses] = useState<SaveStatus[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Fetch questions when lesson changes
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!currentLessonId) return;

      try {
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select(`
            *,
            exercise_prompts (*)
          `)
          .eq('lesson_id', currentLessonId);

        if (questionsError) throw questionsError;

        // Format questions with their exercise prompts
        const formattedQuestions = questionsData?.map(q => ({
          ...q,
          data: q.data || {},
          exercisePrompts: q.exercise_prompts || []
        })) || [];

        setQuestions(formattedQuestions);

        // Initialize save statuses
        setQuestionSaveStatuses(
          formattedQuestions.map(q => ({
            id: q.id,
            status: 'saved'
          }))
        );
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast.error('Failed to fetch questions');
      }
    };

    fetchQuestions();
  }, [currentLessonId]);

  // Add question
  const addQuestion = useCallback(() => {
    if (!selectedQuestionType || !isQuestionType(selectedQuestionType)) return;
    if (!currentLessonId) {
      toast.error('Please select a lesson first');
      return;
    }

    const defaultData = QUESTION_TYPES[selectedQuestionType].defaultData;
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: selectedQuestionType,
      lesson_id: currentLessonId,
      title: 'New Question',
      metadata: {},
      data: defaultData,
      exercisePrompts: [],
      isDraft: true
    };

    setQuestions(prev => [...prev, newQuestion]);
    setQuestionSaveStatuses(prev => [
      ...prev,
      { id: newQuestion.id, status: 'draft' }
    ]);
    setSelectedQuestionType('');
    setExpandedQuestion(questions.length); // Expand the new question
  }, [selectedQuestionType, currentLessonId, questions.length]);

  // Update question
  const updateQuestion = useCallback(async (index: number, updatedQuestion: Question) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[index] = updatedQuestion;
      return newQuestions;
    });

    setQuestionSaveStatuses(prev => prev.map(status => 
      status.id === updatedQuestion.id 
        ? { ...status, status: 'draft' } 
        : status
    ));
  }, []);

  // Remove question
  const removeQuestion = useCallback(async (index: number) => {
    try {
      const questionToDelete = questions[index];
      
      // Delete related exercise prompts first
      const { error: promptError } = await supabase
        .from('exercise_prompts')
        .delete()
        .eq('question_id', questionToDelete.id);

      if (promptError) throw promptError;

      // Then delete the question
      const { error: questionError } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionToDelete.id);

      if (questionError) throw questionError;

      // Update local state
      setQuestions(prev => prev.filter((_, i) => i !== index));
      setQuestionSaveStatuses(prev => 
        prev.filter(status => status.id !== questionToDelete.id)
      );
      
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  }, [questions]);

  // Save question
  const saveQuestion = useCallback(async (question: Question, index: number) => {
    if (!currentLessonId) {
      toast.error('Please select a lesson first');
      return;
    }

    const loadingToast = toast.loading(`Saving question ${index + 1}...`);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to save question', { id: loadingToast });
        return;
      }

      // Update status to saving
      setQuestionSaveStatuses(prev => prev.map(status =>
        status.id === question.id
          ? { ...status, status: 'saving' }
          : status
      ));

      // Save question
      const questionData = {
        id: question.id,
        lesson_id: currentLessonId,
        type: question.type,
        title: question.title,
        metadata: question.metadata,
        data: question.data,
        user_id: session.user.id,
        updated_at: new Date().toISOString()
      };

      const { error: questionError } = await supabase
        .from('questions')
        .upsert(questionData);

      if (questionError) throw questionError;

      // Save exercise prompts if they exist
      if (question.exercisePrompts?.length) {
        for (const prompt of question.exercisePrompts) {
          const promptData = {
            id: prompt.id,
            question_id: question.id,
            text: prompt.text,
            type: prompt.type,
            narration: prompt.narration,
            saytext: prompt.saytext,
            media: prompt.media,
            user_id: session.user.id,
            updated_at: new Date().toISOString()
          };

          const { error: promptError } = await supabase
            .from('exercise_prompts')
            .upsert(promptData);

          if (promptError) throw promptError;
        }
      }

      // Update status to saved
      setQuestionSaveStatuses(prev => prev.map(status =>
        status.id === question.id
          ? { ...status, status: 'saved', lastSaved: new Date().toISOString() }
          : status
      ));

      toast.success(`Question ${index + 1} saved successfully`, { id: loadingToast });
    } catch (error) {
      console.error('Error saving question:', error);
      setQuestionSaveStatuses(prev => prev.map(status =>
        status.id === question.id
          ? { ...status, status: 'error' }
          : status
      ));
      toast.error(`Failed to save question ${index + 1}`, { id: loadingToast });
    }
  }, [currentLessonId]);

  return {
    // State
    questions,
    selectedQuestionType,
    questionSaveStatuses,
    expandedQuestion,

    // Actions
    setQuestions,
    setSelectedQuestionType,
    setExpandedQuestion,
    addQuestion,
    updateQuestion,
    removeQuestion,
    saveQuestion,
  };
}; 