"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Play, 
  Pause, 
  ChevronRight, 
  Image as ImageIcon,
  Video,
  Volume2,
  VolumeX,
  RefreshCw,
  ArrowLeft, 
  ArrowRight, 
  Clock,
  PenTool,
  Info,
  Lightbulb,
  ChevronDown,
  Keyboard
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useHotkeys } from 'react-hotkeys-hook';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import confetti from 'canvas-confetti';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useSound } from 'use-sound';
//import { Question } from '@/types/index.ts';

// Types
interface LessonState {
  lesson: {
    id: string;
    title: string;
    content: string | null;
    description: string | null;
    topic_id: string | null;
    subtopic_id: string;
    contentheading: string | null;
    voice_id: string | null;
    questions: Array<{
      id: string;
      title: string;
      content: string;
      type: string;
      data: {
        prompt?: string;
        teacherScript?: string;
        followupPrompt?: string[];
        sampleAnswer?: string;
      };
      metadata: QuestionMetadata;
      exercise_prompts: ExercisePrompt[];
    }>;
    exercise_prompts: Array<{
      id: string;
      text: string;
      media: string | null;
      type: 'image' | 'video' | 'gif';
      narration: string | null;
      saytext: string | null;
    }>;
  };
  topic?: {
    title: string;
  };
  subtopic?: {
    title: string;
  };
}

// Add or update the ExercisePrompt interface
interface ExercisePrompt {
  id: string;
  text: string;
  content?: {
    question: string;
  };
  media: string | null;
  type: 'image' | 'video' | 'gif';
  narration: string | null;
  saytext: string | null;
  question_id: string | null;
  order_index: number;
  created_at?: string;  // Made optional
  updated_at?: string;  // Made optional
  metadata?: {
    estimatedTime: number;
  };
}

// First, update the Question interface to better match our data structure
interface Question {
  id: string;
  title: string;
  content: string;
  type: string;
  data: {
    prompt?: string;
    teacherScript?: string;
    followupPrompt?: string[];
    sampleAnswer?: string;
  };
  metadata: QuestionMetadata;
  exercise_prompts: ExercisePrompt[];
}

// Add a comprehensive QuestionMetadata interface
interface QuestionMetadata {
  // Common fields for all question types
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  points?: number;
  tags?: string[];
  
  // Type-specific metadata
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  
  // Multiple Choice specific
  shuffleOptions?: boolean;
  allowMultipleAnswers?: boolean;
  
  // Speaking specific
  pronunciationFocus?: string[];
  intonationPattern?: string;
  stressPattern?: string;
  
  // Listening specific
  audioTranscript?: string;
  playbackSettings?: {
    maxReplays?: number;
    playbackSpeed?: number[];
  };
  
  // Writing specific
  minWords?: number;
  maxWords?: number;
  grammarFocus?: string[];
  
  // Reading specific
  readingLevel?: string;
  vocabularyFocus?: string[];
  
  // Interactive specific
  interactionType?: 'drag-drop' | 'fill-blank' | 'matching';
  interactionSettings?: {
    allowHints?: boolean;
    maxAttempts?: number;
  };
}

interface LessonData {
  id: string;
  title: string;
  content: string | null;
  description: string | null;
  topic_id: string | null;
  subtopic_id: string;
  contentheading: string | null;
  voice_id: string | null;
  exercise_prompts: ExercisePrompt[];
  questions: Question[];
  topic?: { title: string };
  subtopic?: { title: string };
}

const LessonPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [lessonState, setLessonState] = useState<LessonState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [authSession, setAuthSession] = useState<any>(null);

  // Fish Speech API configuration
  const FISH_SPEECH_API_KEY = process.env.NEXT_PUBLIC_FISH_SPEECH_API_KEY;
  const FISH_SPEECH_ENDPOINT = 'https://api.fishspeech.com/v1/text-to-speech';

  // Add new state for interactive features
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [contentProgress, setContentProgress] = useState(0);

  // Add scroll progress tracking
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Add new state for exercise interactions
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [exerciseResponses, setExerciseResponses] = useState<Record<string, string>>({});
  const [exerciseProgress, setExerciseProgress] = useState<Record<string, number>>({});

  // Add new state variables
  const [showZoomedImage, setShowZoomedImage] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const { toast } = useToast();

  // Add new state variables
  const [playSuccess] = useSound('/sounds/success.mp3', { volume: 0.5 });
  const [isExercisesLoading, setIsExercisesLoading] = useState(true);

  // Add keyboard shortcuts
  useHotkeys('alt+left', () => {
    if (activeExerciseIndex !== null && activeExerciseIndex > 0) {
      setActiveExerciseIndex(activeExerciseIndex - 1);
      logger.info('Previous exercise shortcut used', {
        source: 'LessonPage',
        context: { newIndex: activeExerciseIndex - 1 }
      });
    }
  });

  useHotkeys('alt+right', () => {
    if (activeExerciseIndex !== null && lessonState?.lesson.exercise_prompts && 
        activeExerciseIndex < lessonState.lesson.exercise_prompts.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
      logger.info('Next exercise shortcut used', {
        source: 'LessonPage',
        context: { newIndex: activeExerciseIndex + 1 }
      });
    }
  });

  // Add scroll effect for exercise navigation
  useEffect(() => {
    if (activeExerciseIndex !== null) {
      const element = document.getElementById(`exercise-${activeExerciseIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    if (lessonState?.lesson.exercise_prompts) {
      const totalExercises = lessonState.lesson.exercise_prompts.length;
      const completedExercises = Object.keys(exerciseProgress).length;
      const newProgress = Math.round((completedExercises / totalExercises) * 100);
      
      setOverallProgress(newProgress);
      
      // Trigger completion celebration
      if (newProgress === 100 && overallProgress !== 100) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        
        toast({
          title: "🎉 Congratulations!",
          description: "You've completed all exercises in this lesson!"
        });
        
        logger.info('Lesson completed', {
          source: 'LessonPage',
          context: { 
            timestamp: new Date().toISOString(),
            exerciseCount: totalExercises
          }
        });
      }
    }
  }, [exerciseProgress, lessonState?.lesson.exercise_prompts, overallProgress, toast]);

  // Update the fetchLessonData function to properly structure the data
  const fetchLessonData = async () => {
    try {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const lessonId = searchParams.get('lessonId');
      
      if (!lessonId) {
        throw new Error('No lesson ID provided');
      }

      // Fetch lesson with questions
      const { data: lessonData, error: lessonError } = (await supabase
        .from('lessons')
        .select(`
          *,
          topic:topics(title),
          subtopic:subtopics(title),
          questions(
            id, 
            title, 
            content, 
            type,
            data,
            metadata,
          )
        `)
        .eq('id', lessonId)
        .single()) as { data: LessonData; error: any };

      if (lessonError) throw lessonError;

      // Fetch exercise prompts for each question
      const questionsWithPrompts = await Promise.all(
        lessonData.questions.map(async (question: Question) => {
          const { data: promptsData, error: promptsError } = await supabase
            .from('exercise_prompts')
            .select('*')
            .eq('question_id', question.id)
            .order('order_index');

          if (promptsError) throw promptsError;

          return {
            ...question,
            data: {
              prompt: question.data?.prompt || '',
              teacherScript: question.data?.teacherScript || '',
              followupPrompt: question.data?.followupPrompt || [],
              sampleAnswer: question.data?.sampleAnswer || '',
            },
            exercise_prompts: promptsData || []
          };
        })
      );

      setLessonState({
        lesson: {
          id: lessonData?.id || '',
          title: lessonData?.title || '',
          content: lessonData?.content || null,
          description: lessonData?.description || null,
          topic_id: lessonData?.topic_id || null,
          subtopic_id: lessonData?.subtopic_id || '',
          contentheading: lessonData?.contentheading || null,
          voice_id: lessonData?.voice_id || null,
          exercise_prompts: lessonData?.exercise_prompts || [],
          questions: questionsWithPrompts as Question[],
        },
        topic: lessonData.topic,
        subtopic: lessonData.subtopic
      });

    } catch (error) {
      console.error('Error fetching lesson data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load lesson');
    } finally {
      setIsLoading(false);
    }
  };

  // Add message listener for iframe communication
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Only handle messages from our iframe
      if (!event.data || typeof event.data !== 'object') return;

      if (event.data.type === 'LESSON_CONTEXT') {
        try {
          const { payload } = event.data;
          
          // Set auth session if provided
          if (payload.auth?.session) {
            // First update Supabase auth state
            await supabase.auth.setSession(payload.auth.session);
            // Then update local auth state
            setAuthSession(payload.auth.session);
          }
          
          // Store session in localStorage for persistence
          if (payload.auth?.session) {
            localStorage.setItem('supabase.auth.token', JSON.stringify(payload.auth.session));
          }
          
          setLessonState({
            lesson: payload.lesson,
            topic: { title: payload.topic },
            subtopic: { title: payload.subtopic }
          });
          
          // Notify parent that context was received and processed
          window.parent.postMessage({ 
            type: 'LESSON_CONTEXT_RECEIVED',
            lessonId: payload.lesson.id,
            status: 'success'
          }, '*');
          
          logger.info('Lesson context received and session restored', {
            source: 'LessonPage',
            context: { 
              lessonId: payload.lesson.id,
              hasAuth: !!payload.auth?.session
            }
          });
        } catch (error) {
          logger.error('Error processing lesson context', {
            source: 'LessonPage',
            context: { error }
          });
          
          // Notify parent of error
          window.parent.postMessage({ 
            type: 'LESSON_ERROR',
            error: 'Failed to process lesson context',
            status: 'error'
          }, '*');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Setup session refresh interval
    const refreshInterval = setInterval(async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session) {
          await supabase.auth.refreshSession();
          logger.info('Session refreshed successfully', {
            source: 'LessonPage',
            context: { timestamp: new Date().toISOString() }
          });
      }
    } catch (error) {
        logger.error('Session refresh failed', {
          source: 'LessonPage',
          context: { error }
        });
      }
    }, 4 * 60 * 1000); // Refresh every 4 minutes

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(refreshInterval);
    };
  }, []);

  // Add this effect to handle navigation attempts
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Prevent unintended navigation
      e.preventDefault();
      e.returnValue = '';
      
      // Notify parent
      window.parent.postMessage({
        type: 'NAVIGATION_ATTEMPT',
        timestamp: new Date().toISOString()
      }, '*');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setContentProgress(Math.min(progress, 100));
        
        logger.info('Content scroll progress', {
          source: 'LessonPage',
          context: { 
            progress: Math.round(progress),
            timestamp: new Date().toISOString()
          }
        });
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleTextToSpeech = async (text: string) => {
    try {
      const response = await fetch(FISH_SPEECH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FISH_SPEECH_API_KEY}`
        },
        body: JSON.stringify({
          text,
          voice_id: lessonState?.lesson.voice_id || 'default',
          speed: 1.0
        })
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
      } catch (error) {
      logger.error('Text-to-speech error', {
        source: 'LessonPage',
        context: { error }
      });
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const currentContent = lessonState?.lesson.content || '';
        handleTextToSpeech(currentContent);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answer }));
    setShowFeedback(prev => ({ ...prev, [questionId]: true }));
    
    logger.info('Answer selected', {
      source: 'LessonPage',
            context: {
        questionId,
                timestamp: new Date().toISOString()
            }
        });
  };

  // Add floating progress indicator component
  const FloatingProgress = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-4"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm font-bold">{overallProgress}%</span>
        </div>
        <Progress 
          value={overallProgress} 
          className="w-[200px] h-2"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {Object.keys(exerciseProgress).length} of {lessonState?.lesson.exercise_prompts?.length || 0} completed
          </span>
          {overallProgress === 100 && (
            <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">
              Completed
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Add image zoom dialog
  const ImageZoomDialog = () => (
    <Dialog open={!!showZoomedImage} onOpenChange={() => setShowZoomedImage(null)}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        {showZoomedImage && (
          <motion.img
            src={showZoomedImage}
            alt="Zoomed content"
            className="w-full h-full object-contain"
            layoutId={`zoom-${showZoomedImage}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          />
        )}
      </DialogContent>
    </Dialog>
  );

  // Add keyboard shortcuts component
  const KeyboardShortcuts = () => (
    <div className="fixed top-4 right-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:bg-white/75 dark:hover:bg-gray-800/75"
          >
            <Keyboard className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left" className="p-4">
          <div className="space-y-3">
            <p className="font-medium text-sm">Keyboard Shortcuts</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-4">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + ←</kbd>
                <span className="text-muted-foreground">Previous exercise</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + →</kbd>
                <span className="text-muted-foreground">Next exercise</span>
              </div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  // Add loading skeleton component
  const ExerciseSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <Card className="border border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-32 w-full rounded-lg" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  // Update the useEffect for loading state
  useEffect(() => {
    const loadExercises = async () => {
      if (lessonState?.lesson.exercise_prompts) {
        setIsExercisesLoading(true);
        
        try {
          // Simulate loading delay for smoother transitions
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          logger.info('Exercises loaded', {
            source: 'LessonPage',
                context: {
              exerciseCount: lessonState.lesson.exercise_prompts.length,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (error) {
          logger.error('Failed to load exercises', {
            source: 'LessonPage',
                context: { error }
            });
        } finally {
          setIsExercisesLoading(false);
        }
      }
    };

    loadExercises();
  }, [lessonState?.lesson.exercise_prompts]);

  // Add keyboard navigation effect
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey) {
        if (event.key === 'ArrowLeft') {
          setActiveExerciseIndex(prev => 
            prev !== null && prev > 0 ? prev - 1 : prev
          );
        } else if (event.key === 'ArrowRight') {
          setActiveExerciseIndex(prev => 
            prev !== null && lessonState?.lesson.exercise_prompts && 
            prev < lessonState.lesson.exercise_prompts.length - 1 ? prev + 1 : prev
          );
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lessonState?.lesson.exercise_prompts]);

  // Add scroll into view effect
  useEffect(() => {
    if (activeExerciseIndex !== null) {
      const element = document.getElementById(`exercise-${activeExerciseIndex}`);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
        
        logger.info('Scrolled to exercise', {
          source: 'LessonPage',
          context: { 
            exerciseIndex: activeExerciseIndex,
            timestamp: new Date().toISOString()
          }
        });
      }
    }
  }, [activeExerciseIndex]);

  // Update the question rendering part
  const renderQuestion = (question: Question) => {
    if (!question.data) return null;

    return (
      <div className="space-y-4">
        {/* Question Title and Type */}
        <div className="flex items-center gap-2">
          <Badge variant="outline">{question.type}</Badge>
          <h3 className="text-lg font-medium">{question.title}</h3>
        </div>

        {/* Question Content */}
        <div className="prose dark:prose-invert max-w-none">
          {/* Prompt */}
          {question.data.prompt && (
            <div className="bg-card p-4 rounded-lg">
              <h4 className="font-medium mb-2">Prompt:</h4>
              <p>{question.data.prompt}</p>
            </div>
          )}

          {/* Teacher Script */}
          {question.data.teacherScript && (
            <div className="bg-muted p-4 rounded-lg mt-4">
              <h4 className="font-medium mb-2">Teacher Script:</h4>
              <p>{question.data.teacherScript}</p>
            </div>
          )}

          {/* Sample Answer */}
          {question.data.sampleAnswer && (
            <div className="bg-primary/5 p-4 rounded-lg mt-4">
              <h4 className="font-medium mb-2">Sample Answer:</h4>
              <p>{question.data.sampleAnswer}</p>
            </div>
          )}
        </div>

        {/* Exercise Prompts */}
        {question.exercise_prompts?.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Exercise Prompts:</h4>
            {question.exercise_prompts.map((prompt, idx) => (
              <Card key={idx} className="bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium">{idx + 1}</span>
                      </div>
                      <div>
                        <CardTitle className="text-base">{prompt.text}</CardTitle>
                        {prompt.type && (
                          <CardDescription>{prompt.type}</CardDescription>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {prompt.narration && (
                    <div className="text-sm text-muted-foreground">
                      {prompt.narration}
                    </div>
                  )}
                  {prompt.media && (
                    <div className="mt-4">
                      {prompt.type === 'image' && (
                        <img 
                          src={prompt.media} 
                          alt={prompt.text}
                          className="rounded-lg max-h-48 object-cover"
                        />
                      )}
                      {prompt.type === 'video' && (
                        <video
                          src={prompt.media}
                          controls
                          className="w-full rounded-lg"
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading your lesson..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button 
              onClick={() => navigate(-1)}
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 relative">
        {/* Progress Bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-primary/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: contentProgress / 100 }}
          transition={{ duration: 0.2 }}
        />

        {/* Header Section with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge variant="outline" className="bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                  {lessonState?.topic?.title || 'Topic'}
                </Badge>
              </motion.div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <motion.div whileHover={{ scale: 1.05 }}>
                <Badge variant="outline" className="bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                  {lessonState?.subtopic?.title || 'Subtopic'}
                </Badge>
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              {lessonState?.lesson.contentheading || lessonState?.lesson.title || 'Lesson Content'}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>15 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{lessonState?.lesson.questions?.length || 0} Questions</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={contentProgress} className="w-24 h-2" />
                <span>{Math.round(contentProgress)}% Complete</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Lesson Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden border-2 border-primary/10">
              <CardHeader className="bg-primary/5 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Lesson Content
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                        onClick={toggleMute}
                        className="hover:bg-primary/10"
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
              </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}>
              <Button 
                        variant="ghost"
                        size="icon"
                        onClick={togglePlayPause}
                        className="hover:bg-primary/10"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
              </Button>
                    </motion.div>
            </div>
          </div>
                </CardHeader>
              <CardContent className="p-0">
                <ScrollArea 
                  ref={contentRef}
                  className="h-[60vh]"
                  onScrollCapture={() => {
                    logger.info('Content scrolled', {
                      source: 'LessonPage',
                      context: { timestamp: new Date().toISOString() }
                    });
                  }}
                >
                  <div className="p-6 prose dark:prose-invert max-w-none">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {lessonState?.lesson.content || 'No content available'}
                    </motion.div>
                    </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Questions Section with Animations */}
            <AnimatePresence mode="wait">
              {lessonState?.lesson.questions?.map((question, index) => (
                          <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-primary/10 overflow-hidden">
                    <CardHeader 
                            className={cn(
                        "cursor-pointer transition-colors",
                        activeQuestionIndex === index ? "bg-primary/10" : "hover:bg-primary/5"
                      )}
                      onClick={() => setActiveQuestionIndex(activeQuestionIndex === index ? null : index)}
                    >
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Question {index + 1}: {question.title}</span>
                        <motion.div
                          animate={{ rotate: activeQuestionIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.div>
                      </CardTitle>
                    </CardHeader>
                    <AnimatePresence>
                      {activeQuestionIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="p-6">
                            {renderQuestion({
                              ...question,
                              data: {
                                ...question.data
                              }
                            })}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
              </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Exercise Prompts Section */}
            {lessonState?.lesson.exercise_prompts && lessonState.lesson.exercise_prompts.length > 0 && (
              <Card className="border-2 border-primary/10">
                <CardHeader className="bg-primary/5 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-primary" />
                    Interactive Exercises
                  </CardTitle>
                  <CardDescription>
                    Complete these exercises to practice what you've learned
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[60vh]">
                    <div className="p-6 space-y-6">
                      {isExercisesLoading ? (
                        <ExerciseSkeleton />
                      ) : (
                <AnimatePresence mode="wait">
                          {lessonState.lesson.exercise_prompts.map((prompt: any, index) => {
                            const transformedPrompt: ExercisePrompt = {
                              ...prompt,
                              type: prompt.type as ExercisePrompt['type'],
                              content: {
                                question: prompt.text,
                                options: prompt.options || [],
                                instructions: prompt.narration,
                                hints: prompt.hints || []
                              },
                              metadata: {
                                estimatedTime: 5
                              }
                            };
                            
                            return (
                  <motion.div
                                key={transformedPrompt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Card 
                                  id={`exercise-${index}`}
                                  className={cn(
                                    "border border-primary/10 overflow-hidden transition-all duration-300",
                                    "hover:shadow-lg hover:border-primary/30",
                                    activeExerciseIndex === index && [
                                      "border-primary shadow-lg bg-primary/5",
                                      "animate-pulse-subtle"
                                    ]
                                  )}
                                >
                                  <CardHeader 
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setActiveExerciseIndex(
                                        activeExerciseIndex === index ? null : index
                                      );
                                      logger.info('Exercise header clicked', {
                                        source: 'LessonPage',
                                        context: { 
                                          exerciseId: transformedPrompt.id,
                                          index,
                                          timestamp: new Date().toISOString()
                                        }
                                      });
                                    }}
                                  >
                          <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                          <span className="font-semibold">{index + 1}</span>
                            </div>
                                        <div>
                                          <CardTitle className="text-lg">
                                            {transformedPrompt.content?.question || transformedPrompt.text || `Exercise ${index + 1}`}
                          </CardTitle>
                                          <CardDescription>
                                            {transformedPrompt.type} • {transformedPrompt.metadata?.estimatedTime || 5} mins
                                          </CardDescription>
                            </div>
                                      </div>
                                      <motion.div
                                        animate={{ rotate: activeExerciseIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <ChevronDown className="w-5 h-5" />
                                      </motion.div>
                              </div>
                                  </CardHeader>

                                  <AnimatePresence>
                                    {activeExerciseIndex === index && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <CardContent className="p-6">
                                          {/* Exercise Content */}
                                          <div className="space-y-6">
                                            {/* Instructions */}
                                            <motion.div
                                              initial={{ opacity: 0, y: -10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ delay: 0.2 }}
                                              className="bg-primary/5 p-4 rounded-lg"
                                            >
                                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <Info className="w-4 h-4" />
                                                Instructions
                                              </h4>
                                              <p className="text-sm text-muted-foreground">
                                                {transformedPrompt.narration || 'Complete the exercise below.'}
                                              </p>
                                            </motion.div>

                                            {/* Exercise Media */}
                                            {transformedPrompt.media && (
                                              <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3 }}
                                              >
                                                <Card className="overflow-hidden">
                                                  {transformedPrompt.type === 'image' && (
                                                    <img
                                                      src={transformedPrompt.media}
                                                      alt={transformedPrompt.text}
                                                      className="w-full h-48 object-cover transition-transform hover:scale-105"
                                                      loading="lazy"
                                                    />
                                                  )}
                                                  {transformedPrompt.type === 'video' && (
                                                    <video
                                                      src={transformedPrompt.media}
                                                      controls
                                                      className="w-full"
                                                      preload="metadata"
                                                    />
                                                  )}
                      </Card>
                                              </motion.div>
                                            )}

                                             {/*Exercise Input Based on Type
                                            <div className="space-y-4">
                                              {question.type === 'multiple-choice' && question.content?.options && (
                                                <RadioGroup
                                                  value={exerciseResponses[transformedPrompt.id] || ''}
                                                  onValueChange={(value: string) => {
                                                    setExerciseResponses(prev => ({
                                                      ...prev,
                                                      [transformedPrompt.id]: value
                                                    }));
                                                    setExerciseProgress(prev => ({
                                                      ...prev,
                                                      [transformedPrompt.id]: 100
                                                    }));
                                                    
                                                    logger.info('Exercise answer selected', {
                                                      source: 'LessonPage',
                                                      context: {
                                                        exerciseId: transformedPrompt.id,
                                                        type: transformedPrompt.type,
                                                        timestamp: new Date().toISOString()
                                                      }
                                                    });
                                                  }}
                                                >
                                                  <div className="space-y-2">
                                                    {transformedPrompt.content.options.map((option: string, optIndex: number) => (
                                                      <motion.div
                                                        key={optIndex}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                      >
                                                        <RadioGroupItem
                                                          value={option}
                                                          id={`${transformedPrompt.id}-${optIndex}`}
                                                          className="peer hidden"
                                                        />
                                                        <Label
                                                          htmlFor={`${transformedPrompt.id}-${optIndex}`}
                                                          className={cn(
                                                            "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer",
                                                            "transition-colors hover:bg-primary/5",
                                                            "peer-checked:border-primary peer-checked:bg-primary/5"
                                                          )}
                                                        >
                                                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            {String.fromCharCode(65 + optIndex)}
                            </div>
                                                          <span>{option}</span>
                                                        </Label>
                                                      </motion.div>
                                                    ))}
                          </div>
                                                </RadioGroup>
                                              )}

                                              {question.type === 'writing' && (
                              <div className="space-y-4">
                                                  <Textarea
                                                    placeholder="Type your answer here..."
                                                    value={exerciseResponses[transformedPrompt.id] || ''}
                                                    onChange={(e) => {
                                                      const value = e.target.value;
                                                      setExerciseResponses(prev => ({
                                                        ...prev,
                                                        [transformedPrompt.id]: value
                                                      }));
                                                      
                                                      // Calculate progress based on word count
                                                      const wordCount = value.trim().split(/\s+/).length;
                                                      const targetWordCount = 50; // Adjust as needed
                                                      const progress = Math.min((wordCount / targetWordCount) * 100, 100);
                                                      setExerciseProgress(prev => ({
                                                        ...prev,
                                                        [transformedPrompt.id]: progress
                                                      }));

                                                      logger.info('Writing exercise progress', {
                                                        source: 'LessonPage',
                                                        context: {
                                                          exerciseId: transformedPrompt.id,
                                                          wordCount,
                                                          progress,
                                                          timestamp: new Date().toISOString()
                                                        }
                                                      });
                                                    }}
                                                    className="min-h-[150px]"
                                                  />
                                                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                    <span>
                                                      {exerciseResponses[transformedPrompt.id]?.trim().split(/\s+/).length || 0} words
                                                    </span>
                                                    <Progress 
                                                      value={exerciseProgress[transformedPrompt.id] || 0} 
                                                      className="w-24 h-2"
                                                    />
                                  </div>
                                                </div>
                                              )}

                                              {/* Hints Section */}
                                              {/* {transformedPrompt.content?.hints && transformedPrompt.content.hints.length > 0 && (
                                                <div className="mt-6">
                                                  <Collapsible>
                                                    <CollapsibleTrigger asChild>
                                                      <Button variant="outline" className="w-full justify-between">
                                                        <span className="flex items-center gap-2">
                                                          <Lightbulb className="w-4 h-4" />
                                                          Need a hint?
                                                        </span>
                                                        <ChevronDown className="w-4 h-4" />
                                                      </Button>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent className="mt-4 space-y-2">
                                                      {transformedPrompt.content.hints.map((hint: string, hintIndex: number) => (
                                                        <motion.div
                                                          key={hintIndex}
                                                          initial={{ opacity: 0, y: -10 }}
                                                          animate={{ opacity: 1, y: 0 }}
                                                          transition={{ delay: hintIndex * 0.1 }}
                                                        >
                                                          <Card className="p-3 bg-muted">
                                                            <p className="text-sm">
                                                              <span className="font-semibold">Hint {hintIndex + 1}:</span>{' '}
                                                              {hint}
                                                            </p>
                                                          </Card>
                                                        </motion.div>
                                                      ))}
                                                    </CollapsibleContent>
                                                  </Collapsible>
                              </div>
                            )}
                                            </div> */} 
                          </div>
                        </CardContent>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                      </Card>
                  </motion.div>
                            );
                          })}
                </AnimatePresence>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Section - Media */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Media
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[70vh]">
                  <div className="p-6 space-y-4">
                    <AnimatePresence>
                      {lessonState?.lesson.questions?.map((question, index) => (
                        <React.Fragment key={`media-${index}`}>
                          {question.metadata?.imageUrl && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                              className="cursor-pointer"
                            >
                              <Card className="overflow-hidden">
                                <img
                                  src={question.metadata.imageUrl}
                                  alt={`Media ${index + 1}`}
                                  className="w-full h-48 object-cover transition-transform hover:scale-105"
                                  loading="lazy"
                                />
                              </Card>
                            </motion.div>
                          )}
                          {question.metadata?.videoUrl && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card className="overflow-hidden">
                                <video
                                  src={question.metadata.videoUrl}
                                  controls
                                  className="w-full"
                                  preload="metadata"
                                />
                              </Card>
                            </motion.div>
                          )}
                        </React.Fragment>
                      ))}
                    </AnimatePresence>
              </div>
                </ScrollArea>
              </CardContent>
            </Card>
            </div>
          </div>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onError={(e) => {
            logger.error('Audio playback error', {
              source: 'LessonPage',
              context: { error: e }
            });
            setIsPlaying(false);
          }}
        />
      </div>
    </div>
  );
};

export default LessonPage;
