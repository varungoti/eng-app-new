"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { 
  RefreshCw, X, BookOpen, Clock, CheckCircle2, ChevronRight, 
  Lightbulb, Volume2, VolumeX, Play, Pause, ArrowLeft, ArrowRight,
  CheckCircle, HelpCircle, Award, Star, ImageIcon, PenTool,
  Mic, Video, FileText, Pencil, Book, MessageCircle, Brain,
  Headphones, Type, Layers, Target, Presentation, Sparkles,
  Maximize2, Minimize2, GripVertical
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { logger } from "@/lib/logger";
import { useToast } from "@/components/ui/use-toast";
import { QuestionTypeIcon } from "@/components/ui/question-type-icons";
import { QUESTION_TYPES, isQuestionType } from "@/app/content-management/constants";
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
//import { ExercisePromptCard } from "@/app/content-management/components/exercise-prompt-card";
import { ExercisePromptView } from "@/components/exercise-prompt-view";

// Question Types from question-form.tsx
interface QuestionMetadata {
  prompt?: string;
  teacherScript?: string;
  sampleAnswer?: string;
  options?: string[];
  correctAnswer?: string | number;
  imageUrl?: string;
  videoUrl?: string;
  audioContent?: string;
  transcript?: string;
  passage?: string;
  questions?: string[];
  writingPrompt?: string;
  speakingPrompt?: string;
  listeningPrompt?: string;
  grammarPoint?: string;
  example?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  points?: number;
  type?: string;
  data?: any;
  // Additional fields for various question types
  sentence?: string;
  blanks?: string[];
  items?: string[];
  descriptions?: string[];
  topic?: string;
  position?: string;
  keyPoints?: string[];
  idiom?: string;
  meaning?: string;
  usageNotes?: string;
  storyPrompt?: string;
  keywords?: string[];
  wordlistPrompt?: any[];
  exercise_prompts?: Array<{
    id: string;
    text: string;
    type?: string;
    media?: string;
    content?: {
      instructions?: string;
      writingPrompt?: string;
      speakingPrompt?: string;
    };
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  }>;
}

interface Question {
  id: string;
  title: string;
  content: string;
  type: string;
  data: {
    prompt: string;
    teacherScript: string;
    sampleAnswer?: string;
    followupPrompt?: string[];
  };
  metadata?: {
    difficulty?: string;
    timeLimit?: number;
    points?: number;
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
    options?: string[];
    correctAnswer?: string;
    passage?: string;
    grammarPoint?: string;
    example?: string;
    speakingPrompt?: string;
    listeningPrompt?: string;
  };
  exercise_prompts: ExercisePrompt[];
}

interface ExercisePrompt {
  id: string;
  text: string;
  type: 'image' | 'video' | 'gif';
  media: string | null;
  narration: string | null;
  saytext: string | null;
  content?: {
    instructions?: string;
    writingPrompt?: string;
    speakingPrompt?: string;
  };
  metadata?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: number;
  };
}

interface LessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lessonContent: {
    content: any;
    isLoading: boolean;
    error: string | null;
  };
  currentLessonId: string | null;
  onRetry: () => void;
}

// Add this type definition at the top of the file
type QuestionType = keyof typeof QUESTION_TYPES;

