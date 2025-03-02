import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Lesson, Question, Activity } from '../api/types';

export type SaveProgress = 'idle' | 'saving' | 'saved' | 'error';

export const useLessonEditor = (currentLessonId: string | null) => {
  // Editor State
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [contentHeading, setContentHeading] = useState<string>('');
  const [lessonContent, setLessonContent] = useState<string>('');
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingHeading, setIsEditingHeading] = useState(false);
  const [saveProgress, setSaveProgress] = useState<SaveProgress>('idle');
  const isLoading = useRef(false);

  // Load lesson content when currentLessonId changes
  useEffect(() => {
    const loadContent = async () => {
      if (!currentLessonId || isLoading.current) return;
      isLoading.current = true;

      try {
        // Clear existing content first
        setLessonTitle('');
        setContentHeading('');
        setLessonContent('');
        
        // Fetch lesson data
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', currentLessonId)
          .single();

        if (lessonError) throw lessonError;

        // Set lesson data
        setLessonTitle(lessonData.title || '');
        setContentHeading(lessonData.contentheading || '');

        // Fetch lesson content
        const { data: contentData, error: contentError } = await supabase
          .from('lesson_content')
          .select('*')
          .eq('lesson_id', currentLessonId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (contentError) throw contentError;

        // Set content if available
        if (contentData?.content) {
          setLessonContent(
            Array.isArray(contentData.content) 
              ? contentData.content[0] 
              : typeof contentData.content === 'string'
                ? contentData.content
                : JSON.stringify(contentData.content)
          );
        }

      } catch (error) {
        console.error('Error loading lesson:', error);
        toast.error('Failed to load lesson content');
      } finally {
        isLoading.current = false;
      }
    };

    loadContent();

    // Cleanup function
    return () => {
      isLoading.current = false;
    };
  }, [currentLessonId]);

  // Save lesson content
  const saveLesson = useCallback(async () => {
    if (!currentLessonId) {
      toast.error('No lesson selected');
      return;
    }

    setSaveProgress('saving');

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!session?.user) {
        toast.error('Please sign in to save lesson');
        setSaveProgress('error');
        return;
      }

      // Save lesson metadata
      const lessonData = {
        id: currentLessonId,
        title: lessonTitle,
        contentheading: contentHeading,
        updated_at: new Date().toISOString(),
        user_id: session.user.id,
        metadata: {
          lastEdited: new Date().toISOString(),
          version: 1,
          status: 'draft'
        }
      };

      const { error: lessonError } = await supabase
        .from('lessons')
        .upsert(lessonData);

      if (lessonError) throw lessonError;

      // Save lesson content
      const { data: existingContent } = await supabase
        .from('lesson_content')
        .select('id')
        .eq('lesson_id', currentLessonId)
        .single();

      const contentData = {
        id: existingContent?.id || crypto.randomUUID(),
        lesson_id: currentLessonId,
        content: [lessonContent],
        content_type: 'html',
        metadata: {
          lastEdited: new Date().toISOString(),
          version: 1,
          status: 'draft'
        },
        user_id: session.user.id,
        updated_at: new Date().toISOString()
      };

      const { error: contentError } = await supabase
        .from('lesson_content')
        .upsert(contentData);

      if (contentError) throw contentError;

      setSaveProgress('saved');
      toast.success('Lesson saved successfully');

      // Reset save status after a delay
      setTimeout(() => {
        setSaveProgress('idle');
      }, 2000);

    } catch (error) {
      console.error('Error saving lesson:', error);
      setSaveProgress('error');
      toast.error('Failed to save lesson');
    }
  }, [currentLessonId, lessonTitle, contentHeading, lessonContent]);

  // Load lesson content (for refresh)
  const loadLessonContent = useCallback(async (lessonId: string) => {
    if (!lessonId || isLoading.current) return;
    isLoading.current = true;

    try {
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      setLessonTitle(lessonData.title || '');
      setContentHeading(lessonData.contentheading || '');

      const { data: contentData, error: contentError } = await supabase
        .from('lesson_content')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (contentError) throw contentError;

      if (contentData?.content) {
        setLessonContent(
          Array.isArray(contentData.content)
            ? contentData.content[0]
            : typeof contentData.content === 'string'
              ? contentData.content
              : JSON.stringify(contentData.content)
        );
      }

      toast.success('Content refreshed');
    } catch (error) {
      console.error('Error refreshing lesson:', error);
      toast.error('Failed to refresh content');
    } finally {
      isLoading.current = false;
    }
  }, []);

  return {
    // State
    lessonTitle,
    contentHeading,
    lessonContent,
    isContentEditorOpen,
    isEditingTitle,
    isEditingHeading,
    saveProgress,

    // Actions
    setLessonTitle,
    setContentHeading,
    setLessonContent,
    setIsContentEditorOpen,
    setIsEditingTitle,
    setIsEditingHeading,
    loadLessonContent,
    saveLesson,
  };
}; 