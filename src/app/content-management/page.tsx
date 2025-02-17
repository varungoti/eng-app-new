"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import Link from 'next/link';
import {  Activity as ActivityIcon,  ArrowLeft,  BookOpen,  ChevronDown,  ChevronRight,  Check,  Edit,  Eye,  EyeOff,  HelpCircle,  Layers,  List,  MessageSquare,  Plus,  Save,  Trash as Trash2, X, Pencil, Lock, Unlock, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { API_BASE_URL, QUESTION_TYPES, isQuestionType } from './constants';
import { ExercisePrompt, Lesson } from './types';
import { QuestionFormProps, ExercisePromptCardProps, Activity, Grade, Topic, Subtopic as SubTopic } from './types';
import { QuestionForm } from './components/question-form';
import { ExercisePromptCard } from './components/exercise-prompt-card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useContentStore } from '@/lib/content/store';
import { contentService } from '@/lib/content/ContentService';
import { MediaPreview } from '@/components/ui/media-preview';
import { QuestionTypeSelect } from './components/question-type-select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { debounce, isNull } from 'lodash';
import { PostgrestError } from '@supabase/supabase-js';
import { Question as ContentQuestion } from './types';  // Import the specific type


// Update the API endpoint to match your backend route
const API_ENDPOINT = process.env.VITE_API_URL || 'http://localhost:5173/api';

interface QuestionTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

// Add metadata type
interface LessonMetadata {
  lastEdited?: string;
  version?: number;
  tags?: string[];
  status?: 'draft' | 'published';
  authorId?: string;
  duration?: number;
  transcript?: string;
}

type ContentType = 'html' | 'markdown' | 'rich-text' | 'text' | 'json';

interface LessonContent {
  id: string;
  lesson_id: string;
  content: any[];
  metadata: {
    lastEdited?: string;
    version?: number;
    status?: 'draft' | 'published';
    authorId?: string;
  };
  content_type: string;
  order_index: number;
  updated_at: string;
  user_id: string;
}

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  placeholder?: string;
  className?: string;
}

// Add validation interface
interface QuestionValidation {
  isValid: boolean;
  message: string;
}

// Add this type validation helper
const getQuestionTypeFields = (type: string) => {
  switch (type) {
    case 'multipleChoice':
      return {
        required: ['prompt', 'options', 'correctAnswer'],
        fields: {
          prompt: '',
          options: [],
          correctAnswer: '',
          teacherScript: '',
          explanation: ''
        }
      };
    case 'fillInBlank':
      return {
        required: ['prompt', 'blanks'],
        fields: {
          prompt: '',
          blanks: [],
          teacherScript: '',
          explanation: ''
        }
      };
    case 'trueFalse':
      return {
        required: ['prompt', 'correctAnswer'],
        fields: {
          prompt: '',
          correctAnswer: null,
          teacherScript: '',
          explanation: ''
        }
      };
    case 'matching':
      return {
        required: ['prompt', 'pairs'],
        fields: {
          prompt: '',
          pairs: [],
          teacherScript: '',
          explanation: ''
        }
      };
    case 'ordering':
      return {
        required: ['prompt', 'items'],
        fields: {
          prompt: '',
          items: [],
          correctOrder: [],
          teacherScript: '',
          explanation: ''
        }
      };
    case 'shortAnswer':
      return {
        required: ['prompt', 'sampleAnswer'],
        fields: {
          prompt: '',
          sampleAnswer: '',
          teacherScript: '',
          explanation: '',
          keywords: []
        }
      };
    case 'speaking':
      return {
        required: ['prompt', 'sampleAnswer'],
        fields: {
          prompt: '',
          sampleAnswer: '',
          teacherScript: '',
          audioPrompt: '',
          pronunciation: ''
        }
      };
    case 'listening':
      return {
        required: ['prompt', 'audioContent'],
        fields: {
          prompt: '',
          audioContent: '',
          transcript: '',
          teacherScript: '',
          comprehensionQuestions: []
        }
      };
    case 'listenAndRepeat':
      return {
        required: ['prompt', 'audioContent'],
        fields: {
          prompt: '',
          audioContent: '',
          targetPhrase: '',
          teacherScript: '',
          pronunciation: ''
        }
      };
    default:
      return {
        required: ['prompt'],
        fields: {
          prompt: '',
          teacherScript: ''
        }
      };
  }
}

interface SaveStatus {
  id: string;
  status: 'draft' | 'saved' | 'saving' | 'error';
  lastSaved?: string;
}

interface Question {
  id: string;
  type: string;
  lesson_id: string;
  title: string;
  metadata: Record<string, any>;
  data: Record<string, any>; // This allows dynamic field access
  exercisePrompts: ExercisePrompt[];
  isDraft?: boolean;
}

// Add at the top of the file with other type definitions
type QuestionType = keyof typeof QUESTION_TYPES;

// Add this type guard function
const isValidQuestionType = (type: string): type is QuestionType => {
  return type in QUESTION_TYPES;
};

// Update handleAddQuestion


