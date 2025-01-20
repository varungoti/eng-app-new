"use client";

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {  Activity as ActivityIcon,  ArrowLeft,  BookOpen,  ChevronDown,  ChevronRight,  Check,  Edit,  Eye,  EyeOff,  HelpCircle,  Layers,  List,  MessageSquare,  Plus,  Save,  Trash as Trash2, X } from 'lucide-react';
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
import { Question, QuestionFormProps, ExercisePromptCardProps, Activity, Grade, Topic, Subtopic as SubTopic } from './types';
import { QuestionForm } from '@/components/content/lesson-management/components/question-form';
import { ExercisePromptCard } from '@/components/content/lesson-management/components/exercise-prompt-card';
import { validateQuestion } from '@/app/content-management/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useContentStore } from '@/lib/content/store';
import { contentService } from '@/lib/content/ContentService';
import { MediaPreview } from '@/components/ui/media-preview';


// Update the API endpoint to match your backend route
const API_ENDPOINT = process.env.VITE_API_URL || 'http://localhost:5173/api';

interface QuestionTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const QuestionTypeSelect: React.FC<QuestionTypeSelectProps> = ({ value, onValueChange }) => {
  // component implementation
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
  //const [selectedGrade, setSelectedGrade] = useState<string>('');
  //const [selectedTopic, setSelectedTopic] = useState<string>('');
  //const [selectedSubtopic, setSelectedSubtopic] = useState<string>('');
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
      title: '',
      type: selectedQuestionType,
      lesson_id: currentLessonId || '',
      metadata: {},
      data: {
        ...defaultData,
        prompt: '',
        teacherScript: ''
      },
      exercisePrompts: [],
      isDraft: true
    };

    setQuestions(prev => [...prev, newQuestion]);
    setSelectedQuestionType('');
  }, [selectedQuestionType]);

  const handleRemoveQuestion = useCallback((index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpdateQuestion = useCallback(async (index: number, updatedQuestion: Question) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
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
              saytext: '',
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
    setQuestions(prev => prev.map((question, i) => {
      if (i === questionIndex) {
        const newPrompts = [...question.exercisePrompts];
        newPrompts[promptIndex] = updatedPrompt;
    return {
          ...question,
          exercisePrompts: newPrompts
        };
      }
      return question;
    }));
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
  const saveLesson = async (lessonData: any) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .update(lessonData)
        .eq('id', lessonData.id);
  
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving lesson:', error);
      throw new Error('Failed to save lesson');
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
          gradeId: topic.grade_id,
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
          topicId: subtopic.topic_id,
          lessons: [],
          orderIndex: subtopicsData.length // or newSubtopic.order_index if available
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
  const loadLessonContent = useCallback(async (lessonId: string) => {
    if (!lessonId) return;
  
    try {
      const lessonData = await contentService.fetchLessonContent(lessonId);
      
      // Update states with the fetched data
      setLessonTitle(lessonData.title);
      setLessonContent(lessonData.content || '');
      setQuestions(lessonData.questions || []);
      
      if (lessonData.subtopic_id) {
        setSelectedSubtopicId(lessonData.subtopic_id);
        setSelectedSubtopic(lessonData.subtopic_id);
      }
  
      // Format and set questions with their exercise prompts
      const formattedQuestions = questions?.map((q: any) => ({
        ...q,
        data: q.data || {},
        exercisePrompts: q.exercise_prompts || []
      })) || [];
      
      setQuestions(formattedQuestions);
  
      // Set activities
      setActivities(activities || []);
  
    } catch (error) {
      console.error('Error loading lesson:', error);
      toast.error('Failed to load lesson');
      // Reset states on error
      setLessonTitle('');
      setLessonContent('');
      setQuestions([]);
      setActivities([]);
    }
  }, [setSelectedSubtopic]);

  // // Add effect for fetching lessons when subtopic changes
  useEffect(() => {
    if (selectedSubtopicId) {
      fetchLessons();
    }
  }, [selectedSubtopicId, fetchLessons]);

  // Add effect for loading lesson content when currentLessonId changes
    useEffect(() => {
    if (currentLessonId) {
      loadLessonContent(currentLessonId);
    } else {
      setLessonTitle('');
      setLessonContent('');
      setQuestions([]);
      setActivities([]);
    }
  }, [currentLessonId, loadLessonContent]);

  useEffect(() => {
    console.log('Current lessons state:', lessons);
  }, [lessons]);

  // Add save functionality
  const handleSaveLesson = useCallback(async () => {
    if (!selectedSubtopicId || !lessonTitle) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaveProgress('saving');
      
      const lessonData = {
        id: currentLessonId,
        title: lessonTitle.trim(),
        subtopic_id: selectedSubtopicId,
        content: {
          questions: questions.map(q => ({
            ...q,
            data: {
              ...q.data,
              prompt: q.data?.prompt?.trim() || '',
              teacherScript: q.data?.teacherScript?.trim() || ''
            }
          })),
          activities
        }
      };

      const response = await fetch(`${API_ENDPOINT}/lessons${currentLessonId ? `/${currentLessonId}` : ''}`, {
        method: currentLessonId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonData)
      });

      if (!response.ok) throw new Error('Failed to save lesson');
      const savedLesson = await response.json();
      
      if (!currentLessonId) {
        setCurrentLessonId(savedLesson.id || '');
      }
      //await saveLesson(lessonData);
      
      setSaveProgress('saved');
      toast.success('Lesson saved successfully');
      
      setTimeout(() => {
        setSaveProgress('idle');
      }, 2000);
    } catch (error) {
      console.error('Error saving lesson:', error);
      setSaveProgress('error');
      toast.error('Failed to save lesson');
    }
  }, [selectedSubtopicId, lessonTitle, questions, activities, currentLessonId]);

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
  const handleGradeSelect = (value: string) => {
    setSelectedGradeId(value);
    setSelectedGrade(value);
    setSelectedTopicId(null);
    setSelectedTopic('');
    setSelectedSubtopicId(null);
    setSelectedSubtopic('');
    setCurrentLessonId(null);
    if (isViewMode) setExpandedGrade(value);
    setTimeout(() => setIsNavigating(false), 500);
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

  const handleLessonSelect = (value: string | null) => {
    setCurrentLessonId(value);
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
      const response = await fetch(`${API_ENDPOINT}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemData.name,
          gradeId: selectedGradeId
        })
      });

      if (!response.ok) throw new Error('Failed to create topic');
      const data = await response.json();
      
      if (!data.success) throw new Error(data.message || 'Failed to create topic');
      
      // Update topics list
      setTopics([...topics, data.data.topic]);
      setModalState({ ...modalState, showAddTopic: false });
      setNewItemData({ name: '', description: '' });
      toast.success('Topic created successfully');
    } catch (error) {
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
          type: 'multiple-choice', // default type
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
            type: 'text',
            narration: '',
            saytext: '',
            media: [],
            order_index: 0
          },
          {
            question_id: newQuestion.id,
            text: '',
            type: 'practice',
            narration: '',
            saytext: '',
            media: [],
            order_index: 1
          }
        ]);

      if (promptsError) throw promptsError;

      // Create initial activity
      const { error: activityError } = await supabase
        .from('activities')
        .insert({
          lesson_id: newLesson.id,
          type: 'practice',
          title: '',
          instructions: '',
          media: [],
          data: {
            prompt: '',
            teacherScript: '',
            media: []
          },
          order_index: 0
        });

      if (activityError) throw activityError;

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

  // Render
  return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/super-admin">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Lesson Management</h1>
              <p className="text-sm text-muted-foreground">Create and manage your educational content</p>
            </div>
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
        
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-80 flex flex-col gap-4">
            <Card>
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
                  >
                    <SelectTrigger id="grade-select" className="w-full">
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade: Grade) => (
                        <SelectItem 
                          key={`grade-${grade.id || 'new'}`} 
                          value={grade.id || ''}
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
                      >
                        <SelectTrigger id="lesson-select" className="w-full">
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

          {/* Right Content Area */}
          <div className="flex-1">
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
                                              className="cursor-pointer hover:bg-accent transition-colors duration-200"
                                              onClick={() => {
                                                setCurrentLessonId(lesson.id || '');
                                                setSelectedTopicId(topic.id || '');
                                                setSelectedSubtopicId(subtopic.id || '');
                                                setIsViewMode(false);
                                              }}
                                            >
                                              <CardHeader className="py-3">
                                                <div className="flex flex-col gap-2">
                                                  <div className="flex items-center gap-2">
                                                    <BookOpen className="h-4 w-4 text-primary" />
                                                    <span className="font-medium">{lesson.title}</span>
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="bg-primary/5">
                                                      {lesson.questions?.length || 0} Questions
                                                    </Badge>
                                                    <Badge variant="outline" className="bg-primary/5">
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
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Lesson Content</CardTitle>
                            <CardDescription>
                              {currentLessonId ? 'Edit lesson content' : 'Create a new lesson'}
                            </CardDescription>
                          </div>
                          {showHelpTips && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Add questions and activities to your lesson</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="lesson-title">Lesson Title</Label>
                            <Input
                              id="lesson-title"
                              value={lessonTitle}
                              onChange={(e) => setLessonTitle(e.target.value)}
                              placeholder="Enter lesson title"
                            />
                          </div>

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
                                        question={question}
                                        index={index}
                                        onUpdate={handleUpdateQuestion}
                                        onRemove={handleRemoveQuestion}
                                        onAddExercisePrompt={handleAddExercisePrompt}
                                        onRemoveExercisePrompt={handleRemoveExercisePrompt}
                                        onExercisePromptChange={handleExercisePromptChange}
                                      />
                                    </CardContent>
                                  )}
                                </Card>
                              ))}

                              {/* Add Question Button */}
                              <div className="flex items-center justify-between">
                                <QuestionTypeSelect 
                                  value={selectedQuestionType} 
                                  onValueChange={handleQuestionTypeChange}
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
                      </CardContent>
                    </Card>

                    {/* Floating Save Button */}
                    <div className="fixed bottom-8 right-8 flex items-center gap-4">
                      {saveProgress !== 'idle' && (
                        <div className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium",
                          saveProgress === 'saving' && "bg-primary text-primary-foreground",
                          saveProgress === 'saved' && "bg-green-500 text-white",
                          saveProgress === 'error' && "bg-destructive text-destructive-foreground"
                        )}>
                          {saveProgress === 'saving' && 'Saving...'}
                          {saveProgress === 'saved' && 'Saved!'}
                          {saveProgress === 'error' && 'Error saving'}
                        </div>
                      )}
                      <Button
                        size="lg"
                        onClick={handleSaveLesson}
                        className="rounded-full shadow-lg"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Lesson
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
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
  );
} 