export function LessonDialog({
  isOpen,
  onClose,
  lessonContent,
  currentLessonId,
  onRetry
}: LessonDialogProps) {
  const dialogId = React.useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);

  // State for audio controls
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("questions");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Add these state variables in the LessonDialog component
  const [isMediaFullscreen, setIsMediaFullscreen] = useState(false);
  const [startResizing, setStartResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const [leftPanelWidth, setLeftPanelWidth] = useState(() => {
    const saved = localStorage.getItem('lesson-dialog-left-panel');
    return saved ? parseInt(saved) : 65;
  });

  // Add this new state for resize hover effect
  const [isResizeHovered, setIsResizeHovered] = useState(false);

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
      setCurrentProgress(Math.max(currentProgress, progress));
      
      logger.info('Audio progress updated', {
        source: 'LessonDialog',
        context: { 
          progress: Math.round(progress),
          currentAudioIndex,
          totalAudios: audioQueue.length,
          lessonId: currentLessonId
        }
      });
    }
  };

  const handleAudioEnded = () => {
    if (currentAudioIndex < audioQueue.length - 1) {
      // Play next audio in queue
      setCurrentAudioIndex(prev => prev + 1);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = audioQueue[currentAudioIndex + 1];
        audioRef.current.play();
      }
    } else {
      // All audio completed
      setIsPlaying(false);
      setCurrentProgress(100);
      
      toast({
        title: "�� Lesson Complete!",
        description: "You've finished listening to this lesson.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("questions")}
          >
            Start Questions
          </Button>
        )
      });
    }
  };

  // Function to handle tab change with logging
  const handleTabChange = (value: string) => {
    logger.info('Tab changed in lesson dialog', {
      source: 'LessonDialog',
      context: { 
        previousTab: activeTab,
        newTab: value,
        lessonId: currentLessonId
      }
    });
    setActiveTab(value);
  };

  // Function to toggle audio playback
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      
      logger.info('Audio playback toggled', {
        source: 'LessonDialog',
        context: { 
          newState: !isPlaying,
          lessonId: currentLessonId
        }
      });
    }
  };

  // Function to toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      
      logger.info('Audio mute toggled', {
        source: 'LessonDialog',
        context: { 
          newState: !isMuted,
          lessonId: currentLessonId
        }
      });
    }
  };

  // Add audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleAudioEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('ended', handleAudioEnded);
        }
      };
    }
  }, []);

  // Update the audio queue effect with proper typing
  useEffect(() => {
    if (lessonContent.content) {
      // Build audio queue from content
      const queue = [
        lessonContent.content.audioUrl, // Main content audio 
        ...(lessonContent.content.questions?.map((q: Question) => q.metadata?.audioUrl) || []).filter(Boolean)
      //  
      //   audioRef.current.currentTime = 0;
      //   audioRef.current.play();
      //   setPlaying(true);
      //   setPlaying(false);
        
        //   console.log("Playing audio");
        //   audioRef.current.play();
        //   setPlaying(true);
        //   setPlaying(false);ata?.audioUrl) || []).filter(Boolean)
      ];
      setAudioQueue(queue);
    }
  }, [lessonContent.content]);

  // Function to handle question selection
  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);
    logger.info('Question selected', {
      source: 'LessonDialog',
      context: { 
        questionIndex: index,
        lessonId: currentLessonId
      }
    });
  };

  // Add this effect to save split sizes
  useEffect(() => {
    localStorage.setItem('lesson-dialog-left-panel', leftPanelWidth.toString());
  }, [leftPanelWidth]);

  // Update the resize handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!startResizing) return;
      
      e.preventDefault();
      const container = resizeRef.current?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const clampedWidth = Math.min(Math.max(newWidth, 30), 70);
      
      setLeftPanelWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      setStartResizing(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (startResizing) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [startResizing]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[100vw] w-full h-[100vh] p-0 max-h-screen bg-gradient-to-b from-background to-accent/10"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        {/* Header Section */}
        <DialogHeader className="p-6 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <DialogTitle id={titleId} className="text-2xl font-bold flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  {lessonContent.content?.title || 'Lesson Content'}
                </DialogTitle>
                <DialogDescription id={descriptionId} className="text-base text-muted-foreground mt-2">
                  {lessonContent.content?.description || 'Interactive lesson content and activities'}
                </DialogDescription>
              </motion.div>
            </div>

            {/* Controls Section */}
            <div className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="rounded-full hover:bg-primary/10"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlayback}
                  className="rounded-full hover:bg-primary/10"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </motion.div>

              <div className="h-6 w-px bg-border mx-2" />

              <Button 
                variant="ghost" 
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-destructive/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center gap-4">
              <Progress value={currentProgress} className="h-1 flex-1" />
              <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
                {Math.round(currentProgress)}%
              </span>
            </div>
            {audioProgress > 0 && (
              <div className="flex items-center gap-4 mt-1">
                <Progress value={audioProgress} className="h-1 flex-1 bg-primary/20" />
                <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
                  {Math.round(audioProgress)}%
                </span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <Tabs
            defaultValue="questions"
            value={activeTab}
            onValueChange={handleTabChange}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="questions" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Questions
              </TabsTrigger>
              <TabsTrigger value="exercises" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Activities
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Content
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>

        {/* Main Content Area */}
        <div className="flex h-[calc(100vh-12rem)] w-full" ref={resizeRef}>
          {/* Left Panel - Main Content */}
          <div 
            className="h-full overflow-hidden transition-all duration-75"
            style={{ width: `${leftPanelWidth}%` }}
          >
            <ScrollArea className="h-full w-full">
              <div className="container p-6">
                {lessonContent.isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center h-[50vh]"
                  >
                    <LoadingSpinner message="Loading your lesson content..." />
                  </motion.div>
                ) : lessonContent.error ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center gap-4 h-[50vh]"
                  >
                    <div className="p-8 bg-destructive/10 rounded-lg text-center max-w-md">
                      <p className="text-destructive font-medium mb-4">{lessonContent.error}</p>
                      <Button 
                        onClick={onRetry} 
                        variant="outline" 
                        className="gap-2 hover:bg-destructive/5"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Retry Loading
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <Tabs defaultValue="questions" value={activeTab} onValueChange={handleTabChange}>
                    <TabsContent value="questions">
                      <QuestionsTab 
                        questions={lessonContent.content?.questions} 
                        selectedIndex={selectedQuestionIndex}
                        onQuestionSelect={handleQuestionSelect}
                        onNextLesson={() => {
                          logger.info('Navigating to next lesson', {
                            source: 'LessonDialog',
                            context: { currentLessonId }
                          });
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="exercises">
                      <ExercisesTab exercises={lessonContent.content?.exercise_prompts} />
                    </TabsContent>
                    <TabsContent value="content">
                      <ContentTab content={lessonContent.content} />
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Resize Handle */}
          <div 
            className={cn(
              "w-6 relative cursor-col-resize select-none group z-10",
              startResizing && "active"
            )}
            onMouseDown={() => setStartResizing(true)}
            onMouseEnter={() => setIsResizeHovered(true)}
            onMouseLeave={() => setIsResizeHovered(false)}
          >
            <div className={cn(
              "absolute inset-y-0 left-1/2 -translate-x-1/2 w-px transition-all duration-200",
              (startResizing || isResizeHovered) ? "bg-primary/50 w-0.5" : "bg-border"
            )} />
            <div className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-4 h-8 rounded-full flex items-center justify-center",
              "transition-all duration-200",
              (startResizing || isResizeHovered) ? "bg-primary/20" : "bg-transparent"
            )}>
              <GripVertical className={cn(
                "h-4 w-4 transition-colors duration-200",
                (startResizing || isResizeHovered) ? "text-primary" : "text-muted-foreground/50"
              )} />
            </div>
          </div>

          {/* Right Panel - Media Preview */}
          <div 
            className={cn(
              "h-full border-l bg-muted/5 backdrop-blur-sm transition-all duration-75",
              "relative overflow-hidden"
            )}
            style={{ width: `${100 - leftPanelWidth}%` }}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-background/50 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-primary">Media Preview</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 rounded-full",
                      "hover:bg-primary/10 hover:text-primary",
                      "transition-all duration-200"
                    )}
                    onClick={() => setIsMediaFullscreen(!isMediaFullscreen)}
                  >
                    {isMediaFullscreen ? (
                      <Minimize2 className="h-4 w-4" />
                    ) : (
                      <Maximize2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {lessonContent.content?.media ? (
                    <div className="space-y-6">
                      {lessonContent.content.media.map((item: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ 
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                          }}
                          className={cn(
                            "relative group rounded-xl overflow-hidden",
                            "ring-1 ring-primary/10 hover:ring-primary/30",
                            "transition-all duration-300",
                            "bg-gradient-to-br from-background/50 to-background/30",
                            "backdrop-blur-sm shadow-xl",
                            isMediaFullscreen && "fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-8"
                          )}
                        >
                          {item.type === 'image' ? (
                            <div className="relative aspect-video">
                              <img
                                src={item.url}
                                alt={`Media ${index + 1}`}
                                className={cn(
                                  "w-full h-full object-cover rounded-lg",
                                  "transition-all duration-500",
                                  "hover:scale-[1.02] cursor-zoom-in",
                                  "group-hover:brightness-110",
                                  isMediaFullscreen && "object-contain h-full mx-auto cursor-zoom-out"
                                )}
                                onClick={() => setIsMediaFullscreen(!isMediaFullscreen)}
                              />
                              <div className={cn(
                                "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent",
                                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              )} />
                            </div>
                          ) : item.type === 'video' && (
                            <div className="relative aspect-video">
                              <video
                                src={item.url}
                                controls
                                className={cn(
                                  "w-full h-full object-cover rounded-lg",
                                  "transition-all duration-500",
                                  "hover:scale-[1.02]",
                                  "group-hover:brightness-110",
                                  isMediaFullscreen && "h-full mx-auto object-contain"
                                )}
                                preload="metadata"
                              />
                              <div className={cn(
                                "absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent",
                                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              )} />
                            </div>
                          )}
                          <div className={cn(
                            "absolute inset-x-0 bottom-0 p-4",
                            "bg-gradient-to-t from-black/80 to-transparent",
                            "opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0",
                            isMediaFullscreen && "!opacity-100 !translate-y-0"
                          )}>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className={cn(
                                "bg-background/80 backdrop-blur-sm",
                                "border-primary/20 text-primary",
                                "px-3 py-1 rounded-full"
                              )}>
                                {item.type === 'image' ? (
                                  <span className="flex items-center gap-2">
                                    <ImageIcon className="h-4 w-4" />
                                    Image {index + 1}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <Video className="h-4 w-4" />
                                    Video {index + 1}
                                  </span>
                                )}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "text-white hover:bg-white/20",
                                  "rounded-full h-8 w-8 p-0"
                                )}
                                onClick={() => setIsMediaFullscreen(!isMediaFullscreen)}
                              >
                                {isMediaFullscreen ? (
                                  <Minimize2 className="h-4 w-4" />
                                ) : (
                                  <Maximize2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                    >
                      <div className="p-4 rounded-full bg-primary/5 mb-4">
                        <ImageIcon className="h-12 w-12 text-primary opacity-50" />
                      </div>
                      <p className="text-center text-sm">No media available for this lesson</p>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Fullscreen Media Sheet */}
        <Sheet open={isMediaFullscreen} onOpenChange={setIsMediaFullscreen}>
          <SheetContent side="right" className="w-full sm:w-[90vw] p-0">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-background/50 backdrop-blur-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Media Preview</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMediaFullscreen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-4">
                  {lessonContent.content?.media?.map((item: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative rounded-xl overflow-hidden shadow-xl"
                    >
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt={`Media ${index + 1}`}
                          className="w-full h-auto object-contain max-h-[80vh] rounded-lg"
                        />
                      ) : item.type === 'video' && (
                        <video
                          src={item.url}
                          controls
                          className="w-full h-auto max-h-[80vh] rounded-lg"
                          preload="metadata"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                          {item.type === 'image' ? 'Image' : 'Video'} {index + 1}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={audioQueue[currentAudioIndex]}
          onEnded={handleAudioEnded}
          onTimeUpdate={handleTimeUpdate}
          onCanPlay={() => setIsAudioReady(true)}
          onError={(e) => {
            logger.error('Audio playback error', {
              source: 'LessonDialog',
              context: { 
                error: e,
                currentAudioIndex,
                audioUrl: audioQueue[currentAudioIndex]
              }
            });
            setIsPlaying(false);
            toast({
              title: "Audio Error",
              description: "Failed to play audio content. Please try again."
            });
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

// Content Tab Component
function ContentTab({ content }: { content: any }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      <Card className="prose prose-sm max-w-none dark:prose-invert border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Lesson Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="mt-4"
            dangerouslySetInnerHTML={{ 
              __html: content?.content || 'No content available' 
            }} 
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Questions Tab Component
function QuestionsTab({ 
  questions, 
  selectedIndex,
  onQuestionSelect,
  onNextLesson 
}: { 
  questions: Question[],
  selectedIndex: number | null,
  onQuestionSelect: (index: number) => void,
  onNextLesson: () => void
}) {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [questionProgress, setQuestionProgress] = useState<Record<string, number>>({});

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleQuestionAnswer = (questionId: string, progress: number) => {
    setQuestionProgress(prev => ({
      ...prev,
      [questionId]: progress
    }));
  };

  const totalProgress = questions?.length 
    ? Object.values(questionProgress).reduce((acc, curr) => acc + curr, 0) / questions.length
    : 0;

  if (!questions?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center justify-center h-[50vh] text-center"
      >
        <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No questions available for this lesson</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Overall Progress */}
      <Card className="border-primary/10 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-medium">Overall Progress</span>
            </div>
            <Badge 
              variant="outline" 
              className={cn(
                "bg-primary/10",
                totalProgress === 100 && "bg-green-500/10 text-green-500"
              )}
            >
              {Math.round(totalProgress)}% Complete
            </Badge>
          </div>
          <Progress 
            value={totalProgress} 
            className="h-2 bg-primary/20"
          />
          <div className="mt-2 text-sm text-muted-foreground">
            {questions.length} Questions • {Object.values(questionProgress).filter(p => p === 100).length} Completed
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.id}
            question={question}
            index={index}
            isExpanded={expandedQuestions[question.id] || false}
            onToggle={() => toggleQuestion(question.id)}
            onAnswer={(progress) => handleQuestionAnswer(question.id, progress)}
            progress={questionProgress[question.id] || 0}
          />
        ))}
      </div>

      {/* Next Lesson Button */}
      {totalProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky bottom-4 flex justify-center"
        >
          <Button
            onClick={onNextLesson}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white px-8 py-6 rounded-full shadow-lg"
          >
            <span className="flex items-center gap-2">
              Continue to Next Lesson
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Exercises Tab Component
function ExercisesTab({ exercises }: { exercises: any[] }) {
  if (!exercises?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center justify-center h-[50vh] text-center"
      >
        <Award className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No exercises available for this lesson</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {exercises.map((exercise, index) => (
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-primary/10 shadow-md hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-primary/5">
                  Exercise {index + 1}
                </Badge>
                <Badge variant="outline" className="bg-primary/5">
                  {exercise.questionType}
                </Badge>
                {exercise.difficulty && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "capitalize",
                      exercise.difficulty === 'beginner' && "bg-green-500/10 text-green-500",
                      exercise.difficulty === 'intermediate' && "bg-yellow-500/10 text-yellow-500",
                      exercise.difficulty === 'advanced' && "bg-red-500/10 text-red-500"
                    )}
                  >
                    {exercise.difficulty}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base mt-2">{exercise.text}</CardTitle>
              {exercise.content?.instructions && (
                <CardDescription className="mt-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  {exercise.content.instructions}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exercise.media && (
                  <div className="mt-4 rounded-lg overflow-hidden border">
                    {exercise.type === 'image' && (
                      <img 
                        src={exercise.media} 
                        alt={exercise.text}
                        className="w-full h-auto object-cover"
                      />
                    )}
                    {exercise.type === 'video' && (
                      <video 
                        src={exercise.media}
                        controls
                        className="w-full"
                      />
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Add this component before the QuestionsTab component

function QuestionCard({ 
  question,
  index,
  isExpanded,
  onToggle,
  onAnswer,
  progress
}: { 
  question: Question;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onAnswer: (progress: number) => void;
  progress: number;
}) {
  const [activeFollowup, setActiveFollowup] = useState<number | null>(null);

  // Early return if question is invalid
  if (!question || typeof question !== 'object') {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Invalid Question Data</CardTitle>
          <CardDescription>This question cannot be displayed due to invalid data.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getQuestionIcon = (type: string) => {
    if (!isQuestionType(type)) return <Target className="h-5 w-5" />;
    
    switch (type) {
      // Speaking related
      case 'speaking':
      case 'speakingAndWriting':
      case 'speakingAndListening':
      case 'speakingWithAPartner':
      case 'speakingAndSpeaking':
        return <Mic className="h-5 w-5" />;
        
      // Writing related
      case 'writing':
        return <Pencil className="h-5 w-5" />;
        
      // Reading related
      case 'reading':
      case 'readingAndSpeaking':
        return <Book className="h-5 w-5" />;
        
      // Listening related
      case 'listening':
      case 'listenAndRepeat':
        return <Headphones className="h-5 w-5" />;
        
      // Multiple choice and matching
      case 'multipleChoice':
      case 'fillInTheBlank':
      case 'matching':
      case 'trueOrFalse':
        return <Layers className="h-5 w-5" />;
        
      // Grammar related
      case 'grammarSpeaking':
      case 'sentenceFormation':
      case 'sentenceTransformation':
      case 'sentenceCompletion':
      case 'sentenceTransformationAndCompletion':
        return <Type className="h-5 w-5" />;
        
      // Vocabulary related
      case 'vocabularyAndSpeaking':
      case 'vocabularyAndWordlist':
        return <Brain className="h-5 w-5" />;
        
      // Presentation
      case 'presentation':
        return <Presentation className="h-5 w-5" />;
        
      // Story related
      case 'storytelling':
        return <BookOpen className="h-5 w-5" />;
        
      // Visual related
      case 'lookAndSpeak':
      case 'watchAndSpeak':
        return <Video className="h-5 w-5" />;
        
      // Interactive
      case 'debate':
      case 'actionAndSpeaking':
      case 'objectAndSpeaking':
      case 'objectActionAndSpeaking':
        return <MessageCircle className="h-5 w-5" />;
        
      // Idioms
      case 'idiomPractice':
        return <Sparkles className="h-5 w-5" />;
        
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const renderQuestionContent = () => {
    if (!question.data) return null;

    return (
      <div className="space-y-6">
        {/* Main Question Content - Always show these first */}
        <div className="space-y-4">
          {/* Prompt - Always required */}
          <Card className="bg-background/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <MessageCircle className="h-4 w-4" />
                <h4 className="font-medium">Prompt</h4>
              </div>
              <p className="text-muted-foreground">{question.data.prompt}</p>
            </CardContent>
          </Card>

          {/* Teacher Script - Always required */}
          <Card className="bg-muted/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <PenTool className="h-4 w-4" />
                <h4 className="font-medium">Teacher Script</h4>
              </div>
              <p className="text-muted-foreground">{question.data.teacherScript}</p>
            </CardContent>
          </Card>

          {/* Sample Answer - Optional */}
          {question.data.sampleAnswer && (
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <h4 className="font-medium">Sample Answer</h4>
                </div>
                <p className="text-muted-foreground">{question.data.sampleAnswer}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Question Type Specific Content */}
        {question.metadata && (
          <Card className="border-primary/10">
            <CardContent className="p-4">
              {renderQuestionTypeContent(question)}
            </CardContent>
          </Card>
        )}

        {/* Exercise Prompts - If available */}
        {question.exercise_prompts?.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Award className="h-5 w-5" />
              <h3 className="font-medium">Practice Exercises</h3>
            </div>
            <div className="grid gap-4">
              {question.exercise_prompts.map((prompt, idx) => (
                <ExercisePromptView
                  key={prompt.id}
                  prompt={prompt}
                  index={idx}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper function to render type-specific content
  const renderQuestionTypeContent = (question: Question) => {
    if (!question.metadata) return null;

    switch (question.type.toLowerCase()) {
      case 'multiplechoice':
        return (
          <div className="space-y-4">
            {question.metadata.options?.map((option, idx) => (
              <RadioGroupItem
                key={idx}
                value={option}
                className="w-full p-4 rounded-lg border hover:bg-accent"
              >
                {option}
              </RadioGroupItem>
            ))}
          </div>
        );

      case 'speaking':
        return (
          <div className="space-y-4">
            {question.metadata.speakingPrompt && (
              <div className="bg-accent/5 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Speaking Prompt</h4>
                <p>{question.metadata.speakingPrompt}</p>
              </div>
            )}
          </div>
        );

      // Add more cases for other question types...

      default:
        return null;
    }
  };

  const getQuestionColor = (type: string): string => {
    switch (type) {
      // Speaking related
      case 'speaking':
      case 'speakingAndWriting':
      case 'speakingAndListening':
      case 'speakingWithAPartner':
        return 'from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20';
      
      // Writing related
      case 'writing':
      case 'writingAndSpeaking':
        return 'from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20';
      
      // Reading related
      case 'reading':
      case 'readingAndSpeaking':
        return 'from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20';
      
      // Listening related
      case 'listening':
      case 'listenAndRepeat':
        return 'from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20';
      
      // Multiple choice and matching
      case 'multipleChoice':
      case 'matching':
      case 'fillInTheBlank':
      case 'trueOrFalse':
        return 'from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20';
      
      // Grammar related
      case 'grammarSpeaking':
      case 'sentenceFormation':
        return 'from-teal-500/10 to-emerald-500/10 hover:from-teal-500/20 hover:to-emerald-500/20';
      
      // Vocabulary related
      case 'vocabularyAndSpeaking':
      case 'vocabularyAndWordlist':
        return 'from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20';
      
      // Presentation and debate
      case 'presentation':
      case 'debate':
        return 'from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20';
      
      // Story and idiom
      case 'storytelling':
      case 'idiomPractice':
        return 'from-yellow-500/10 to-amber-500/10 hover:from-yellow-500/20 hover:to-amber-500/20';
      
      default:
        return 'from-gray-500/10 to-slate-500/10 hover:from-gray-500/20 hover:to-slate-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300",
          "border border-primary/10",
          "bg-gradient-to-r",
          getQuestionColor(question.type),
          isExpanded && "ring-2 ring-primary/20 ring-offset-2",
          "hover:shadow-xl hover:translate-y-[-2px]",
          "group backdrop-blur-sm",
          "animate-in slide-in-from-bottom-2",
          progress === 100 && "bg-opacity-50"
        )}
      >
        <CardHeader 
          className={cn(
            "cursor-pointer select-none p-6",
            "transition-all duration-300",
            "hover:bg-primary/5 backdrop-blur-sm",
            isExpanded && "bg-primary/5"
          )}
          onClick={onToggle}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge 
                variant="outline" 
                className={cn(
                  "px-3 py-1 text-sm font-medium rounded-full",
                  "bg-background/50 backdrop-blur-sm shadow-sm",
                  "border border-primary/20",
                  "transition-all duration-300",
                  "group-hover:bg-primary/10 group-hover:border-primary/20",
                  "animate-in zoom-in-50 duration-300"
                )}
              >
                Question {index + 1}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn(
                  "flex items-center gap-2 px-3 py-1",
                  "bg-background/50 backdrop-blur-sm shadow-sm",
                  "border border-primary/20",
                  "transition-all duration-300",
                  "group-hover:bg-primary/10 group-hover:border-primary/20",
                  "animate-in zoom-in-50 duration-300 delay-100"
                )}
              >
                {getQuestionIcon(question.type)}
                <span className="capitalize">
                  {isQuestionType(question.type) ? QUESTION_TYPES[question.type as QuestionType]?.label : question.type}
                </span>
              </Badge>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className={cn(
                "bg-background/50 backdrop-blur-sm p-2 rounded-full",
                "transition-all duration-300",
                "group-hover:bg-primary/10",
                "shadow-sm border border-primary/20"
              )}
            >
              <ChevronRight className="h-5 w-5 text-primary" />
            </motion.div>
          </div>

          <div className="mt-4 space-y-3">
            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
              {question.title || 'Untitled Question'}
            </CardTitle>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10 rounded-full" />
              <Progress 
                value={progress} 
                className={cn(
                  "h-2 rounded-full",
                  "transition-all duration-300",
                  progress === 100 
                    ? "bg-green-500/20" 
                    : "bg-primary/10"
                )}
              />
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                {progress === 100 ? (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 text-green-500"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Completed
                  </motion.span>
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-4 w-4" />
                    {`${Math.round(progress)}% complete`}
                  </motion.span>
                )}
              </p>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            >
              <CardContent className="p-6 pt-0">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-background/50 backdrop-blur-sm rounded-lg p-4 border border-primary/10 shadow-sm"
                  >
                    <p className="text-muted-foreground">{question.content || 'No content available.'}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-primary/10 shadow-sm"
                  >
                    {renderQuestionContent()}
                  </motion.div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
} 