// Update validateQuestion
const validateQuestion = (question: Question): QuestionValidation => {
  const { required } = getQuestionTypeFields(question.type);
  const missingFields = required.filter(field => {
    const value = question.data?.[field];
    return !value || 
      (Array.isArray(value) && value.length === 0) || 
      (typeof value === 'string' && !value.trim());
  });

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required fields: ${missingFields.join(', ')}`
    };
  }

  return { isValid: true, message: '' };
};

// Add proper type for question data
interface QuestionData {
  id?: string;
  content?: string;
  type?: string;
  sampleAnswer?: string | null;
  data?: {
    prompt?: string;
    teacherScript?: string;
    followup_prompt?: string[];
    sampleAnswer?: string;
    answer?: string;
  } | null;
  prompt: string;
  teacherScript: string;
  followup_prompt: string[];
  answer?: string;
}

// In your component where you handle questions
const handleQuestionData = (question: QuestionData) => {
  return {
    ...question,
    data: {
      prompt: question?.data?.prompt || '',
      teacherScript: question?.data?.teacherScript || '',
      followup_prompt: question?.data?.followup_prompt || [],
      sampleAnswer: question?.data?.sampleAnswer || undefined,  // Convert null to undefined
      answer: question?.data?.answer || undefined  // Convert null to undefined
    } as const,
    sampleAnswer: question?.sampleAnswer || ''
  };
};

export default function LessonManagementPage() {
  // State declarations
  
  const [selectedGradeId, setSelectedGradeId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string>('');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [saveProgress, setSaveProgress] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [localBuffer, setLocalBuffer] = useState<{ timestamp: number; data: any } | null>(null);
  const [lastSavedToServer, setLastSavedToServer] = useState<number>(Date.now());
  const [selectedQuestionType, setSelectedQuestionType] = useState<string>('');
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [showHelpTips, setShowHelpTips] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<SubTopic[]>([]);
  const [contentHeading, setContentHeading] = useState<string>('');
    // Add with your other state declarations
  const [isContentExpanded, setIsContentExpanded] = useState<boolean>(false);
  const [modalState, setModalState] = useState({
    showAddGrade: false,
    showAddTopic: false,
    showAddSubtopic: false,
    showAddLesson: false
  });
  const [isViewMode, setIsViewMode] = useState<boolean>(true);
  const [expandedGrade, setExpandedGrade] = useState<string | null>(null);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const [newItemData, setNewItemData] = useState({
    name: '',
    description: ''
  });
  const [lessonContent, setLessonContent] = useState<string>('');
  const [isContentEditorOpen, setIsContentEditorOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingHeading, setIsEditingHeading] = useState<boolean>(false);
  const [isEditingDescription, setIsEditingDescription] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarLocked, setIsSidebarLocked] = useState(true);
  const [alertDialogState, setAlertDialogState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (value?: unknown) => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

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

  // Add new state for tracking save status
  interface SaveStatus {
    id: string;
    status: 'draft' | 'saved' | 'saving' | 'error' | 'draft';
    lastSaved?: string;
  }

  const [questionSaveStatuses, setQuestionSaveStatuses] = useState<Array<{
    id: string;
    status: 'idle' | 'saving' | 'saved' | 'error' | 'draft';
  }>>([]);
  const [promptSaveStatuses, setPromptSaveStatuses] = useState<SaveStatus[]>([]);

  // Add this state to track dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Event handlers
  const handleQuestionTypeChange = useCallback((type: string) => {
    if (isQuestionType(type)) {
      setSelectedQuestionType(type);
    }
  }, []);

  const handleAddQuestion = useCallback(() => {
    if (!selectedQuestionType || !isQuestionType(selectedQuestionType)) return;

    const defaultData = QUESTION_TYPES[selectedQuestionType].defaultData;
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: selectedQuestionType,
      data: {},
      title: 'New Question',
      lesson_id: currentLessonId || '',
      metadata: {},
      // data: {
      //   ...defaultData,
      //   prompt: '',
      //   teacherScript: ''
      // },
      exercisePrompts: [],
      isDraft: true
    };

    setQuestions(prev => [...prev, newQuestion]);
    setQuestionSaveStatuses(prev => [
      ...prev,
      { id: newQuestion.id, status: 'draft' }
    ]);
    setSelectedQuestionType('');
  }, [selectedQuestionType, currentLessonId]);

  const handleRemoveQuestion = async (index: number) => {
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
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      
      toast.success('Question and related prompts deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question and prompts');
    }
  };

  const handleUpdateQuestion = useCallback(async (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
    setQuestionSaveStatuses(prev => prev.map((status, i) => 
      i === index ? { ...status, status: 'draft' } : status
    ));
  }, [questions]);

  const handleAddExercisePrompt = useCallback((questionIndex: number) => {
    setQuestions(prev => prev.map((question, i) => {
      if (i === questionIndex) {
        return {
          ...question,
          exercisePrompts: [
            ...question.exercisePrompts,
            {
              id: crypto.randomUUID(),
              text: '',
              media: '',
              type: 'image',
              narration: 'Your turn',
              saytext: 'Say: ',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ]
        };
      }
      return question;
    }));
  }, []);

  const handleRemoveExercisePrompt = useCallback((questionIndex: number, promptIndex: number) => {
    setQuestions(prev => prev.map((question, i) => {
      if (i === questionIndex) {
        return {
          ...question,
          exercisePrompts: question.exercisePrompts.filter((_, j) => j !== promptIndex)
        };
      }
      return question;
    }));
  }, []);

  const handleExercisePromptChange = useCallback(async (
    questionIndex: number,
    promptIndex: number,
    updatedPrompt: ExercisePrompt
  ) => {
    try {
      const promptUpdate = {
        id: updatedPrompt.id,
        question_id: updatedPrompt.question_id,
        text: updatedPrompt.text,
        type: updatedPrompt.type,
        narration: updatedPrompt.narration,
        saytext: updatedPrompt.saytext,
        media: updatedPrompt.media,
        // Remove order_index as it's not in schema
        created_at: new Date().toISOString()
      };

      const { error: promptError } = await supabase
        .from('exercise_prompts')
        .upsert(promptUpdate)
        .select();

      if (promptError) throw promptError;

      // Update local state
      setQuestions(prev => prev.map((question, i) => {
        if (i === questionIndex) {
          const newPrompts = [...question.exercisePrompts];
          newPrompts[promptIndex] = updatedPrompt;
          return { ...question, exercisePrompts: newPrompts };
        }
        return question;
      }));

    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
    }
  }, []);

  const handleAddActivity = useCallback(() => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      lesson_id: currentLessonId || '',
      created_at: new Date().toISOString(),
      type: 'practice',
      title: '',
      name: '',
      instructions: '',
      media: [],
      data: {
        prompt: '',
        teacherScript: '',
        media: []
      }
    };
    setActivities(prev => [...prev, newActivity]);
  }, [currentLessonId]);

  const handleUpdateActivity = useCallback((index: number, updatedActivity: Activity) => {
    setActivities(prev => prev.map((activity, i) => i === index ? updatedActivity : activity));
  }, []);

  const handleRemoveActivity = useCallback((index: number) => {
    setActivities(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleExercisePromptUpdate = useCallback((questionIndex: number, promptIndex: number, updatedPrompt: ExercisePrompt) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].exercisePrompts[promptIndex] = updatedPrompt;
    handleUpdateQuestion(questionIndex, updatedQuestions[questionIndex]);
  }, [questions, handleUpdateQuestion]);

  const handleQuestionDataChange = useCallback((questionIndex: number, field: string, value: string) => {
    setQuestions(prev => prev.map((q, i) => 
      i === questionIndex 
        ? { 
            ...q, 
            data: { 
              prompt: q.data?.prompt || '',
              teacherScript: q.data?.teacherScript || '',
              ...q.data,
              [field]: value 
            } 
          }
        : q
    ));
  }, []);

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveLesson = async () => {
    try {
      if (!currentLessonId || !selectedSubtopicId) {
        toast.error('Please select a subtopic and lesson first');
        return;
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!session?.user) {
        toast.error('Please sign in to save lessons');
        return;
      }

      // Get user's role from session
      const userRole = session.user.user_metadata?.role;
      console.log('Current user role:', userRole);
      console.log('📝 Saving content heading:', {
        contentHeading,
        currentLessonId,
        selectedSubtopicId,
        timestamp: new Date().toISOString()
      });

      // Create metadata object
      const lessonMetadata = {
        lastEdited: new Date().toISOString(),
        version: 1,
        status: 'draft' 
      };

      // Complete lesson data with all fields
      const lessonData = {
        id: currentLessonId,
        title: lessonTitle,
        content: lessonContent,
        metadata: lessonMetadata, // Supabase will automatically handle JSON conversion
        content_type: 'html',
        lesson_type: 'lesson',
        grade_id: selectedGradeId,
        topic_id: selectedTopicId,
        subtopic_id: selectedSubtopicId,
        user_id: session.user.id,
        updated_at: new Date().toISOString(),
        role: userRole, // Include role in the payload
        description: '',
        prerequisites: [],
        media_type: 'image',
        media_url: '',
        contentheading: contentHeading || ''
      };

      console.log('📦 Data being sent to Supabase:', lessonData);

      // Save lesson with all fields
      const { data, error: lessonError } = await supabase
        .from('lessons')
        .upsert(lessonData, { 
          onConflict: 'id'
        })
        .select();

      if (lessonError) throw lessonError;

      // 2. Save lesson content
      const { data: existingContent } = await supabase
        .from('lesson_content')
        .select('id')
        .eq('lesson_id', currentLessonId)
        .single();

      const contentMetadata = {
        lastEdited: new Date().toISOString(),
        version: 1,
        status: 'draft'
      };

      const contentUpdate = {
        id: existingContent?.id || crypto.randomUUID(),
        lesson_id: currentLessonId,
        content: [lessonContent],
        metadata: contentMetadata, // Supabase will automatically handle JSON conversion
        content_type: 'html',
        user_id: session.user.id,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const { error: contentError } = await supabase
        .from('lesson_content')
        .upsert(contentUpdate, { onConflict: 'id' });

      if (contentError) throw contentError;

      // 3. Save questions
      for (const question of questions) {
        const questionData = {
          id: question.id,
          lesson_id: currentLessonId,
          type: question.type,
          title: question.title,
          metadata: question.metadata,
          data: question.data,
          updated_at: new Date().toISOString(),
          user_id: session.user.id
        };

        const { error: questionError } = await supabase
          .from('questions')
          .upsert(questionData, { onConflict: 'id' });

        if (questionError) throw questionError;

        //4. Save exercise prompts for this question
        if (question.exercisePrompts) {
          for (const prompt of question.exercisePrompts) {
            const promptData = {
              id: prompt.id,
              question_id: question.id,
              text: prompt.text,
              media: prompt.media,
              type: prompt.type,
              narration: prompt.narration,
              saytext: prompt.saytext,
              user_id: session.user.id,
              updated_at: new Date().toISOString()
            };

            const { error: promptError } = await supabase
              .from('exercise_prompts')
              .upsert(promptData, { onConflict: 'id' });

            if (promptError) throw promptError;
          }
        }
      }

      // 5. Save activities
      if (activities.length > 0) {
        const activitiesData = activities.map(activity => ({
          id: activity.id,
          lesson_id: currentLessonId,
          type: activity.type,
          title: activity.title,
          name: activity.name,
          instructions: activity.instructions,
          media: activity.media,
          data: activity.data,
          created_at: new Date().toISOString()
        }));

        const { error: activitiesError } = await supabase
          .from('activities')
          .upsert(activitiesData, { onConflict: 'id' });

        if (activitiesError) throw activitiesError;
      }

      // After successful save
      console.log('✅ Content heading saved successfully:', {
        contentHeading,
        lessonId: currentLessonId,
        timestamp: new Date().toISOString()
      });

      toast.success('Lesson saved successfully');
    } catch (err) {
      const error = err as PostgrestError;
      console.error('❌ Error saving content heading:', {
        error: error.message,
        contentHeading,
        lessonContent,
        lessonId: currentLessonId,
        timestamp: new Date().toISOString()
      });
      toast.error(`Failed to save lesson: ${error.message}`);


    }
  };

  const handleSaveQuestion = async (question: Question, index: number) => {
    const loadingToast = toast.loading(`Saving question ${index + 1}...`);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to save question', { id: loadingToast });
        return;
      }

      // Save question
      const questionData = {
        id: question.id,
        lesson_id: currentLessonId,
        type: question.type,
        title: question.title,
        metadata: question.metadata,
        data: {
          prompt: question.data?.prompt ?? '',
          teacherScript: question.data?.teacherScript ?? '',
          followup_prompt: question.data?.followup_prompt ?? [],
          sampleAnswer: question.data?.sampleAnswer || undefined,  // Convert null to undefined
          answer: question.data?.answer || undefined  // Convert null to undefined
        } as const,
        user_id: session.user.id,
        updated_at: new Date().toISOString()
      };

      const { error: questionError } = await supabase
        .from('questions')
        .upsert(questionData, { onConflict: 'id' });

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
            .upsert(promptData, { onConflict: 'id' });

          if (promptError) throw promptError;
        }
      }

      toast.success(`Question ${index + 1} saved successfully`, { id: loadingToast });
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error(`Failed to save question ${index + 1}`, { id: loadingToast });
    }
  };

  const handleSaveActivity = async (activity: Activity) => {
    try {
      await contentService.saveActivity(activity);
      toast.success('Activity saved');
    } catch (error) {
      console.error('Failed to save activity:', error);
      toast.error('Failed to save activity');
    }
  };

  // Effects
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const { data, error } = await supabase
          .from('grades')
          .select('*')
          .order('name');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data) {
          throw new Error('No data returned from Supabase');
        }

        // Map the grades to match your interface
        const validGrades = data.map((grade: any) => ({
          _id: grade.id,
          id: grade.id,
          name: grade.name,
          level: grade.level || 0,  // Add default value if not provided
          orderIndex: grade.order_index || 0,  // Add default value if not provided
          topics: []
        }));
        
        setGrades(validGrades);
      } catch (error) {
        console.error('Error fetching grades:', error);
        toast.error('Failed to fetch grades');
      }
    };

    fetchGrades();
  }, []);

  // Topic Selection
  useEffect(() => {
    const fetchTopics = async () => {
      if (!selectedGradeId) return;
      
      try {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .eq('grade_id', selectedGradeId)
          .order('title');

        if (error) {
          throw error;
        }

        // Map the topics to match your interface
        const validTopics = (data || []).map((topic: any) => ({
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
    };

    fetchTopics();
  }, [selectedGradeId]);

  // Subtopic Selection
  useEffect(() => {
    const fetchSubtopics = async () => {
      if (!selectedTopicId) return;
      
      try {
        // Use content service to fetch subtopics
        const subtopicsData = await contentService.fetchSubtopics(selectedTopicId);
        console.log('Fetched subtopics:', subtopicsData);

        const validSubtopics = subtopicsData.map((subtopic: any) => ({
          id: subtopic.id,
          title: subtopic.title,
          description: subtopic.description,
          topic_id: subtopic.topic_id,
          lessons: [],
          order_index: subtopicsData.length
        }));
        
        setSubtopics(validSubtopics);
        
        // Update global state
        if (selectedSubtopic) {
          setSelectedSubtopic(selectedSubtopic);
        }
      } catch (err) {
        const error = err as Error;
        console.error('Error fetching subtopics:', error);
        toast.error('Failed to fetch subtopics');
      }
    };

    fetchSubtopics();
  }, [selectedTopicId, selectedSubtopic, setSelectedSubtopic]);

  // Add effect to monitor subtopics state
  useEffect(() => {
    console.log('Current subtopics state:', subtopics);
  }, [subtopics]);

  // Add fetchLessons function
  const fetchLessons = useCallback(async () => {
    if (!selectedSubtopicId) return;
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('subtopic_id', selectedSubtopicId)
        .order('title');

      if (error) {
        throw error;
      }
      
      // Map the lessons to ensure they have _id
      const validLessons = (data || []).map((lesson: any) => ({
        ...lesson,
        _id: lesson._id || lesson.id, // Use _id if available, otherwise use id
        title: lesson.title || 'Untitled Lesson'
      })).filter((lesson: any) => lesson._id); // Only include lessons with valid IDs
      
      setLessons(validLessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Failed to fetch lessons');
    }
  }, [selectedSubtopicId]);
  // Add loadLessonContent function
  const isLoading = useRef(false);
  const loadLessonContent = useCallback(async (lessonId: string) => {
    // Prevent multiple simultaneous loads
    if (isLoading.current) return;
    isLoading.current = true;

    const controller = new AbortController();

    try {
      // Clear existing content first
      setLessonTitle('');
      setContentHeading('');
      setLessonContent('');
      setQuestions([]);
      
      // First fetch lesson data
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()
        

      if (lessonError) {
        console.error('Lesson fetch error:', lessonError);
        throw lessonError;
      }

      // Set lesson data
      setLessonTitle(lessonData.title || '');
      setContentHeading(lessonData.content || '');

      // Then fetch lesson content with explicit headers
      const { data: contentData, error: contentError } = await supabase
        .from('lesson_content')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (contentError) {
        console.error('Content fetch error:', contentError);
        throw contentError;
      }

      // Set content if available
      if (contentData?.content) {
        setLessonContent(typeof contentData.content === 'string' 
          ? contentData.content 
          : JSON.stringify(contentData.content)
        );
      }

    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      console.error('Error loading lesson:', error);
      toast.error('Failed to load lesson content');
      
      // Reset states on error
      setLessonTitle('');
      setContentHeading('');
      setLessonContent('');
      setQuestions([]);
    } finally {
      isLoading.current = false;
    }

    return () => {
      controller.abort();
    };
  }, []); // Empty dependencies since we're using closure over state setters

  // // Add effect for fetching lessons when subtopic changes
  useEffect(() => {
    if (selectedSubtopicId) {
      fetchLessons();
    }
  }, [selectedSubtopicId, fetchLessons]);

  // Add effect for loading lesson content when currentLessonId changes
    useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const loadContent = async () => {
      if (!currentLessonId || !isMounted) return;

      // Clear previous timeout if exists
      if (timeoutId) clearTimeout(timeoutId);

      // Set new timeout for debouncing
      timeoutId = setTimeout(() => {
        if (isMounted) {
          loadLessonContent(currentLessonId);
        }
      }, 300);
    };

    loadContent();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (isLoading.current) isLoading.current = false;
    };
  }, [currentLessonId]); // Remove loadLessonContent from dependencies

  useEffect(() => {
    console.log('Current lessons state:', lessons);
  }, [lessons]);

    // Add keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveLesson();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSaveLesson]);

  // Add SaveFeedback component
  const SaveFeedback = useCallback(() => {
    if (saveProgress === 'idle') return null;

    return (
    <div className="fixed bottom-4 right-4">
      {saveProgress === 'saving' && (
        <div className="flex items-center gap-2 bg-background border rounded-lg px-4 py-2 shadow-lg">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span className="text-sm">Saving changes...</span>
        </div>
      )}
      {saveProgress === 'saved' && (
        <div className="flex items-center gap-2 bg-green-500 text-white rounded-lg px-4 py-2 shadow-lg">
          <Check className="h-4 w-4" />
          <span className="text-sm">Changes saved</span>
        </div>
      )}
      {saveProgress === 'error' && (
        <div className="flex items-center gap-2 bg-destructive text-destructive-foreground rounded-lg px-4 py-2 shadow-lg">
          <X className="h-4 w-4" />
          <span className="text-sm">Error saving changes</span>
        </div>
      )}
    </div>
  );
  }, [saveProgress]);

  // Update handlers
  const handleGradeSelect = (gradeId: string) => {
    // Always keep sidebar open during selection
    setIsSidebarCollapsed(false);
    setIsSidebarLocked(true);
    
    // Batch state updates
    requestAnimationFrame(() => {
      setSelectedGradeId(gradeId);
      setSelectedGrade(gradeId);
      setSelectedTopicId(null);
      setSelectedTopic('');
      setSelectedSubtopicId(null);
      setSelectedSubtopic('');
      setCurrentLessonId(null);
      
      if (isViewMode) {
        setExpandedGrade(gradeId);
      }
    });
  };

  const handleTopicSelect = (value: string) => {
    setSelectedTopicId(value);
    setSelectedTopic(value);
    setSelectedSubtopicId(null);
    setSelectedSubtopic('');
    setCurrentLessonId(null);
  };

  const handleSubtopicSelect = (value: string) => {
    setSelectedSubtopicId(value);
    setSelectedSubtopic(value);
    setCurrentLessonId(null);
  };

  const handleLessonSelect = async (lessonId: string) => {
    try {
      // Lock sidebar during selection
      setIsSidebarLocked(true);
      setIsSidebarCollapsed(false);
      setCurrentLessonId(lessonId);
      
      // 1. Fetch lesson data
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      // 2. Fetch questions with exercise prompts
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          exercise_prompts (*)
        `)
        .eq('lesson_id', lessonId);

      if (questionsError) throw questionsError;

      // 3. Fetch activities - removed order_index
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activities')
        .select('*')
        .eq('lesson_id', lessonId);

      if (activitiesError) throw activitiesError;

      // Format questions with their exercise prompts
      const formattedQuestions = questionsData?.map(q => ({
        ...q,
        data: q.data || {},
        exercisePrompts: q.exercise_prompts || []
      })) || [];

      // Set all states
      setLessonTitle(lessonData.title || '');
      setLessonContent(lessonData.content || '');
      setQuestions(formattedQuestions);
      setActivities(activitiesData || []);

      // After successful load, unlock sidebar and allow collapse
      setTimeout(() => {
        setIsSidebarLocked(false);
        if (!isSidebarLocked) {
          setIsSidebarCollapsed(true);
        }
      }, 300);

    } catch (error) {
      console.error('Error loading lesson:', error);
      toast.error('Failed to load lesson');
      // Reset states on error
      setLessonTitle('');
      setLessonContent('');
      setQuestions([]);
      setActivities([]);
    }
    if (!isSidebarLocked) {
      setIsSidebarCollapsed(true);
    }
  };

  // Update the expansion handlers
  const handleTopicExpand = (topicId: string | null) => {
    setExpandedTopic(expandedTopic === topicId ? null : topicId);
  };

  const handleSubtopicExpand = (subtopicId: string | null) => {
    setExpandedSubtopic(expandedSubtopic === subtopicId ? null : subtopicId);
  };

  const handleQuestionExpand = (index: number) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  const handleActivityExpand = (index: number) => {
    setExpandedActivity(expandedActivity === index ? null : index);
  };

  // Add effect to save mode changes to localStorage
  useEffect(() => {
    localStorage.setItem('lessonManagementViewMode', isViewMode.toString());
  }, [isViewMode]);

  // Add handlers for creating new items
  const handleCreateGrade = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemData.name })
      });

      if (!response.ok) throw new Error('Failed to create grade');
      const data = await response.json();
      
      if (!data.success) throw new Error(data.message || 'Failed to create grade');
      
      // Update grades list
      setGrades([...grades, data.data.grade]);
      setModalState({ ...modalState, showAddGrade: false });
      setNewItemData({ name: '', description: '' });
      toast.success('Grade created successfully');
    } catch (error) {
      console.error('Error creating grade:', error);
      toast.error('Failed to create grade');
    }
  };

  const handleCreateTopic = async () => {
    if (!selectedGradeId) {
      toast.error('Please select a grade first');
      return;
    }

    try {
      const newTopic = await contentService.createTopic({
        title: newItemData.name, // Map from newItemData.name to title
        description: newItemData.description,
        gradeId: selectedGradeId
      });

      setTopics(prev => [...prev, newTopic]);
      toast.success('Topic created successfully');
      setModalState({ ...modalState, showAddTopic: false });
      setNewItemData({ name: '', description: '' });
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      console.error('Error creating topic:', error);
      toast.error('Failed to create topic');
    }
  };
    
  


  const handleCreateSubtopic = async (data: { title: string; description?: string }) => {
    try {
      if (!selectedTopicId) {
        toast.error('Please select a topic first');
        return;
      }

      const newSubtopic = await contentService.createSubtopic({
        ...data,
        topicId: selectedTopicId
      });

      setSubtopics(prev => [...prev, {
        _id: newSubtopic.id,
        id: newSubtopic.id,
        name: newSubtopic.title,
        title: newSubtopic.title,
        description: newSubtopic.description,
        topic_id: newSubtopic.topic_id,
        orderIndex: prev.length,
        lessons: []
      }]);

      toast.success('Subtopic created successfully');
      setModalState(prev => ({ ...prev, showAddSubtopic: false }));
    } catch (err) {
      const error = err as Error;
      console.error('Error creating subtopic:', error);
      toast.error('Failed to create subtopic');
    }
  };

  const handleUpdateSubtopic = async (subtopicId: string, data: { title: string; description?: string }) => {
    try {
      const { data: updatedSubtopic, error } = await supabase
        .from('sub_topics')
        .update(data)
        .eq('id', subtopicId)
        .select()
        .single();

      if (error) throw error;
      
      setSubtopics(prev => prev.map(subtopic => 
        subtopic.id === subtopicId 
          ? {
              ...subtopic,
              name: updatedSubtopic.title
            }
          : subtopic
      ));

      toast.success('Subtopic updated successfully');
    } catch (err) {
      const error = err as Error;
      console.error('Error updating subtopic:', error);
      toast.error('Failed to update subtopic');
    }
  };

  const handleDeleteSubtopic = async (subtopicId: string) => {
    try {
      await contentService.deleteSubtopic(subtopicId);
      setSubtopics(prev => prev.filter(subtopic => subtopic.id !== subtopicId));
      setSelectedSubtopicId(null);
      toast.success('Subtopic deleted successfully');
    } catch (err) {
      const error = err as Error;
      console.error('Error deleting subtopic:', error);
      toast.error('Failed to delete subtopic');
    }
  };

  const handleCreateLesson = async () => {
    if (!selectedSubtopicId) {
      toast.error('Please select a subtopic first');
      return;
    }

    try {
      // First create the lesson
      const { data: newLesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
          title: newItemData.name,
          subtopic_id: selectedSubtopicId,
          content: '', // Empty rich text content initially
          status: 'draft'
        })
        .select()
        .single();

      if (lessonError) throw lessonError;

      // Create initial question
      const { data: newQuestion, error: questionError } = await supabase
        .from('questions')
        .insert({
          lesson_id: newLesson.id,
          type: 'speaking', // default type
          title: 'Question 1',
          data: {
            prompt: '',
            teacherScript: '',
            options: []
          },
          order_index: 0
        })
        .select()
        .single();

      if (questionError) throw questionError;

      // Create initial exercise prompts for the question
      const { error: promptsError } = await supabase
        .from('exercise_prompts')
        .insert([
          {
            question_id: newQuestion.id,
            text: '',
            type: 'image',
            narration: '',
            saytext: '',
            media: [],
            order_index: 0
          },
          {
            question_id: newQuestion.id,
            text: '',
            type: 'gif',
            narration: '',
            saytext: '',
            media: [],
            order_index: 1
          }
        ]);

      if (promptsError) throw promptsError;

      // Create initial activity
      // const { error: activityError } = await supabase
      //   .from('activities')
      //   .insert({
      //     lesson_id: newLesson.id,
      //     type: 'practice',
      //     title: '',
      //     instructions: '',
      //     media: [],
      //     data: {
      //       prompt: '',
      //       teacherScript: '',
      //       media: []
      //     },
      //     order_index: 0
      //   });

      // if (activityError) throw activityError;

      // Update UI state
      setLessons(prev => [...prev, newLesson]);
      setCurrentLessonId(newLesson.id);
      setLessonTitle(newLesson.title);
      setModalState({ ...modalState, showAddLesson: false });
      setNewItemData({ name: '', description: '' });
      toast.success('Lesson created successfully');

    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Failed to create lesson');
    }
  };

  // Effect to handle localStorage after mount
  useEffect(() => {
    const storedMode = localStorage.getItem('lessonManagementViewMode');
    if (storedMode !== null) {
      setIsViewMode(storedMode === 'true');
    }
  }, []);

  // Update the cleanupModalState function
  const cleanupModalState = useCallback(() => {
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
    setModalState({
      showAddGrade: false,
      showAddTopic: false,
      showAddSubtopic: false,
      showAddLesson: false
    });
    setNewItemData({ name: '', description: '' });
  }, []);

  // Add a function to handle modal state changes
  const handleModalStateChange = useCallback((modalType: keyof typeof modalState, open: boolean) => {
    if (!open) {
      cleanupModalState();
    } else {
      setModalState(prev => ({ ...prev, [modalType]: open }));
    }
  }, [cleanupModalState]);

  const handleContentSave = async (content: string) => {
    const loadingToast = toast.loading("Saving content...", {
      action: {
        label: "Close",
        onClick: () => toast.dismiss()
      }
    });
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error('Please sign in to save content', { id: loadingToast });
        return;
      }

      // Get the most recent content entry
      const { data: existingContent, error: checkError } = await supabase
        .from('lesson_content')
        .select('id')
        .eq('lesson_id', currentLessonId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // If content exists, update it; if not, insert new
      const { error } = await supabase
        .from('lesson_content')
        .upsert({
          id: existingContent?.id, // This ensures we update if id exists
          lesson_id: currentLessonId,
          content: [content],
          content_type: 'text',
          metadata: {
            heading: contentHeading
          },
          user_id: session.user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'  // This ensures we update based on lesson_id
        });

      if (error) throw error;

      // Save questions separately
      for (const question of questions) {
        const { exercisePrompts, ...questionData } = question; // Remove exercisePrompts from question data
        
        // Save question
        const { error: questionError } = await supabase
          .from('questions')
          .upsert(questionData, {
            onConflict: 'id'
          })
          .select();

        if (questionError) throw questionError;

        // Save exercise prompts
        if (exercisePrompts?.length > 0) {
          for (const prompt of exercisePrompts) {
            const { error: promptError } = await supabase
              .from('exercise_prompts')
              .upsert(prompt, {
                onConflict: 'id'
              })
              .select();

            if (promptError) throw promptError;
          }
        }
      }
      
      toast.success("Content saved successfully", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss()
        },
        id: loadingToast,
      });
      setIsContentEditorOpen(false);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error("Failed to save content", {
        action: {
          label: "Close",
          onClick: () => toast.dismiss()
        },
        id: loadingToast,
      });
    }
  };

  // Add this component for inline editing
  const InlineEdit = ({ 
    value, 
    onSave, 
    isEditing, 
    setIsEditing, 
    placeholder,
    className = ""
  }: InlineEditProps) => {
    const [tempValue, setTempValue] = useState(value);
    
    return isEditing ? (
      <div className="flex items-center gap-2">
        <Input
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          placeholder={placeholder}
          className={className}
          autoFocus
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            onSave(tempValue);
            setIsEditing(false);
          }}
        >
          <Check className="h-4 w-4 text-green-500" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(false)}
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ) : (
      <div 
        className="group flex items-center gap-2 cursor-pointer"
        onClick={() => setIsEditing(true)}
      >
        <span className={className}>{value || placeholder}</span>
        <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    );
  };

  // Add this effect to handle auto-collapse after lesson selection
  useEffect(() => {
    if (currentLessonId && selectedGradeId && selectedTopicId && selectedSubtopicId) {
      setIsSidebarLocked(false);
      // Optional: add a slight delay before collapsing
      setTimeout(() => setIsSidebarCollapsed(true), 300);
    }
  }, [currentLessonId, selectedGradeId, selectedTopicId, selectedSubtopicId]);

  // Add individual save handlers
  // const handleSaveQuestion = async (question: Question, index: number) => {
  //   try {
  //     // Update status to saving
  //     setQuestionSaveStatuses(prev => [
  //       ...prev.filter(s => s.id !== question.id),
  //       { id: question.id, status: 'saving' }
  //     ]);

  //     const questionUpsert = {
  //       id: question.id,
  //       lesson_id: currentLessonId,
  //       type: question.type,
  //       title: question.data?.prompt || 'Untitled Question',
  //       metadata: question.metadata || {},
  //       data: {
  //         prompt: question.data?.prompt || '',
  //         teacherScript: question.data?.teacherScript || '',
  //         ...question.data
  //       },
  //       order_index: index,
  //       created_at: new Date().toISOString(),
  //       updated_at: new Date().toISOString()
  //     };

  //     const { error: questionError } = await supabase
  //       .from('questions')
  //       .upsert(questionUpsert);

  //     if (questionError) throw questionError;

  //     // Update status to saved
  //     setQuestionSaveStatuses(prev => [
  //       ...prev.filter(s => s.id !== question.id),
  //       { id: question.id, status: 'saved', lastSaved: new Date().toISOString() }
  //     ]);

  //     toast.success(`Question ${index + 1} saved successfully`);
  //   } catch (error) {
  //     console.error('Error saving question:', error);
  //     setQuestionSaveStatuses(prev => [
  //       ...prev.filter(s => s.id !== question.id),
  //       { id: question.id, status: 'error' }
  //     ]);
  //     toast.error(`Failed to save question ${index + 1}`);
  //   }
  // };

  const handleSavePrompt = async (questionId: string, prompt: ExercisePrompt, promptIndex: number) => {
    try {
      setPromptSaveStatuses(prev => [
        ...prev.filter(s => s.id !== prompt.id),
        { id: prompt.id || '', status: 'saving' } as SaveStatus
      ]);

      const promptUpsert = {
        id: prompt.id,
        question_id: questionId,
        text: prompt.text || '',
        type: prompt.type || 'text',
        narration: prompt.narration || '',
        saytext: prompt.saytext || '',
        media: prompt.media || [],
        order_index: promptIndex,
        created_at: prompt.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: promptError } = await supabase
        .from('exercise_prompts')
        .upsert(promptUpsert);

      if (promptError) throw promptError;

      setPromptSaveStatuses(prev => [
        ...prev.filter(s => s.id !== prompt.id),
        { id: prompt.id || '', status: 'saved', lastSaved: new Date().toISOString() } as SaveStatus
      ]);

      toast.success(`Prompt ${promptIndex + 1} saved successfully`);
    } catch (error) {
      console.error('Error saving prompt:', error);
      setPromptSaveStatuses(prev => [
        ...prev.filter(s => s.id !== prompt.id),
        { id: prompt.id || '', status: 'error' } as SaveStatus
      ]);
      toast.error(`Failed to save prompt ${promptIndex + 1}`);
    }
  };

  // Add effect to mark items as draft when edited
  useEffect(() => {
    questions.forEach(question => {
      if (!questionSaveStatuses.find(s => s.id === question.id)) {
        setQuestionSaveStatuses(prev => [
          ...prev,
          { id: question.id, status: 'draft' }
        ]);
      }
    });
  }, [questions]);

  // Add this function with your other handlers
  const handleRefreshLesson = async () => {
    if (!currentLessonId) {
      toast.error('No lesson selected');
      return;
    }
    
    try {
      toast.loading('Refreshing lesson content...', {
        action: {
          label: "Close",
          onClick: () => toast.dismiss()
        },
      });
      await handleLessonSelect(currentLessonId);
      toast.success('Content refreshed', {
        action: {
          label: "Close",
          onClick: () => toast.dismiss()
        },
      });
    } catch (error) {
      console.error('Error refreshing lesson:', error);
      toast.error('Failed to refresh content', {
        action: {
          label: "Close",
          onClick: () => toast.dismiss()
        },
      });
    }
  };

  // Add this function to handle refresh
  const handleRefreshContent = async () => {
    if (!currentLessonId) {
      toast.error('No lesson selected');
      return;
    }
    
    toast.loading('Refreshing content...');
    try {
      await loadLessonContent(currentLessonId);
      toast.success('Content refreshed');
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error('Failed to refresh content');
    }
  };

  // Update the sidebar hover mechanism
  const handleSidebarHover = useCallback(
    debounce((isHovering: boolean) => {
      if (!isSidebarLocked && !isNavigating && !isDropdownOpen) {
        if (isHovering || document.activeElement?.closest('.sidebar-content')) {
          setIsSidebarCollapsed(false);
        } else {
          setTimeout(() => {
            if (!isDropdownOpen) { // Only collapse if dropdown is closed
              setIsSidebarCollapsed(true);
            }
          }, 300);
        }
      }
    }, 100),
    [isSidebarLocked, isNavigating, isDropdownOpen]
  );

  // Update the sidebar JSX
  <div 
    className={cn(
      "transition-all duration-300 ease-in-out relative",
      isSidebarCollapsed ? "w-20" : "w-80",
      "flex-shrink-0 group"
    )}
    onMouseEnter={() => {
      handleSidebarHover(true);
      // Immediately expand on mouse enter
      if (!isSidebarLocked) {
        setIsSidebarCollapsed(false);
      }
    }}
    onMouseLeave={() => {
      // Only collapse if not interacting with content
      if (!document.activeElement?.closest('.sidebar-content')) {
        handleSidebarHover(false);
      }
    }}
    onFocus={() => setIsSidebarCollapsed(false)}
  >
    <Card className={cn(
      "h-full relative sidebar-content", // Added sidebar-content class
      "transition-shadow duration-300",
      "hover:shadow-lg"
    )}>
      {/* Rest of sidebar content */}
    </Card>
  </div>

  // Update the sidebar and card styles
  return (
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          {/* ... header content ... */}
          <div className="flex items-center gap-4">
            <Link href="/super-admin">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Lesson Management</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefreshLesson}
                className="ml-2"
                title="Refresh lesson content"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Create and manage your educational content</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHelpTips(!showHelpTips)}
              className="gap-2"
            >
              {showHelpTips ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showHelpTips ? 'Hide Tips' : 'Show Tips'}
            </Button>
          </div>
        </div>
        
        {/* Main content wrapper - Fix the layout here */}
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Improved sidebar */}
          <div 
            className={cn(
              "transition-all duration-300 ease-in-out relative",
              isSidebarCollapsed ? "w-20" : "w-80",
              "flex-shrink-0 group"
            )}
            onMouseEnter={() => {
              handleSidebarHover(true);
              // Immediately expand on mouse enter
              if (!isSidebarLocked) {
                setIsSidebarCollapsed(false);
              }
            }}
            onMouseLeave={() => {
              // Only collapse if not interacting with content
              if (!document.activeElement?.closest('.sidebar-content')) {
                handleSidebarHover(false);
              }
            }}
            onFocus={() => setIsSidebarCollapsed(false)}
          >
            <Card className={cn(
              "h-full relative sidebar-content", // Added sidebar-content class
              "transition-shadow duration-300",
              "hover:shadow-lg"
            )}>
              {/* Lock button - only show after lesson selection */}
              {currentLessonId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => {
                    setIsSidebarLocked(!isSidebarLocked);
                    if (!isSidebarLocked) {
                      setIsSidebarCollapsed(false);
                    }
                  }}
                >
                  {isSidebarLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
              )}

              {/* Sidebar content with overflow handling */}
              <div className={cn(
                "transition-all duration-300 overflow-hidden",
                isSidebarCollapsed ? "opacity-0" : "opacity-100"
              )}>
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">Content Management</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Manage your educational content here</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      </div>
                    <CardDescription>Create and manage your lessons</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* View/Edit Mode Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                      <Button
                        variant={isViewMode ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setIsViewMode(true)}
                        className="w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant={!isViewMode ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setIsViewMode(false)}
                        className="w-full"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    {/* Grade Selection */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="grade-select">Grade</Label>
                        {isViewMode && (
                          <Button variant="ghost" size="sm" onClick={() => setExpandedGrade(expandedGrade ? null : selectedGrade)}>
                            {expandedGrade ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                      <Select 
                        value={selectedGradeId || ''}
                        onValueChange={handleGradeSelect}
                        onOpenChange={(open) => {
                          if (open) {
                            // Force sidebar to stay open and lock it
                            setIsSidebarCollapsed(false);
                            setIsSidebarLocked(true);
                          }
                        }}
                      >
                        <SelectTrigger 
                          id="grade-select" 
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent event bubbling
                            setIsSidebarCollapsed(false);
                            setIsSidebarLocked(true);
                          }}
                        >
                          <SelectValue placeholder="Select Grade" />
                        </SelectTrigger>
                        <SelectContent 
                          onCloseAutoFocus={(e) => {
                            e.preventDefault();
                            setIsSidebarLocked(true);
                            setIsSidebarCollapsed(false);
                          }}
                        >
                          {grades.map((grade: Grade) => (
                            <SelectItem 
                              key={`grade-${grade.id || 'new'}`} 
                              value={grade.id || ''}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary" />
                                {grade.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!isViewMode && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full gap-2"
                        onClick={() => setModalState({ ...modalState, showAddGrade: true })}
                      >
                        <Plus className="h-4 w-4" />
                        Add New Grade
                      </Button>
                      )}
                    </div>

                    {/* Content Tree View in View Mode */}
                    {isViewMode && expandedGrade && (
                      <div className="mt-4 space-y-4">
                        {topics.map((topic: Topic) => (
                          <Card key={topic.id} className="border-l-4 border-l-primary">
                            <CardHeader className="py-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{topic.title}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleTopicExpand(topic.id || '')}
                                >
                                  {expandedTopic === topic.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </Button>
                              </div>
                            </CardHeader>
                            {expandedTopic === topic.id && (
                              <CardContent className="py-0 pl-4">
                                {subtopics
                                  .filter(subtopic => subtopic.topic_id === topic.id)
                                  .map((subtopic: SubTopic) => (
                                    <div key={subtopic.id} className="mb-3 last:mb-0">
                                      <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-medium">{subtopic.name}</span>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => handleSubtopicExpand(subtopic.id || '')}
                                        >
                                          {expandedSubtopic === subtopic.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                        </Button>
                                      </div>
                                      {expandedSubtopic === subtopic.id && (
                                        <div className="pl-4 space-y-2">
                                          {lessons
                                            .filter(lesson => lesson.subtopic_id === subtopic.id)
                                            .map((lesson: Lesson) => (
                                              <div
                                                key={lesson.id}
                                                className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-accent cursor-pointer"
                                                onClick={() => {
                                                  const lessonId = lesson.id || '';
                                                  const topicId = topic.id || '';
                                                  const subtopicId = subtopic.id || '';
                                                  
                                                  setCurrentLessonId(lessonId);
                                                  setSelectedTopicId(topicId);
                                                  setSelectedSubtopicId(subtopicId);
                                                }}
                                              >
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{lesson.title}</span>
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Regular Edit Mode Content */}
                    {!isViewMode && (
                      <>
                        {/* Existing Topic, Subtopic, and Lesson Selection UI */}
                      {/* Topic Selection */}
                        {selectedGradeId && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                        <Label htmlFor="topic-select">Topic</Label>
                        </div>
                        <Select 
                              value={selectedTopicId || ''} 
                              onValueChange={handleTopicSelect}
                        >
                          <SelectTrigger id="topic-select" className="w-full">
                            <SelectValue placeholder="Select Topic" />
                          </SelectTrigger>
                          <SelectContent>
                                {topics.map((topic: Topic) => (
                                  <SelectItem 
                                    key={`topic-${topic.id || 'new'}`} 
                                    value={topic.id || ''}
                                  >
                                  <div className="flex items-center gap-2">
                                  <Layers className="h-4 w-4 text-primary" />
                                    {topic.title}
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full gap-2"
                          onClick={() => setModalState({ ...modalState, showAddTopic: true })}
                        >
                          <Plus className="h-4 w-4" />
                          Add New Topic
                        </Button>
                      </div>
                    )}

                    {/* Subtopic Selection */}
                        {selectedTopicId && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                        <Label htmlFor="subtopic-select">Subtopic</Label>
                        </div>
                        <Select 
                              value={selectedSubtopicId || ''} 
                              onValueChange={handleSubtopicSelect}
                        >
                          <SelectTrigger id="subtopic-select" className="w-full">
                            <SelectValue placeholder="Select Subtopic" />
                          </SelectTrigger>
                          <SelectContent>
                                {subtopics
                                  .filter(subtopic => subtopic.id)
                                  .map((subtopic, index) => (
                                    <SelectItem 
                                      key={subtopic.id || `subtopic-${index}`}
                                      value={subtopic.id || ''}
                                    >
                                      {subtopic.title || 'Untitled Subtopic'}
                                    </SelectItem>
                                  ))}
                          </SelectContent>
                        </Select>
                        {!isViewMode && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full gap-2"
                            onClick={() => setModalState({ ...modalState, showAddSubtopic: true })}
                          >
                            <Plus className="h-4 w-4" />
                            Add New Subtopic
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Lesson Selection */}
                        {selectedSubtopicId && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="lesson-select">Lesson</Label>
                        </div>
                          <Select 
                            value={currentLessonId || ''} 
                            onValueChange={handleLessonSelect}
                            onOpenChange={(open) => {
                              setIsDropdownOpen(open);
                              if (open) {
                                setIsSidebarCollapsed(false);
                                setIsSidebarLocked(true);
                              } else {
                                // Small delay before unlocking to prevent immediate collapse
                                setTimeout(() => {
                                  setIsSidebarLocked(false);
                                }, 100);
                              }
                            }}
                          >
                            <SelectTrigger 
                              id="lesson-select" 
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsSidebarCollapsed(false);
                                setIsSidebarLocked(true);
                              }}
                            >
                              <SelectValue placeholder="Select Lesson" />
                            </SelectTrigger>
                            <SelectContent>
                              {lessons
                                .filter((lesson): lesson is Lesson => lesson !== undefined && lesson !== null)
                                .map((lesson: Lesson) => (
                                  <SelectItem 
                                    key={`lesson-${lesson.id || 'new'}`} 
                                    value={lesson.id || ''}
                                  >
                                    <div className="flex items-center gap-2">
                                      <BookOpen className="h-4 w-4 text-primary" />
                                      {lesson.title || 'Untitled Lesson'}
                                    </div>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                    <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full gap-2"
                        onClick={() => setModalState({ ...modalState, showAddLesson: true })}
                          >
                            <Plus className="h-4 w-4" />
                            Add New Lesson
                    </Button>
                      </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Collapsed view */}
              {isSidebarCollapsed && (
                <div className="absolute inset-0 flex flex-col items-center pt-12 gap-4">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                  <div className="w-px h-full bg-border" />
                </div>
              )}
            </Card>
          </div>
        

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto">
            {isNavigating ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3">Loading...</span>
              </div>
            ) : (
              <>
                {!selectedGradeId ? (
                  // Question Types Display Section
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-xl font-semibold">Available Question Types</CardTitle>
                            <CardDescription>Browse through different question formats and examples</CardDescription>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Click on each type to see detailed examples</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(QUESTION_TYPES).map(([type, details]) => (
                          <Card key={type} className="cursor-pointer hover:bg-accent/50 transition-colors">
                            <CardHeader className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="bg-primary/5 text-lg">
                                  {details.label}
                                </Badge>
                              </div>
                              <CardDescription className="text-sm">
                                {details.description || 'No description available'}
                              </CardDescription>
                              <div className="mt-4">
                                <div className="text-sm font-medium mb-2">Example:</div>
                                <div className="p-3 rounded-md bg-muted/50 text-sm">
                                  {type === 'multiple-choice' && (
                                    <>
                                      <div className="font-medium mb-2">Q: What is the capital of France?</div>
                                      <div className="space-y-1 pl-4">
                                        <div>A) Paris</div>
                                        <div>B) London</div>
                                        <div>C) Berlin</div>
                                        <div>D) Madrid</div>
                                      </div>
                                    </>
                                  )}
                                  {type === 'fill-in-blank' && (
                                    <div className="space-y-2">
                                      <div>Complete the sentence:</div>
                                      <div>The sun rises in the <span className="bg-primary/20 px-2 rounded">_____</span> and sets in the <span className="bg-primary/20 px-2 rounded">_____</span>.</div>
                                    </div>
                                  )}
                                  {type === 'true-false' && (
                                    <div className="space-y-2">
                                      <div className="font-medium">Statement:</div>
                                      <div>The Earth is flat.</div>
                                      <div className="mt-2">
                                        <Badge variant="outline" className="mr-2">True</Badge>
                                        <Badge variant="outline">False</Badge>
                                      </div>
                                    </div>
                                  )}
                                  {type === 'matching' && (
                                    <div className="space-y-2">
                                      <div className="font-medium mb-2">Match the countries with their capitals:</div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          1. France<br />
                                          2. Germany<br />
                                          3. Spain
                                        </div>
                                        <div>
                                          • Berlin<br />
                                          • Paris<br />
                                          • Madrid
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {type === 'ordering' && (
                                    <div className="space-y-2">
                                      <div className="font-medium mb-2">Arrange in chronological order:</div>
                                      <div className="space-y-1">
                                        <Badge variant="outline" className="mr-2">1</Badge>World War II<br />
                                        <Badge variant="outline" className="mr-2">2</Badge>Industrial Revolution<br />
                                        <Badge variant="outline" className="mr-2">3</Badge>Renaissance
                                      </div>
                                    </div>
                                  )}
                                  {type === 'short-answer' && (
                                    <div className="space-y-2">
                                      <div className="font-medium">Question:</div>
                                      <div>Explain the water cycle in 2-3 sentences.</div>
                                      <div className="mt-2 p-2 border border-dashed rounded-md border-primary/30">
                                        Answer space
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                ) : isViewMode ? (
                  <div className="space-y-6">
                    {selectedGradeId ? (
                      <div className="grid grid-cols-1 gap-6">
                        {topics.map((topic) => (
                          <Card key={topic.id} className="border-l-4 border-l-primary">
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{topic.title}</h3>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {subtopics
                                  .filter(subtopic => subtopic.topic_id === topic.id)
                                  .map((subtopic, index) => (
                                    <div key={subtopic.id || `subtopic-${index}`} className="border-l-2 pl-4">
                                      <h4 className="text-md font-medium mb-2">{subtopic.name || 'Untitled Subtopic'}</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {lessons
                                          .filter(lesson => lesson.subtopic_id === subtopic.id)
                                          .map((lesson) => (
                                            <Card 
                                              key={lesson.id} 
                                              className={cn(
                                                "cursor-pointer transition-all duration-200",
                                                "hover:shadow-md hover:translate-y-[-2px]",
                                                "hover:bg-accent/50 hover:border-primary/50",
                                                "active:translate-y-[0px]",
                                                currentLessonId === lesson.id && "border-primary bg-accent/50 shadow-md",
                                                "group" // Enable group hover effects
                                              )}
                                              onClick={() => handleLessonSelect(lesson.id || '')}
                                            >
                                              <CardHeader className="p-4">
                                                <div className="flex flex-col gap-2">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                      <BookOpen className={cn(
                                                        "h-4 w-4 text-primary",
                                                        "transition-transform duration-200",
                                                        "group-hover:scale-110"
                                                      )} />
                                                      <span className="font-medium">{lesson.title}</span>
                                                    </div>
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                                                      className={cn(
                                                        "opacity-0 group-hover:opacity-100",
                                                        "transition-all duration-200",
                                                        "hover:bg-primary hover:text-primary-foreground"
                                                      )}
                                                      disabled={!lesson.content || currentLessonId !== lesson.id}
                                                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                        e.stopPropagation();
                                                        window.location.href = `/teacher/lessons/${lesson.id}`;
                                                      }}
                                                    >
                                                      Start Lesson
                                                    </Button>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className={cn(
                                                      "bg-primary/5",
                                                      "transition-colors duration-200",
                                                      "group-hover:bg-primary/10"
                                                    )}>
                                                      {lesson.questions?.length || 0} Questions
                                                    </Badge>
                                                    <Badge variant="outline" className={cn(
                                                      "bg-primary/5",
                                                      "transition-colors duration-200",
                                                      "group-hover:bg-primary/10"
                                                    )}>
                                                      {lesson.activities?.length || 0} Activities
                                                    </Badge>
                                                  </div>
                                                </div>
                                              </CardHeader>
                                            </Card>
                                          ))}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-20">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">Select a Grade</h3>
                        <p className="text-sm text-muted-foreground">
                          Choose a grade from the left panel to start managing content
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Edit Mode Content
                  <div className="space-y-4">
                    {/* Lesson Title */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-2xl font-bold">Lesson Content</h2>
                                                    <Button
                                                      variant="outline"
                                                      size="sm"
                            onClick={() => setIsContentEditorOpen(true)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Content
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Lesson Title */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label>Lesson Title</Label>
                            <InlineEdit
                              value={lessonTitle}
                              onSave={async (newTitle) => {
                                setLessonTitle(newTitle);
                                await handleSaveLesson();
                              }}
                              isEditing={isEditingTitle}
                              setIsEditing={setIsEditingTitle}
                              placeholder="Enter lesson title"
                              className="text-lg font-medium"
                            />
                          </div>
                        </div>

                        {/* Content Editor and Display */}
                        <div className="space-y-4">
                          {isContentEditorOpen ? (
                            <div className="border rounded-lg p-4">
                              <div className="mb-4">
                                <Label>Content Heading</Label>
                                <InlineEdit
                                  value={contentHeading}
                                  onSave={(newHeading) => setContentHeading(newHeading)}
                                  isEditing={isEditingHeading}
                                  setIsEditing={setIsEditingHeading}
                                  placeholder="Add content heading"
                                  className="text-base text-muted-foreground"
                                />
                              </div>
                              <RichTextEditor
                                value={lessonContent}
                                onChange={setLessonContent}
                                onSave={async (content) => {
                                  await handleContentSave(content);
                                  setIsContentEditorOpen(false);
                                }}
                                placeholder="Add lesson content here..."
                              />
                            </div>
                          ) : lessonContent ? (
                            <div className="prose prose-sm max-w-none">
                              {contentHeading && (
                                <h3 className="text-lg font-semibold mb-2">{contentHeading}</h3>
                              )}
                              <div dangerouslySetInnerHTML={{ __html: lessonContent }} />
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              Click 'Edit Content' to add lesson content
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tabs */}
                    <Tabs defaultValue="questions" className="mt-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="questions">
                          <MessageSquare className="h-4 w-4 mr-2" />
                        Questions
                      </TabsTrigger>
                        <TabsTrigger value="activities">
                          <ActivityIcon className="h-4 w-4 mr-2" />
                        Activities
                      </TabsTrigger>
                    </TabsList>

                      {/* Questions Tab */}
                      <TabsContent value="questions" className="space-y-4">
                      <CardHeader>
                          <CardDescription>Add and manage questions for this lesson</CardDescription>
                      </CardHeader>
                        {questions.map((question, index) => (
                          <Card key={index} className={cn(
                            "relative border-l-4 transition-colors duration-200",
                            expandedQuestion === index ? "border-l-primary" : "border-l-primary/40 hover:border-l-primary"
                          )}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="px-2 py-1 bg-primary/10 rounded-md text-sm font-semibold text-primary whitespace-nowrap">
                                      Q {index + 1}
                                    </span>
                                    <Badge variant="outline" className="whitespace-nowrap">
                                      {QUESTION_TYPES[question.type as keyof typeof QUESTION_TYPES]?.label || question.type}
                                    </Badge>
                                    {question.isDraft && (
                                      <Badge variant="secondary" className="whitespace-nowrap">Draft</Badge>
                                )}
                                  </div>
                                      {expandedQuestion !== index && (
                                        <div className="text-sm text-muted-foreground truncate">
                                          {question.metadata?.prompt || 'No question text'}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleQuestionExpand(index)}
                                      >
                                        {expandedQuestion === index ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveQuestion(index)}
                                      >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardHeader>
                                {expandedQuestion === index && (
                                  <CardContent>
                                    <QuestionForm
                                      key={index}
                                      question={{ 
                                        ...question, 
                                        lesson_id: currentLessonId || '',
                                        type: isValidQuestionType(question.type) ? question.type : 'speaking',
                                        data: {
                                          prompt: question.data?.prompt ?? '',
                                          teacherScript: question.data?.teacherScript ?? '',
                                          followup_prompt: question.data?.followup_prompt ?? [],
                                          sampleAnswer: question.data?.sampleAnswer ?? '',
                                          answer: question.data?.answer ?? ''
                                        } 
                                      }}
                                      index={index}
                                      onUpdate={async (index: number, updatedQuestion: ContentQuestion) => {
                                        await handleUpdateQuestion(index, {
                                          ...updatedQuestion,
                                          data: {
                                            prompt: updatedQuestion.data?.prompt ?? '',
                                            teacherScript: updatedQuestion.data?.teacherScript ?? '',
                                            followup_prompt: updatedQuestion.data?.followup_prompt ?? [],
                                            sampleAnswer: updatedQuestion.data?.sampleAnswer ?? '',
                                            answer: updatedQuestion.data?.answer ?? ''
                                          }
                                        });
                                      }}
                                      onRemove={handleRemoveQuestion}
                                      onAddExercisePrompt={handleAddExercisePrompt}
                                      onRemoveExercisePrompt={handleRemoveExercisePrompt}
                                      onExercisePromptChange={handleExercisePromptChange}
                                    /><Button 
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleSaveQuestion(question, index)}
                                    className="ml-2"
                                  >
                                    {questionSaveStatuses.find(s => s.id === question.id)?.status === 'saving' ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                    ) : (
                                      <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Save Question
                                                    </Button>
                                    {/* Exercise Prompts with Save Buttons */}
                                    {question.exercisePrompts?.map((prompt, promptIndex) => (
                                      <div key={`${question.id}-prompt-${promptIndex}`} className="mt-4"> {/* Updated key */}
                                        <div className="flex items-center justify-between mb-2">
                                          <h4 className="text-sm font-medium">Exercise Prompt {promptIndex + 1}</h4>
                                          <div className="flex items-center gap-2">
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleSavePrompt(question.id, prompt, promptIndex)}
                                                    disabled={promptSaveStatuses.find(s => s.id === prompt.id)?.status === 'saving'}
                                                  >
                                                    {promptSaveStatuses.find(s => s.id === prompt.id)?.status === 'saving' ? (
                                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                    ) : (
                                                      <Save className="h-4 w-4 mr-2" />
                                                    )}
                                                    Save Prompt
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  {`Status: ${promptSaveStatuses.find(s => s.id === prompt.id)?.status || 'draft'}`}
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                            <Badge variant={
                                              promptSaveStatuses.find(s => s.id === prompt.id)?.status === 'saved'
                                                ? 'secondary'
                                                : promptSaveStatuses.find(s => s.id === prompt.id)?.status === 'error'
                                                ? 'destructive'
                                                : 'default'
                                            }>
                                              {promptSaveStatuses.find(s => s.id === prompt.id)?.status || 'draft'}
                                            </Badge>
                                                  </div>
                                        </div>
                                        <ExercisePromptCard
                                          key={prompt.id} // Add a unique key here
                                          prompt={prompt}
                                          promptIndex={promptIndex}
                                          onRemove={() => handleRemoveExercisePrompt(index, promptIndex)}
                                          onUpdate={(updatedPrompt: ExercisePrompt) => {
                                            // Prevent duplicate updates
                                            if (updatedPrompt.id === prompt.id) {
                                              handleExercisePromptChange(index, promptIndex, updatedPrompt);
                                            }
                                          }}
                                        />
                                      </div>
                                    ))}
                                  </CardContent>
                                )}
                              </Card>
                            ))}

                            {/* Add Question Button */}
                            <div className="flex items-center justify-between">
                              <QuestionTypeSelect 
                                value={selectedQuestionType} 
                                onChange={handleQuestionTypeChange}
                              />
                                        <Button
                                          onClick={handleAddQuestion}
                                          disabled={!selectedQuestionType}
                                        >
                                <Plus className="h-4 w-4 mr-2" />
                                          Add Question
                                        </Button>
                                      </div>
                      </TabsContent>

                      {/* Activities Tab */}
                      <TabsContent value="activities" className="space-y-4">
                      <CardHeader>
                          <CardDescription>Add and manage activities for this lesson</CardDescription>
                      </CardHeader>
                        {activities.map((activity, index) => (
                          <Card key={index}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                  <Badge variant="outline">Activity {index + 1}</Badge>
                                  </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleActivityExpand(index)}
                                  >
                                    {expandedActivity === index ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveActivity(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                            {expandedActivity === index && (
                              <CardContent>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label>Instructions</Label>
                                    <Textarea
                                      value={activity.instructions}
                                      onChange={(e) => handleUpdateActivity(index, {
                                        ...activity,
                                        instructions: e.target.value
                                      })}
                                      placeholder="Enter activity instructions"
                                    />
                                  </div>
                                    
                                    {/* Media Section */}
                                    <div className="space-y-2">
                                      <Label>Media</Label>
                                      {activity.media?.map((media, mediaIndex) => (
                                        <div key={mediaIndex} className="flex items-center gap-2">
                                          <Input
                                            value={media.url}
                                            onChange={(e) => {
                                              const updatedMedia = [...(activity.media || [])];
                                              updatedMedia[mediaIndex] = {
                                                type: media.type,
                                                url: e.target.value
                                              };
                                              handleUpdateActivity(index, {
                                                ...activity,
                                                media: updatedMedia
                                              });
                                            }}
                                            placeholder="Media URL"
                                          />
                                          <Select
                                            value={media.type}
                                            onValueChange={(value) => {
                                              const updatedMedia = [...(activity.media || [])];
                                              updatedMedia[mediaIndex] = {
                                                type: value as 'image' | 'gif' | 'video',
                                                url: media.url
                                              };
                                              handleUpdateActivity(index, {
                                                ...activity,
                                                media: updatedMedia
                                              });
                                            }}
                                          >
                                            <SelectTrigger className="w-[120px]">
                                              <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="image">Image</SelectItem>
                                              <SelectItem value="gif">GIF</SelectItem>
                                              <SelectItem value="video">Video</SelectItem>
                                            </SelectContent>
                                          </Select>
                                <Button
                                            variant="ghost"
                                            size="sm"
                                  onClick={() => {
                                              const updatedMedia = (activity.media || []).filter((_, i) => i !== mediaIndex);
                                              handleUpdateActivity(index, {
                                                ...activity,
                                                media: updatedMedia
                                          });
                                          }}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                                        ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                            onClick={() => {
                                              handleUpdateActivity(index, {
                                                ...activity,
                                                media: [
                                                  ...(activity.media || [])  ,
                                                  { url: '', type: 'image' }
                                                ]
                                              });
                                            }}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                            Add Media
                                  </Button>
                                </div>
                                      </div>
                                    </CardContent>
                                  )}
                                </Card>
                              ))}

                              {/* Add Activity Button */}
                              <Button
                                onClick={handleAddActivity}
                                className="w-full"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Activity
                              </Button>
                          </TabsContent>
                        </Tabs>
                        </div>
                )}

                    {/* Floating Save Button */}
                    <div className="fixed bottom-8 right-8 flex items-center gap-4">
                      {saveProgress !== 'idle' && (
                        <div className={cn(
                          "flex items-center gap-2 rounded-lg px-4 py-2 shadow-lg",
                          {
                            "bg-background border": saveProgress === 'saving',
                            "bg-green-500 text-white": saveProgress === 'saved',
                            "bg-destructive text-destructive-foreground": saveProgress === 'error'
                          }
                        )}>
                          {saveProgress === 'saving' && (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              <span className="text-sm">Saving changes...</span>
                            </>
                          )}
                          {saveProgress === 'saved' && (
                            <>
                              <Check className="h-4 w-4" />
                              <span className="text-sm">Changes saved</span>
                            </>
                          )}
                          {saveProgress === 'error' && (
                            <>
                              <X className="h-4 w-4" />
                              <span className="text-sm">Error saving changes</span>
                            </>
                          )}
                        </div>
                      )}
                      <Button
                        onClick={handleSaveLesson}
                        disabled={saveProgress === 'saving'}
                        className="shadow-lg"
                      >
                        {saveProgress === 'saving' ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {saveProgress === 'saving' ? 'Saving...' : 'Save Lesson'}
                      </Button>
                    </div>
                  </>
            )}
    </div>
    

      {/* Floating Save Button */}
      {selectedSubtopicId && currentLessonId && (
          <div className="fixed bottom-4 right-4 flex flex-col gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="rounded-full h-12 w-12 shadow-lg"
                    onClick={handleSaveLesson}
                    disabled={!selectedSubtopicId || !lessonTitle || questions.length === 0}
                  >
                    <Save className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Lesson (Ctrl+S)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <SaveFeedback />

        {/* Add Grade Modal */}
        {modalState.showAddGrade && (
          <Dialog 
            open={modalState.showAddGrade} 
            onOpenChange={(open) => handleModalStateChange('showAddGrade', open)}
          >
            <DialogContent 
              className="sm:max-w-[425px]"
              onEscapeKeyDown={cleanupModalState}
              onPointerDownOutside={cleanupModalState}
            >
              <DialogHeader>
                <DialogTitle>Add New Grade</DialogTitle>
                <DialogDescription>Enter the details for the new grade.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="grade-name">Grade Name</Label>
                  <Input
                    id="grade-name"
                    value={newItemData.name}
                    onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                    placeholder="Enter grade name"
                  />
      </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setModalState({ ...modalState, showAddGrade: false });
                  setNewItemData({ name: '', description: '' });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateGrade} disabled={!newItemData.name}>Create Grade</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Add Topic Modal */}
        {modalState.showAddTopic && (
          <Dialog 
            open={modalState.showAddTopic} 
            onOpenChange={(open) => handleModalStateChange('showAddTopic', open)}
          >
            <DialogContent 
              className="sm:max-w-[425px]"
              onEscapeKeyDown={cleanupModalState}
              onPointerDownOutside={cleanupModalState}
            >
              <DialogHeader>
                <DialogTitle>Add New Topic</DialogTitle>
                <DialogDescription>Enter the details for the new topic.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="topic-name">Topic Name</Label>
                  <Input
                    id="topic-name"
                    value={newItemData.name}
                    onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                    placeholder="Enter topic name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setModalState({ ...modalState, showAddTopic: false });
                  setNewItemData({ name: '', description: '' });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTopic} disabled={!newItemData.name}>Create Topic</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Add Subtopic Modal */}
        {modalState.showAddSubtopic && (
          <Dialog 
            open={modalState.showAddSubtopic} 
            onOpenChange={(open) => handleModalStateChange('showAddSubtopic', open)}
          >
            <DialogContent 
              className="sm:max-w-[425px]"
              onEscapeKeyDown={cleanupModalState}
              onPointerDownOutside={cleanupModalState}
            >
              <DialogHeader>
                <DialogTitle>Add New Subtopic</DialogTitle>
                <DialogDescription>Enter the details for the new subtopic.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subtopic-name">Subtopic Name</Label>
                  <Input
                    id="subtopic-name"
                    value={newItemData.name}
                    onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                    placeholder="Enter subtopic name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setModalState({ ...modalState, showAddSubtopic: false });
                  setNewItemData({ name: '', description: '' });
                }}>
                  Cancel
                </Button>
                <Button onClick={() => handleCreateSubtopic({ title: newItemData.name })} disabled={!newItemData.name}>Create Subtopic</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Add Lesson Modal */}
        {modalState.showAddLesson && (
          <Dialog 
            open={modalState.showAddLesson} 
            onOpenChange={(open) => handleModalStateChange('showAddLesson', open)}
          >
            <DialogContent 
              className="sm:max-w-[425px]"
              onEscapeKeyDown={cleanupModalState}
              onPointerDownOutside={cleanupModalState}
            >
              <DialogHeader>
                <DialogTitle>Add New Lesson</DialogTitle>
                <DialogDescription>Enter the details for the new lesson.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="lesson-name">Lesson Title</Label>
                  <Input
                    id="lesson-name"
                    value={newItemData.name}
                    onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                    placeholder="Enter lesson title"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setModalState({ ...modalState, showAddLesson: false });
                  setNewItemData({ name: '', description: '' });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleCreateLesson} disabled={!newItemData.name}>Create Lesson</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Toaster />
      </div>
  );
} 