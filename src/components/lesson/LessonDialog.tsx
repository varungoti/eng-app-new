"use client"

import React, { useState, useRef, useEffect, useCallback, Fragment } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { 
  RefreshCw, X, BookOpen, Clock, CheckCircle2, ChevronRight, 
  Lightbulb, Volume2, VolumeX, Play, Pause,  ArrowRight,
  CheckCircle, HelpCircle, Award,  ImageIcon, PenTool,
  Mic, Video,  Pencil, Book, MessageCircle, Brain,
  Headphones, Type, Layers, Target, Presentation, Sparkles,
  Maximize2, Minimize2, GripVertical, GripHorizontal
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
//import { QuestionTypeIcon } from "@/components/ui/question-type-icons";
import { QUESTION_TYPES, isQuestionType } from "@/app/content-management/constants";
//import { RichTextEditor } from '@/components/editor/RichTextEditor';
import {  RadioGroupItem } from "@/components/ui/radio-group";
//import { Label } from "@/components/ui/label";
//import { Input } from "@/components/ui/input";
//import { Textarea } from "@/components/ui/textarea";
//import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent} from "@/components/ui/sheet";
//import { ExercisePromptCard } from "@/app/content-management/components/exercise-prompt-card";
import { ExercisePromptView } from "@/components/exercise-prompt-view";
import { ImagePreview } from '../common/ImagePreview';
import speechService from '@/lib/fish-speech';
// Add this import at the top with other imports
import Image from 'next/image';

// Question Types from question-form.tsx
interface QuestionMetadata {
  prompt?: string;
  teacher_script?: string;
  sample_answer?: string;
  options?: string[];
  correct_answer?: string | number;
  image_url?: string;
  video_url?: string;
  audio_content?: string;
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
    teacher_script: string;
    sample_answer?: string;
    followup_prompt?: string[];
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
  title?: string; // Add title property that's used in the code
  data?: any; // Add data property that's used in the code
  content?: {
    instructions?: string;
    writingPrompt?: string;
    speakingPrompt?: string;
    imageUrl?: string; // Add imageUrl property that's used in the code
  };
  metadata?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: number;
    imageUrl?: string; // Add imageUrl property that's used in the code
  };
}

interface ContentItem {
  id: string;
  text: string;
  type: string;
  sourceId: string;
  url?: string; // Add url property as it's used in the code
}

// Add CurrentMedia type definition
interface CurrentMedia {
  sourceId: string;
  type: string;
  url: string;
  title: string; // Add title property as it's used throughout the code
  isExternalDomain?: boolean; // Add flag for external domains
  isPermanent?: boolean; // Add flag to indicate if this media was manually selected
  mediaUrl?: string; // Add mediaUrl property to match usage in the code
}

interface MediaData {
  mediaUrl: string;
  sourceType: string;
  sourceId: string;
  isPermanent?: boolean;
  title?: string;
  type?: string;
  url?: string;
  isExternalDomain?: boolean;
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

// At the top of the file, with other constants
const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"%3E%3Crect width="800" height="450" fill="%23f0f0f0"/%3E%3Ctext x="400" y="225" font-family="Arial" font-size="24" text-anchor="middle" fill="%23888888"%3ENo Image Available%3C/text%3E%3C/svg%3E';

// Add a declaration for window.__PERMANENT_MEDIA__
declare global {
  interface Window {
    __PERMANENT_MEDIA__?: any;
  }
}

// Add EventListener type if it's missing
declare global {
  interface EventListener {
    (evt: Event): void;
  }
}

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

  // Set up state variables
  const [activeTab, setActiveTab] = useState<string>("content");
  const [currentMedia, setCurrentMedia] = useState<CurrentMedia | null>(null);
  const [isAudioReady, setIsAudioReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.8);
  const [currentAudioTime, setCurrentAudioTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentlyHighlightedContentId, setCurrentlyHighlightedContentId] = useState<string | null>(null);
  const [showRightPanel, setShowRightPanel] = useState<boolean>(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);
  const [wasPlayingBeforeMute, setWasPlayingBeforeMute] = useState(false);
  const [contentQueue, setContentQueue] = useState<ContentItem[]>([]);
  const [currentContentItem, setCurrentContentItem] = useState<number>(-1);
  const [useBrowserTTS, setUseBrowserTTS] = useState<boolean>(false);

  // Add these state variables in the LessonDialog component
  const [isMediaFullscreen, setIsMediaFullscreen] = useState(false);
  const [startResizing, setStartResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Add this new state for resize hover effect
  const [isResizeHovered, setIsResizeHovered] = useState(false);

  // Add additional state for voice control and text highlighting
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentlyHighlightedId, setCurrentlyHighlightedId] = useState<string | null>(null);
  const contentRef = useRef<{[key: string]: HTMLElement}>({});

  // Initialize references for audio handling
  const audioBufferRef = useRef<any | null>(null); // Use 'any' type to avoid audioBuffer type conflicts
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Create a state variable for voice initialization
  const [isVoiceInitialized, setIsVoiceInitialized] = useState<boolean>(false);
  
  // Add a ref to track the previously processed tab/question combination
  const processedMediaRef = useRef<{
    tabId: string | null;
    questionId: string | null;
    lastPermanentMedia?: CurrentMedia;
    wasPlayingBeforeMute?: boolean;
  }>({
    tabId: null,
    questionId: null
  });
  
  // Helper function to determine media type from URL
  const getMediaType = useCallback((url: string): string => {
    if (!url) return 'unknown';
    
    const extension = url.split('.').pop()?.toLowerCase();
    if (!extension) return 'unknown';
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
      return 'video';
    } else if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
      return 'audio';
    }
    
    return 'unknown';
  }, []);

  // Load available voices when component mounts
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };
    
    // Load voices immediately if available
    loadVoices();
    
    // Also set up event listener for when voices change (happens async in some browsers)
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Get the best voice available - prioritize natural voices
  const getBestVoice = () => {
    if (availableVoices.length === 0) return null;
    
    // Try to find a good English voice that sounds natural
    const preferredVoices = availableVoices.filter(voice => 
      voice.lang.includes('en') && !voice.name.includes('Google')
    );
    
    // If no preferred voices found, pick any English voice
    if (preferredVoices.length === 0) {
      const englishVoices = availableVoices.filter(voice => voice.lang.includes('en'));
      return englishVoices.length > 0 ? englishVoices[0] : availableVoices[0];
    }
    
    return preferredVoices[0];
  };
  
  // Fix the voice initialization function
  useEffect(() => {
    // Initialize Fish-Speech voice on component mount
    const initializeVoice = async () => {
      try {
        console.log('Initializing Fish-Speech voice...');
        
        // Always set a default voice to ensure we have one
        console.log('Setting default voice: en-US-female-1');
        await speechService.setVoice("en-US-female-1");
        console.log('Default voice set successfully');
        
        setIsVoiceInitialized(true);
      } catch (error) {
        console.error('Error initializing Fish-Speech voice:', error);
        setIsVoiceInitialized(false);
      }
    };

    initializeVoice();
    
    // Clean up on unmount - cancel any pending speech
    return () => {
      // Stop any ongoing speech
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
          audioSourceRef.current = null;
        } catch (error) {
          console.error('Error stopping audio:', error);
        }
      }
      
      // Also cancel any browser speech synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Function to handle direct media display from exercise prompts
  const displayMediaFromExercise = useCallback((exercisePrompt: ExercisePrompt) => {
    // If no exercise prompt provided, exit early
    if (!exercisePrompt) {
      console.log("No exercise prompt provided");
      return;
    }
    
    // Check if this media has already been displayed with the same ID
    if (currentMedia?.sourceId === exercisePrompt.id) {
      console.log("Media already displayed for this exercise prompt, not redisplaying");
      return;
    }
    
    console.log("Displaying media from exercise prompt:", exercisePrompt.id || 'unknown');
    
    // Log full exercise prompt for debug
    console.log("📝 Full exercise prompt:", exercisePrompt);
    
    // Extract media URL from the prompt
    let mediaUrl: string | null = null;
    let mediaType: string = 'image';
    
    // Try various possible locations for media URL
    if (exercisePrompt.media && typeof exercisePrompt.media === 'string') {
      // Direct media URL
      console.log("📸 Media from direct media property");
      mediaUrl = exercisePrompt.media;
    } else if (exercisePrompt.metadata?.imageUrl) {
      // Metadata with imageUrl
      console.log("📸 Media from metadata.imageUrl");
      mediaUrl = exercisePrompt.metadata.imageUrl;
    } else if (exercisePrompt.content?.imageUrl) {
      // Content with imageUrl
      console.log("📸 Media from content.imageUrl");
      mediaUrl = exercisePrompt.content.imageUrl as string;
    } else if (exercisePrompt.data?.imageUrl) {
      // Data with imageUrl
      console.log("📸 Media from data.imageUrl");
      mediaUrl = exercisePrompt.data.imageUrl;
    } else if (exercisePrompt.data?.image_url) {
      // Data with image_url
      console.log("📸 Media from data.image_url");
      mediaUrl = exercisePrompt.data.image_url;
    }
    
    // If no media URL found in the exercise prompt, check if we should use the lesson title image
    if (!mediaUrl && lessonContent?.content?.media_url) {
      console.log("📸 Using lesson title image as fallback");
      mediaUrl = lessonContent.content.media_url;
    }
    
    // If still no media URL and we want to retain the previous image, exit without changing
    if (!mediaUrl && currentMedia && currentMedia.url && currentMedia.url !== FALLBACK_IMAGE) {
      console.log("📸 No media URL found, but retaining previous image:", currentMedia.url);
      // Force the right panel to be visible if it's not already
      if (!showRightPanel) {
        console.log("Setting showRightPanel to true for retained image");
        setShowRightPanel(false);
      }
      return;
    }
    
    if (!mediaUrl) {
      console.log("❌ No media URL found in exercise prompt and no fallback available");
      return;
    }
    
    // Generate a unique identifier to ensure media updates
    const timestamp = new Date().getTime();
    
    // Add a timestamp parameter to force media refresh
    if (mediaUrl.includes('?')) {
      mediaUrl = `${mediaUrl}&_t=${timestamp}`;
    } else {
      mediaUrl = `${mediaUrl}?_t=${timestamp}`;
    }
    
    // Log the final URL we're using
    console.log("🖼️ Using media URL:", mediaUrl);
    
    // Determine media type
    if (typeof exercisePrompt.type === 'string' && ['image', 'video', 'gif'].includes(exercisePrompt.type)) {
      mediaType = exercisePrompt.type as 'image' | 'video' | 'gif';
    } else if (mediaUrl) {
      const detectedType = getMediaType(mediaUrl);
      if (detectedType === 'video' || detectedType === 'gif') {
        mediaType = detectedType as 'video' | 'gif';
      }
    }
    
    console.log("🖼️ Media type determined as:", mediaType);
    
    // Check if URL is from external domains that need special handling
    const isExternalDomain = mediaUrl.includes('gifsec.com') || mediaUrl.includes('gifdb.com');
    
    // DIRECTLY set the current media state
    setCurrentMedia({
      url: mediaUrl,
      type: mediaType,
      title: exercisePrompt.title || exercisePrompt.text || 'Exercise Media',
      sourceId: exercisePrompt.id || 'unknown',
      isExternalDomain,
      isPermanent: true // Mark as permanent so it won't be overridden
    });
    
    // Force the right panel to be visible
    if (!showRightPanel) {
      console.log("Setting showRightPanel to true");
      setShowRightPanel(false);
    }
    
    // Also dispatch the event as a fallback
    const mediaEvent = new CustomEvent('displayMediaInRightPanel', {
      detail: {
        mediaUrl: mediaUrl,
        mediaType: mediaType,
        mediaTitle: exercisePrompt.title || exercisePrompt.text || 'Exercise Media',
        sourceId: exercisePrompt.id || 'unknown',
        isExternalDomain,
        isPermanent: true
      }
    });
    
    // Dispatch the event to both document and window for compatibility
    document.dispatchEvent(mediaEvent);
    window.dispatchEvent(mediaEvent);
  }, [lessonContent, currentMedia, showRightPanel, getMediaType, FALLBACK_IMAGE]);

  // Improve the debug effect to better log exercise prompts
  useEffect(() => {
    // Only run this effect once on mount
    if (!currentMedia && lessonContent?.content) {
      console.log("🚨 FORCE DISPLAY MEDIA: Emergency debug function to force display media");
      
      // Log what content we have
      console.log("Content structure:", {
        hasQuestions: !!lessonContent.content.questions,
        questionsLength: lessonContent.content.questions?.length || 0,
        hasExercisePrompts: !!lessonContent.content.exercise_prompts,
        exercisePromptsLength: lessonContent.content.exercise_prompts?.length || 0,
        contentKeys: Object.keys(lessonContent.content || {})
      });
      
      // Log the actual exercise prompts if they exist
      if (lessonContent.content.exercise_prompts?.length > 0) {
        console.log("Exercise prompts array:", 
          lessonContent.content.exercise_prompts.map((prompt: { 
            id: string; 
            text?: string; 
            type?: string; 
            media?: any;
          }) => ({
            id: prompt.id,
            text: prompt.text?.substring(0, 30),
            type: prompt.type,
            hasMedia: !!prompt.media,
            mediaValue: prompt.media,
            mediaType: typeof prompt.media
          }))
        );
      }
      
      // Try to find ANY media and display it directly
      const findAndDisplayAnyMedia = () => {
        // Skip the permanent media check for now to avoid linter errors
        console.log("Looking for any media in the content");
        
        // Let's start with lesson title image
        if (lessonContent?.content?.media_url) {
          console.log("Found lesson title image:", lessonContent.content.media_url);
          setCurrentMedia({
            url: lessonContent.content.media_url,
            type: 'image',
            title: lessonContent.content.title || 'Lesson Image',
            sourceId: 'lesson-title'
          });
          return true;
        }
        
        // Try exercise_prompts first
        if (lessonContent.content.exercise_prompts?.length > 0) {
          for (const prompt of lessonContent.content.exercise_prompts) {
            console.log("Checking exercise prompt for media:", prompt.id, {
              media: prompt.media,
              type: prompt.type
            });
            
            if (prompt.media) {
              console.log("✅ FOUND MEDIA IN EXERCISE PROMPT:", prompt.id, prompt.media);
              displayMediaFromExercise(prompt);
              return true;
            }
          }
        }
        
        // Try questions next
        if (lessonContent.content.questions?.length > 0) {
          for (const question of lessonContent.content.questions) {
            console.log("Checking question for media:", question.id, {
              hasMetadata: !!question.metadata,
              hasImageUrl: !!question.metadata?.imageUrl,
              hasVideoUrl: !!question.metadata?.videoUrl,
              hasImageUrlInData: !!question.data?.image_url
            });
            
            // Check metadata
            if (question.metadata?.imageUrl) {
              console.log("✅ FOUND IMAGE URL IN QUESTION:", question.id);
              displayMediaFromExercise({
                id: question.id,
                text: question.title || 'Question',
                media: question.metadata.imageUrl,
                type: 'image'
              } as ExercisePrompt);
              return true;
            }
            
            if (question.metadata?.videoUrl) {
              console.log("✅ FOUND VIDEO URL IN QUESTION:", question.id);
              displayMediaFromExercise({
                id: question.id,
                text: question.title || 'Question',
                media: question.metadata.videoUrl,
                type: 'video'
              } as ExercisePrompt);
              return true;
            }
            
            // Check if question has media in image_url field
            if (question.data?.image_url) {
              console.log("✅ FOUND IMAGE URL IN QUESTION DATA:", question.id);
              displayMediaFromExercise({
                id: question.id,
                text: question.title || 'Question',
                media: question.data.image_url,
                type: 'image'
              } as ExercisePrompt);
              return true;
            }
          }
        }
        
        // As a last resort, create a placeholder media
        console.log("⚠️ NO MEDIA FOUND! Using placeholder image");
        setCurrentMedia({
          url: FALLBACK_IMAGE,
          type: 'image',
          title: 'Placeholder Image',
          sourceId: 'placeholder'
        });
        return true;
      };
      
      // Try to find and display any media
      findAndDisplayAnyMedia();
    }
  }, [lessonContent, currentMedia, displayMediaFromExercise, lessonContent.content?.exercise_prompts]);

  // Function for speech synthesis - DEFINE BEFORE playNextContentItem
  const speakWithFishSpeech = useCallback(async (text: string, elementId?: string) => {
    if (!text) {
      console.log('No text provided for speech');
      return; // Don't call playNextContentItem here to avoid circular dependency
    }

    try {
      console.log(`Speaking with Fish-Speech: "${text.substring(0, 30)}..."`);
      
      // Generate audio with Fish-Speech
      const audioBuffer = await speechService.textToSpeech(text);
      
      // Play the audio
      if (audioBuffer) {
        // Store the buffer for cleanup
        audioBufferRef.current = audioBuffer;
        
        // Play the audio
        const audioSource = await speechService.playAudio(audioBuffer);
        audioSourceRef.current = audioSource;
        
        // Set up event handlers
        if (elementId) {
          // Highlight the element being spoken
          setCurrentlyHighlightedId(elementId);
          
          // Scroll to the element
          const element = document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        
        // Add ended event handler
        audioSource.onended = () => {
          // Clear highlight
          setCurrentlyHighlightedId(null);
          audioSourceRef.current = null;
          
          // Move to the next content item
          setCurrentContentItem(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < contentQueue.length) {
              const item = contentQueue[nextIndex];
              
              // Display media if this is an exercise item
              if (item.type === 'exercise') {
                // Find the related exercise prompt
                const exercise = lessonContent.content?.exercise_prompts?.find(
                  (p: any) => p.id === item.sourceId
                );
                
                // Display its media if available
                if (exercise && exercise.media) {
                  displayMediaFromExercise(exercise);
                }
              }
              
              // Play the speech
              speakWithFishSpeech(item.text, item.id);
              return nextIndex;
            }
            return prevIndex;
          });
        };
      } else {
        console.error('No audio buffer generated');
      }
    } catch (error) {
      console.error('Error in Fish-Speech playback:', error);
      // Fall back to browser's Speech Synthesis
      try {
        console.log('Falling back to browser Speech Synthesis');
        setUseBrowserTTS(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onstart = () => {
          if (elementId) {
            setCurrentlyHighlightedId(elementId);
          }
        };
        
        utterance.onend = () => {
          setCurrentlyHighlightedId(null);
          // Move to the next content item
          setCurrentContentItem(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < contentQueue.length) {
              const item = contentQueue[nextIndex];
              speakWithFishSpeech(item.text, item.id);
              return nextIndex;
            }
            return prevIndex;
          });
        };
        
        utterance.onerror = () => {
          setCurrentlyHighlightedId(null);
          console.error('Speech synthesis error');
        };
        
        // Get a voice if possible
        const voice = getBestVoice();
        if (voice) utterance.voice = voice;
        
        // Speak the text
        window.speechSynthesis.speak(utterance);
      } catch (fallbackError) {
        console.error('Fallback speech synthesis failed:', fallbackError);
      }
    }
  }, [contentQueue]);
  
  // Now define playNextContentItem - with function call ONLY to dependencies already defined
  const playNextContentItem = useCallback(() => {
    setCurrentContentItem(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < contentQueue.length) {
        const item = contentQueue[nextIndex];
        
        // Display media if this is an exercise item
        if (item.type === 'exercise') {
          // Find the related exercise prompt
          const exercise = lessonContent.content?.exercise_prompts?.find(
            (p: any) => p.id === item.sourceId
          );
          
          // Display its media if available
          if (exercise && exercise.media) {
            displayMediaFromExercise(exercise);
          }
        }
        
        // Play the speech
        speakWithFishSpeech(item.text, item.id);
        return nextIndex;
      }
      return prevIndex;
    });
  }, [contentQueue, lessonContent.content?.exercise_prompts, speakWithFishSpeech, displayMediaFromExercise]);

  // Function to toggle audio playback
  const togglePlayback = useCallback(() => {
    if (isPlaying) {
      // Stop playback
      setIsPlaying(false);
      
      // Stop any ongoing speech
      if (audioSourceRef.current) {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      }
      
      // Stop HTML audio element if it's playing
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      
      // Clear highlight
      setCurrentlyHighlightedId(null);
      
      // Cancel browser speech synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      logger.info('Audio playback stopped', {
        source: 'LessonDialog',
        context: { isPlaying: false }
      });
    } else {
      // Build content queue - make it more focused on the current question
      const newContentQueue: ContentItem[] = [];
      
      // If we have a selected question, prioritize its content
      if (selectedQuestionIndex !== null && 
          lessonContent.content?.questions && 
          lessonContent.content.questions[selectedQuestionIndex]) {
        
        const selectedQuestion = lessonContent.content.questions[selectedQuestionIndex];
        console.log("Building content queue for selected question:", selectedQuestion.id);
        
        // Add question title
        if (selectedQuestion.title) {
          newContentQueue.push({
            id: `question-title-${selectedQuestion.id}`,
            text: selectedQuestion.title,
            type: 'title',
            sourceId: selectedQuestion.id,
            url: selectedQuestion.metadata?.imageUrl
          });
        }
        
        // Add question prompt from data
        if (selectedQuestion.data?.prompt) {
          newContentQueue.push({
            id: `question-prompt-${selectedQuestion.id}`,
            text: selectedQuestion.data.prompt,
            type: 'prompt',
            sourceId: selectedQuestion.id,
            url: selectedQuestion.metadata?.imageUrl
          });
        }
        
        // Add teacher script if available
        if (selectedQuestion.data?.teacher_script) {
          newContentQueue.push({
            id: `question-script-${selectedQuestion.id}`,
            text: selectedQuestion.data.teacher_script,
            type: 'script',
            sourceId: selectedQuestion.id,
            url: selectedQuestion.metadata?.imageUrl
          });
        }
        
        // We'll call displayMediaFromQuestion after its declared later in the code
        
        // Add exercise prompts from the question
        if (selectedQuestion.exercise_prompts && selectedQuestion.exercise_prompts.length > 0) {
          console.log("Adding question's exercise prompts to queue:", selectedQuestion.exercise_prompts.length);
          
          selectedQuestion.exercise_prompts.forEach((prompt: any, index: number) => {
            console.log("Adding question exercise prompt:", prompt.id, prompt.text?.substring(0, 30));
            
            // Add the prompt text
            if (prompt.text) {
              newContentQueue.push({
                id: `exercise-prompt-${index}-${prompt.id}`,
                text: prompt.text,
                type: 'exercise',
                sourceId: prompt.id,
                url: prompt.metadata?.imageUrl
              });
            }
            
            // If it has instructions, add those too
            if (prompt.content?.instructions) {
              newContentQueue.push({
                id: `exercise-instructions-${index}-${prompt.id}`,
                text: prompt.content.instructions,
                type: 'instruction',
                sourceId: prompt.id,
                url: prompt.metadata?.imageUrl
              });
            }
            
            // Add other content types if available
            if (prompt.content?.writingPrompt) {
              newContentQueue.push({
                id: `exercise-writing-${index}-${prompt.id}`,
                text: prompt.content.writingPrompt,
                type: 'writing',
                sourceId: prompt.id,
                url: prompt.metadata?.imageUrl
              });
            }
            
            if (prompt.content?.speakingPrompt) {
              newContentQueue.push({
                id: `exercise-speaking-${index}-${prompt.id}`,
                text: prompt.content.speakingPrompt,
                type: 'speaking',
                sourceId: prompt.id,
                url: prompt.metadata?.imageUrl
              });
            }
            
            // If there's naration, prioritize that for TTS
            if (prompt.narration) {
              
              newContentQueue.push({
                id: `exercise-narration-${index}-${prompt.id}`,
                text: prompt.narration,
                type: 'narration',
                sourceId: prompt.id,
                url: prompt.metadata?.imageUrl
              });
            // Add a prompt for user to repeat after narration
              newContentQueue.push({
                id: `exercise-user-prompt-${index}-${prompt.id}`,
                text: "Now your turn, Say:",
                type: 'user-prompt',
                sourceId: prompt.id,
                url: prompt.metadata?.imageUrl
              });// Otherwise use sayText if available
            } else if (prompt.saytext) {
              newContentQueue.push({
                id: `exercise-saytext-${index}-${prompt.id}`,
                text: prompt.saytext,
                type: 'saytext',
                sourceId: prompt.id,
                url: prompt.metadata?.imageUrl
              });
            }
          });
        }
      } else {
        // No question selected, fall back to lesson content
        // Add title
        if (lessonContent.content?.title) {
          newContentQueue.push({
            id: 'lesson-title',
            text: lessonContent.content.title,
            type: 'title',
            sourceId: lessonContent.content.id || 'lesson',
            url: lessonContent.content.metadata?.imageUrl
          });
        }
        
        // Add description
        if (lessonContent.content?.description) {
          newContentQueue.push({
            id: 'lesson-description',
            text: lessonContent.content.description,
            type: 'description',
            sourceId: lessonContent.content.id || 'lesson',
            url: lessonContent.content.metadata?.imageUrl
          });
        }
        
        // Add narration
        if (lessonContent.content?.narration) {
          newContentQueue.push({
            id: 'lesson-narration',
            text: lessonContent.content.narration,
            type: 'narration',
            sourceId: lessonContent.content.id || 'lesson',
            url: lessonContent.content.metadata?.imageUrl
          });
        }
        
        // Add general exercise prompts
        if (lessonContent.content?.exercise_prompts && lessonContent.content.exercise_prompts.length > 0) {
          console.log("Adding general exercise prompts to queue:", lessonContent.content.exercise_prompts.length);
          
          lessonContent.content.exercise_prompts.forEach((prompt: any, index: number) => {
            // Add the prompt text
            if (prompt.text) {
              newContentQueue.push({
                id: `exercise-prompt-${index}-${prompt.id}`,
                text: prompt.text,
                type: 'exercise',
                sourceId: prompt.id,
                url: prompt.metadata?.imageUrl
              });
            }
            
            // Add other content if available
            if (prompt.saytext) {
              newContentQueue.push({
                id: `exercise-saytext-${index}-${prompt.id}`,
                text: prompt.saytext,
                type: 'saytext',
                sourceId: prompt.id,
                url: prompt.metadata?.imageUrl
              });
            } else if (prompt.narration) {
              newContentQueue.push({
                id: `exercise-narration-${index}-${prompt.id}`,
                text: prompt.narration,
                type: 'narration',
                sourceId: prompt.id,
                url: prompt.metadata?.imageUrl
              });
            }
          });
        }
      }
      
      // Set the content queue
      setContentQueue(newContentQueue);
      console.log("Content queue built with", newContentQueue.length, "items");
      
      // Start with first item if available
      if (newContentQueue.length > 0) {
        const firstItem = newContentQueue[0];
        
        // Display media for the first item based on its type
        if (firstItem.type === 'exercise' || firstItem.type === 'narration' || firstItem.type === 'saytext') {
          // Find the related exercise prompt
          const exercise = lessonContent.content?.exercise_prompts?.find(
            (p: any) => p.id === firstItem.sourceId
          );
          
          if (exercise?.media) {
            // Display the media for this exercise
            displayMediaFromExercise(exercise);
          }
        } else if (firstItem.sourceId && firstItem.type.includes('question') && lessonContent.content?.questions) {
          // If it's a question item, find the question and display its media
          const question = lessonContent.content.questions.find(
            (q: any) => q.id === firstItem.sourceId
          );
          
          if (question && question.metadata?.imageUrl) {
            // Use the displayMediaFromExercise function with a constructed exercise prompt
            displayMediaFromExercise({
              id: question.id,
              text: question.title || 'Question',
              media: question.metadata.imageUrl,
              type: 'image'
            } as ExercisePrompt);
          } else if (question && question.data?.image_url) {
            displayMediaFromExercise({
              id: question.id,
              text: question.title || 'Question',
              media: question.data.image_url,
              type: 'image'
            } as ExercisePrompt);
          }
        }
        
        // Play the first item
        speakWithFishSpeech(firstItem.text, firstItem.id);
        setCurrentContentItem(0);
        setCurrentlyHighlightedId(firstItem.id); // Highlight the first item
        setIsPlaying(true);
      } else {
        logger.warn('No content to play', {
          source: 'LessonDialog',
          context: { contentQueueLength: 0 }
        });
      }
    }
  }, [
    isPlaying, 
    selectedQuestionIndex, 
    lessonContent.content, 
    speakWithFishSpeech, 
    displayMediaFromExercise,
    useBrowserTTS
  ]);

  // Function to toggle mute
  const toggleMute = useCallback(() => {
    try {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      
      if (newMutedState) {
        // Muting the audio
        logger.info('Muting audio', {
          source: 'LessonDialog',
          context: { 
            isMuted: true, 
            lessonId: lessonContent?.content?.id || 'unknown'
          }
        });
        
        // Store whether we were playing before muting
        setWasPlayingBeforeMute(isPlaying);
        
        // If we're playing, pause the audio but don't stop it
        if (isPlaying) {
          // Pause HTML audio element
          if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
          }
          
          // Stop speech synthesis
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
          }
          
          // Pause Fish-Speech audio
          if (audioSourceRef.current) {
            audioSourceRef.current.stop();
            audioSourceRef.current = null;
          }
          
          // Update playing state
          setIsPlaying(false);
        }
      } else {
        // Unmuting the audio
        logger.info('Unmuting audio', {
          source: 'LessonDialog',
          context: { 
            isMuted: false, 
            lessonId: lessonContent?.content?.id || 'unknown'
          }
        });
        
        // If we were playing before muting, resume playback
        if (wasPlayingBeforeMute) {
          // Resume from the current content item in the queue
          if (contentQueue.length > 0 && currentContentItem >= 0 && currentContentItem < contentQueue.length) {
            const item = contentQueue[currentContentItem];
            
            // Start playing the current item
            speakWithFishSpeech(item.text, item.id);
            
            // Update playing state
            setIsPlaying(true);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling mute state:', error);
    }
  }, [
    isPlaying,
    isMuted,
    wasPlayingBeforeMute,
    contentQueue,
    currentContentItem,
    speakWithFishSpeech,
    lessonContent
  ]);

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
        //   setPlaying(false);ata?.audioUrl) || []).filter(Boolean)
      ];
      setContentQueue(queue);
    }
  }, [lessonContent.content]);

  // Function to handle question selection
  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);
    
    // Get the selected question
    const selectedQuestion = lessonContent.content?.questions?.[index];
    if (selectedQuestion) {
      console.log("Selected question:", selectedQuestion.id, selectedQuestion);
      
      // Log selected question data
      logger.info('Question selected in lesson dialog', {
        source: 'LessonDialog',
        context: { 
          questionId: selectedQuestion.id,
          questionIndex: index,
          questionType: selectedQuestion.type,
          lessonId: currentLessonId
        }
      });
      
      // Expand question details and set as current highlight
      setCurrentlyHighlightedId(selectedQuestion.id);
      
      // Attempt to display media
      displayMediaFromQuestion(selectedQuestion);
    }
  };

  // Fix the displayMediaFromQuestion function for better stability
  const displayMediaFromQuestion = useCallback((question: Question) => {
    if (!question || !question.id) {
      console.warn("Invalid question data provided to displayMediaFromQuestion");
      return;
    }
    
    // IMPORTANT: Don't override manually selected media
    if (currentMedia?.isPermanent) {
      console.log("Not overriding permanent media from exercise prompt");
      return;
    }
    
    console.log("Displaying media for question:", question.id);
    console.log("Current showRightPanel state:", showRightPanel);
    
    // Early return if this is the same media source we're already displaying
    if (currentMedia && currentMedia.sourceId === question.id) {
      console.log("Already displaying media for this question, skipping update");
      return;
    }
    
    // Try to find media in the question itself first
    if (question.metadata?.imageUrl) {
      console.log("Question has direct image URL:", question.metadata.imageUrl);
      
      // Check if URL is from external domains that need special handling
      const url = question.metadata.imageUrl;
      const isExternalDomain = url.includes('gifsec.com') || url.includes('gifdb.com');
      
      setCurrentMedia({
        url: question.metadata.imageUrl,
        type: 'image',
        title: question.title || 'Question Image',
        sourceId: question.id,
        isExternalDomain // Add flag for external domains
      });
      
      // Force the right panel to be visible
      if (!showRightPanel) {
        console.log("Setting showRightPanel to true");
        setShowRightPanel(true);
      }
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('media-displayed', { 
        detail: { 
          url: question.metadata.imageUrl,
          type: 'image',
          sourceId: question.id,
          isExternalDomain
        } 
      }));
      return;
    }
    
    if (question.metadata?.videoUrl) {
      console.log("Question has direct video URL:", question.metadata.videoUrl);
      
      // Check if URL is from external domains that need special handling
      const url = question.metadata.videoUrl;
      const isExternalDomain = url.includes('gifsec.com') || url.includes('gifdb.com');
      
      setCurrentMedia({
        url: question.metadata.videoUrl,
        type: 'video',
        title: question.title || 'Question Video',
        sourceId: question.id,
        isExternalDomain // Add flag for external domains
      });
      
      // Force the right panel to be visible
      if (!showRightPanel) {
        console.log("Setting showRightPanel to true");
        setShowRightPanel(true);
      }
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('media-displayed', { 
        detail: { 
          url: question.metadata.videoUrl,
          type: 'video',
          sourceId: question.id,
          isExternalDomain
        } 
      }));
      return;
    }
    
    // Check for exercise prompts with media
    if (question.exercise_prompts?.length > 0) {
      console.log("Question has exercise prompts, checking for media...");
      for (const prompt of question.exercise_prompts) {
        if (prompt.media) {
          const mediaUrl = prompt.media;
          console.log("Found media in exercise prompt:", mediaUrl, prompt.id);
          if (mediaUrl) {
            // Check if URL is from external domains that need special handling
            const isExternalDomain = mediaUrl.includes('gifsec.com') || mediaUrl.includes('gifdb.com');
            
            setCurrentMedia({
              url: mediaUrl,
              type: prompt.type === 'video' ? 'video' : 'image',
              title: prompt.text || 'Exercise Media',
              sourceId: question.id, // Use question.id not prompt.id to prevent re-renders
              isExternalDomain // Add flag for external domains
            });
            
            // Force the right panel to be visible
            if (!showRightPanel) {
              console.log("Setting showRightPanel to true");
              setShowRightPanel(true);
            }
            
            // Dispatch a custom event to notify other components
            window.dispatchEvent(new CustomEvent('media-displayed', { 
              detail: { 
                url: mediaUrl,
                type: prompt.type === 'video' ? 'video' : 'image',
                sourceId: question.id,
                isExternalDomain
              } 
            }));
            return;
          }
        }
      }
      console.log("No media found in exercise prompts");
    }
    
    // Check if the lesson has a title image to use as fallback
    if (lessonContent?.content?.media_url) {
      console.log("Using lesson title image as fallback:", lessonContent.content.media_url);
      const mediaUrl = lessonContent.content.media_url;
      const isExternalDomain = mediaUrl.includes('gifsec.com') || mediaUrl.includes('gifdb.com');
      
      setCurrentMedia({
        url: mediaUrl,
        type: 'image',
        title: lessonContent.content.title || 'Lesson Image',
        sourceId: question.id, // Use question.id to associate with current question
        isExternalDomain
      });
      
      // Force the right panel to be visible
      if (!showRightPanel) {
        console.log("Setting showRightPanel to true for lesson title image");
        setShowRightPanel(true);
      }
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('media-displayed', { 
        detail: { 
          url: mediaUrl,
          type: 'image',
          sourceId: question.id,
          isExternalDomain
        } 
      }));
      return;
    }
    
    // If no media is found, use a fallback image if we're not already showing it
    if (!currentMedia || (currentMedia.sourceId !== 'fallback' && currentMedia.sourceId !== question.id)) {
      console.log("No media found, using fallback");
      setCurrentMedia({
        url: FALLBACK_IMAGE,
        type: 'image',
        title: 'No Media Available',
        sourceId: 'fallback',
        isExternalDomain: false // Fallback is always internal
      });
      
      // Force the right panel to be visible
      if (!showRightPanel) {
        console.log("Setting showRightPanel to true for fallback image");
        setShowRightPanel(true);
      }
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('media-displayed', { 
        detail: { 
          url: FALLBACK_IMAGE,
          type: 'image',
          sourceId: 'fallback',
          isExternalDomain: false
        } 
      }));
    }
  }, [currentMedia, setCurrentMedia, showRightPanel, setShowRightPanel, lessonContent]);

  // Move this useEffect block earlier in the code to ensure it's not called conditionally
  // Place it before any conditional return statements, ideally right after other useEffect declarations
  useEffect(() => {
    // This effect runs when togglePlayback changes the state
    // It handles initializing the selected question's media if needed
    if (selectedQuestionIndex !== null && 
        lessonContent.content?.questions?.[selectedQuestionIndex] &&
        isPlaying) {
      const selectedQuestion = lessonContent.content.questions[selectedQuestionIndex];
      displayMediaFromQuestion(selectedQuestion);
    }
  }, [isPlaying, selectedQuestionIndex, lessonContent.content?.questions, displayMediaFromQuestion]);

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
      
      // Check if we're in mobile mode (width < 768px)
      const isMobileView = window.innerWidth < 768;
      
      if (isMobileView) {
        // Calculate vertical position for mobile view
        const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;
        const clampedHeight = Math.min(Math.max(newHeight, 30), 70);
        
        setLeftPanelWidth(100 - clampedHeight); // Invert for mobile view
      } else {
        // Standard horizontal resize for desktop
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        const clampedWidth = Math.min(Math.max(newWidth, 30), 70);
        
        setLeftPanelWidth(clampedWidth);
      }
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

  // Add a useEffect to check for saved media on component initialization
  useEffect(() => {
    try {
      // Check if we have saved media in localStorage
      const savedMedia = localStorage.getItem('lastSelectedMedia');
      if (savedMedia) {
        const parsedMedia = JSON.parse(savedMedia);
        console.log("Found saved media:", parsedMedia);
        setCurrentMedia({
          url: parsedMedia.mediaUrl || parsedMedia.url,
          type: parsedMedia.mediaType || parsedMedia.type || 'image',
          title: parsedMedia.mediaTitle || parsedMedia.title || 'Media',
          sourceId: parsedMedia.sourceId || 'unknown',
          isExternalDomain: parsedMedia.isExternalDomain || false,
          isPermanent: true
        });
        setShowRightPanel(true);
      }
    } catch (e) {
      console.warn("Error loading saved media:", e);
    }
  }, []);
  
  // Existing handler for the custom event to display media in the right panel
  const handleMediaDisplayEvent = useCallback((event: CustomEvent) => {
    if (event.detail) {
      console.log("Media display event received:", event.detail);
      const mediaData = event.detail;
      
      // Always update the media, even if the sourceId is the same
      // This ensures different prompts with the same sourceId still update the image
      const newMedia = {
        url: mediaData.mediaUrl || mediaData.url,
        type: mediaData.mediaType || mediaData.type || getMediaType(mediaData.mediaUrl || mediaData.url) || 'image',
        title: mediaData.mediaTitle || mediaData.title || 'Media',
        sourceId: mediaData.sourceId || 'unknown',
        isExternalDomain: mediaData.isExternalDomain || false,
        isPermanent: mediaData.isPermanent || false // Track if this was manually selected
      };
      
      // Set the media state
      setCurrentMedia(newMedia);
      
      // If this is permanent media, store it in localStorage as well
      if (mediaData.isPermanent) {
        try {
          console.log("Storing permanent media in localStorage");
          localStorage.setItem('lastSelectedMedia', JSON.stringify(mediaData));
          
          // Store a global variable that we can check from anywhere
          // This is a desperate measure to ensure media persists
          window.__PERMANENT_MEDIA__ = newMedia;
        } catch (e) {
          console.warn("Failed to store media in localStorage:", e);
        }
      }
      
      // Force the right panel to be visible
      if (!showRightPanel) {
        console.log("Setting showRightPanel to true");
        setShowRightPanel(true);
      }
    }
  }, [showRightPanel, setCurrentMedia, setShowRightPanel, getMediaType]);
  
  // Handler for fallback media requests when a prompt doesn't have media
  const handleFallbackMediaRequest = useCallback((event: CustomEvent) => {
    if (!event.detail) return;
    
    console.log("Fallback media request received:", event.detail);
    const { sourceId, promptTitle, timestamp } = event.detail;
    
    // Step 1: Try to use lesson default media if available
    if (lessonContent?.content?.media_url) {
      console.log("Using lesson default media as fallback:", lessonContent.content.media_url);
      const mediaUrl = lessonContent.content.media_url;
      const isExternalDomain = mediaUrl.includes('gifsec.com') || mediaUrl.includes('gifdb.com');
      
      // Add a timestamp parameter to force media refresh
      const mediaUrlWithTimestamp = mediaUrl.includes('?') 
        ? `${mediaUrl}&_t=${timestamp}` 
        : `${mediaUrl}?_t=${timestamp}`;
      
      const newMedia = {
        url: mediaUrlWithTimestamp,
        type: 'image',
        title: lessonContent.content.title || 'Lesson Image',
        sourceId: sourceId,
        isExternalDomain,
        isPermanent: false // This is not user-selected
      };
      
      // Set the current media state
      setCurrentMedia(newMedia);
      
      // Force the right panel to be visible
      if (!showRightPanel) {
        console.log("Setting showRightPanel to true for lesson default image");
        setShowRightPanel(true);
      }
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('media-displayed', { 
        detail: { 
          url: mediaUrlWithTimestamp,
          type: 'image',
          sourceId: sourceId,
          isExternalDomain
        } 
      }));
      return;
    }
    
    // Step 2: If no lesson media is available, display a "No media available" message
    console.log("No fallback media available, showing placeholder");
    const newMedia = {
      url: FALLBACK_IMAGE,
      type: 'image',
      title: 'No Media Available',
      sourceId: 'fallback',
      isExternalDomain: false // Fallback is always internal
    };
    
    // Set the current media state
    setCurrentMedia(newMedia);
    
    // Force the right panel to be visible
    if (!showRightPanel) {
      console.log("Setting showRightPanel to true for no media available message");
      setShowRightPanel(true);
    }
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('media-displayed', { 
      detail: { 
        url: FALLBACK_IMAGE,
        type: 'image',
        sourceId: 'fallback',
        isExternalDomain: false
      } 
    }));
  }, [lessonContent, showRightPanel, FALLBACK_IMAGE]);
  
  // Set up event listeners for media display events
  useEffect(() => {
    // Listen for media display events
    document.addEventListener('displayMediaInRightPanel', handleMediaDisplayEvent as any);
    
    // Listen for fallback media requests
    document.addEventListener('requestFallbackMedia', handleFallbackMediaRequest as any);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('displayMediaInRightPanel', handleMediaDisplayEvent as any);
      document.removeEventListener('requestFallbackMedia', handleFallbackMediaRequest as any);
    };
  }, [handleMediaDisplayEvent, handleFallbackMediaRequest]);

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progress = (currentTime / duration) * 100;
      
      setAudioDuration(duration);
      setCurrentAudioTime(progress);
      
      // Calculate which word to highlight based on time
      if (contentQueue[currentContentItem]) {
        const text = contentQueue[currentContentItem].text;
        const words = text.split(' ');
        
        // Simple approach: distribute words evenly across the duration
        // In a real app, you might have timestamp data for each word
        const wordsPerSecond = words.length / duration;
        const currentWordIndex = Math.floor(currentTime * wordsPerSecond);
        
        // Only update if the highlighted word has changed
        if (currentWordIndex !== highlightedWordIndex && currentWordIndex < words.length) {
          setHighlightedWordIndex(currentWordIndex);
        }
      }
      
      logger.info('Audio progress updated', {
        source: 'LessonDialog',
        context: { 
          progress: Math.round(progress),
          currentAudioIndex: 0,
          totalAudios: contentQueue.length,
          lessonId: currentLessonId
        }
      });
    }
  };

  const handleAudioEnded = () => {
    if (currentAudioTime < audioDuration - 1) {
      // Play next audio in queue
      setCurrentAudioTime(prev => prev + 1);
      setIsPlaying(true);
      const nextAudioIndex = currentAudioTime + 1;
      if (audioRef.current && nextAudioIndex < contentQueue.length) {
        // Use optional chaining and provide a fallback empty string if url is undefined
        audioRef.current.src = contentQueue[nextAudioIndex].url || '';
        audioRef.current.play();
      }
    } else {
      // All audio completed
      setIsPlaying(false);
      setCurrentAudioTime(0);
      
      toast({
        title: " Lesson Complete!",
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

  // Add CSS for highlighted content
  const highlightStyle = `
    .highlight-active-content {
      background-color: rgba(var(--primary-rgb), 0.1);
      border-left: 3px solid hsl(var(--primary));
      box-shadow: 0 0 8px rgba(var(--primary-rgb), 0.2);
      transition: all 0.3s ease;
    }
  `;

  // Tailwind doesn't handle dynamic widths directly, so we use CSS variables
  const panelStyles = `
    :root {
      --left-panel-width: ${leftPanelWidth}%;
      --right-panel-width: ${100 - leftPanelWidth}%;
    }
    .left-panel-width {
      width: var(--left-panel-width);
    }
    .right-panel-width {
      width: var(--right-panel-width);
    }
    
    /* Media query for mobile devices */
    @media (max-width: 768px) {
      .mobile-layout {
        flex-direction: column !important;
      }
      .left-panel-width, .right-panel-width {
        width: 100% !important;
      }
      .mobile-top-panel {
        height: var(--right-panel-width) !important;
        min-height: 200px;
        max-height: 50vh;
        border-bottom: 1px solid var(--border);
        padding-bottom: 0.5rem;
      }
      .mobile-bottom-panel {
        height: var(--left-panel-width) !important;
        overflow-y: auto;
      }
      .mobile-resize-handle {
        width: 100% !important;
        height: 10px !important;
        cursor: row-resize !important;
      }
      .mobile-media-container {
        max-height: calc(50vh - 80px);
        margin: 0 auto;
        width: 100% !important;
      }
      .mobile-media-controls {
        position: absolute;
        bottom: 8px;
        right: 8px;
        display: flex;
        z-index: 20;
      }
    }
  `;

  // Update the debugExercisePrompts function to more aggressively find and display media
  const debugExercisePrompts = () => {
    console.log("🔍 DEBUG ALL EXERCISE PROMPTS AND QUESTIONS");
    
    // Log complete structure of lesson content to debug
    console.log("FULL LESSON CONTENT:", lessonContent);
    
    // Add a more robust exercise prompt search function
    const findAndDisplayAnyMedia = () => {
      // HARDCODED MEDIA CHECK: Directly try to see if there's an exercise_prompts array
      if (lessonContent?.content?.exercise_prompts) {
        console.log("Direct exercise_prompts found:", lessonContent.content.exercise_prompts);
        
        for (const prompt of lessonContent.content.exercise_prompts) {
          console.log("Checking prompt:", prompt);
          
          // Check all possible media paths
          if (prompt.media) {
            // Set direct media display without any helper function
            console.log("FOUND MEDIA:", prompt.media);
            
            const mediaUrl = typeof prompt.media === 'string' 
              ? prompt.media 
              : typeof prompt.media === 'object' && 'url' in prompt.media 
                ? (prompt.media as any).url 
                : null;
            
            if (mediaUrl) {
              // Direct media display
              console.log("DIRECTLY SETTING MEDIA URL:", mediaUrl);
              setCurrentMedia({
                url: mediaUrl,
                type: 'image',
                title: prompt.text || 'Exercise Media',
                sourceId: prompt.id || 'unknown'
              });
              return true;
            }
          }
        }
      }
      
      // Check question exercise prompts
      if (lessonContent?.content?.questions) {
        console.log("Questions found:", lessonContent.content.questions.length);
        
        for (const question of lessonContent.content.questions) {
          // Check question metadata first
          if (question.metadata?.imageUrl) {
            console.log("FOUND QUESTION IMAGE URL:", question.metadata.imageUrl);
            setCurrentMedia({
              url: question.metadata.imageUrl,
              type: 'image',
              title: question.title || 'Question Image',
              sourceId: question.id
            });
            return true;
          }
          
          // Then check question exercise prompts
          if (question.exercise_prompts && question.exercise_prompts.length > 0) {
            console.log("Question has exercise prompts:", question.exercise_prompts);
            
            for (const prompt of question.exercise_prompts) {
              if (prompt.media) {
                const mediaUrl = typeof prompt.media === 'string' 
                  ? prompt.media 
                  : typeof prompt.media === 'object' && 'url' in prompt.media 
                    ? (prompt.media as any).url 
                    : null;
                
                if (mediaUrl) {
                  console.log("FOUND MEDIA IN QUESTION EXERCISE PROMPT:", mediaUrl);
                  setCurrentMedia({
                    url: mediaUrl,
                    type: 'image',
                    title: prompt.text || 'Exercise Media',
                    sourceId: prompt.id
                  });
                  return true;
                }
              }
            }
          }
        }
      }
      
      console.log("NO MEDIA FOUND IN EXPECTED LOCATIONS - USING FALLBACK");
      
      // Use a data URL as the fallback image (won't fail to load)
      setCurrentMedia({
        url: FALLBACK_IMAGE,
        type: 'image',
        title: 'No Media Available',
        sourceId: 'fallback'
      });
      
      return false;
    };
    
    findAndDisplayAnyMedia();
  };

  // Add a useEffect to display media when the component mounts
  useEffect(() => {
    // Only run this if we don't have media, the content is loaded, and no permanent media has been selected
    const hasPermanentMedia = currentMedia?.isPermanent || processedMediaRef.current.lastPermanentMedia;
    
    if (!currentMedia && lessonContent?.content && !lessonContent.isLoading && !hasPermanentMedia) {
      console.log("Component mounted - looking for media to display");
      // Use a small delay to ensure everything is initialized
      const timer = setTimeout(() => {
        debugExercisePrompts();
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
    // If we have permanent media in the ref but not in the state, restore it
    if (!currentMedia && processedMediaRef.current.lastPermanentMedia) {
      console.log("Restoring permanently selected media");
      setCurrentMedia(processedMediaRef.current.lastPermanentMedia as CurrentMedia);
    }
  }, [lessonContent?.content, currentMedia, lessonContent.isLoading]);

  // Modify the useEffect for tab changes to check for existing media
  useEffect(() => {
    // Only log real tab changes
    if (activeTab !== processedMediaRef.current.tabId) {
      console.log("Tab changed to:", activeTab);
      processedMediaRef.current.tabId = activeTab;
    }
    
    // Skip if we're not on the questions tab or if there's no content
    if (activeTab !== "questions" || !lessonContent?.content?.questions?.length) {
      return;
    }
    
    // Don't override permanent media
    if (currentMedia?.isPermanent) {
      console.log("Not changing media on tab change because permanent media is selected");
      return;
    }
    
    // Only process selected question if we're on the questions tab
    if (selectedQuestionIndex !== null) {
      const selectedQuestion = lessonContent.content.questions[selectedQuestionIndex];
      
      // Skip if we're already displaying media for this question
      if (currentMedia && currentMedia.sourceId === selectedQuestion.id) {
        console.log("Already displaying media for question:", selectedQuestion.id);
        return;
      }
      
      console.log("Displaying media for selected question:", selectedQuestion.id);
      displayMediaFromQuestion(selectedQuestion);
      setShowRightPanel(true);
    }
  }, [activeTab, selectedQuestionIndex, showRightPanel, displayMediaFromQuestion, currentMedia, lessonContent?.content?.questions, setShowRightPanel]);

  // Add an effect to ensure the right panel is properly displayed when the component mounts
  useEffect(() => {
    // If we have current media but the right panel is not showing, make it visible
    if (currentMedia && !showRightPanel) {
      console.log("Component mounted with media but right panel hidden, making it visible");
      setShowRightPanel(true);
    }
  }, [currentMedia, showRightPanel]);

  // Add a more aggressive polling mechanism to ensure permanent media stays displayed
  useEffect(() => {
    // Only run if we have localStorage media but it's not currently displayed
    let interval: NodeJS.Timeout;
    
    try {
      const savedMedia = localStorage.getItem('lastSelectedMedia');
      if (savedMedia) {
        const mediaData = JSON.parse(savedMedia);
        
        // Check if we should restore media
        const shouldRestoreMedia = 
          !currentMedia || // No current media 
          (mediaData.isPermanent && !currentMedia.isPermanent); // Or current media is not permanent but saved one is
        
        if (shouldRestoreMedia) {
          console.log("Setting up media persistence check interval");
          
          // Set up an interval to continuously check and restore media
          interval = setInterval(() => {
            try {
              const storedMedia = localStorage.getItem('lastSelectedMedia');
              if (storedMedia) {
                const parsedMedia = JSON.parse(storedMedia);
                
                // Only restore if current media is not permanent or doesn't match
                if (!currentMedia?.isPermanent) {
                  console.log("Forcing restoration of permanent media");
                  const restoredMedia = {
                    url: parsedMedia.mediaUrl || parsedMedia.url,
                    type: parsedMedia.mediaType || parsedMedia.type || 'image',
                    title: parsedMedia.mediaTitle || parsedMedia.title || 'Media',
                    sourceId: parsedMedia.sourceId || 'unknown',
                    isExternalDomain: parsedMedia.isExternalDomain || false,
                    isPermanent: true
                  };
                  
                  setCurrentMedia(restoredMedia);
                  setShowRightPanel(true);
                }
              }
            } catch (e) {
              console.warn("Error in media persistence interval:", e);
            }
          }, 500); // Check every 500ms
        }
      }
    } catch (e) {
      console.warn("Error initializing media persistence:", e);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentMedia]);

  // In the useEffect for the displayMediaEvent listener
  useEffect(() => {
    const eventListener = (event: CustomEvent<MediaData>) => {
      console.log('Media display event received:', event.detail);
      
      // Skip if this is a duplicate event with the same URL
      if (currentMedia?.mediaUrl === event.detail.mediaUrl) {
        console.log('Duplicate media event detected, skipping', event.detail.mediaUrl);
        return;
      }
      
      const mediaData: MediaData = event.detail;
      
      // Add isPermanent flag if the source is an exercise prompt
      if (mediaData.sourceType === 'exercise_prompt') {
        mediaData.isPermanent = true;
        console.log('Storing permanent media in localStorage');
        
        // Store only one permanent media per sourceId to avoid duplication
        if (mediaData.sourceId) {
          const permanentMediaKey = `permanent_media_${mediaData.sourceId}`;
          const existingJson = localStorage.getItem(permanentMediaKey);
          
          if (!existingJson) {
            localStorage.setItem(permanentMediaKey, JSON.stringify(mediaData));
          }
        }
      }
      
      // Convert MediaData to CurrentMedia with required properties
      setCurrentMedia({
        sourceId: mediaData.sourceId,
        type: mediaData.type || 'image', // Ensure type is never undefined
        url: mediaData.url || mediaData.mediaUrl || '', // Use url or mediaUrl with fallback
        title: mediaData.title || 'Media', // Provide default title
        mediaUrl: mediaData.mediaUrl,
        isExternalDomain: mediaData.isExternalDomain,
        isPermanent: mediaData.isPermanent
      });
    };
    
    // Helper function to convert custom event handler to standard EventListener
    const customEventToEventListener = (fn: any): EventListener => {
      return fn as unknown as EventListener;
    };
    
    document.addEventListener('displayMediaInRightPanel', customEventToEventListener(eventListener));
    return () => {
      document.removeEventListener('displayMediaInRightPanel', customEventToEventListener(eventListener));
    };
  }, [currentMedia]);

  // Add a handler to synchronize the currently playing audio with its media
  useEffect(() => {
    // Only trigger if audio is playing and we have content in the queue
    if (isPlaying && audioRef.current && contentQueue.length > 0 && currentContentItem >= 0) {
      // Get the current content item being played
      const item = contentQueue[currentContentItem];
      
      // If the item has a URL and it's different from the currently displayed media
      if (item && item.url && (!currentMedia || item.sourceId !== currentMedia.sourceId)) {
        console.log("Synchronizing media with currently playing audio:", item);
        
        // Set the current media to match the playing audio content
        setCurrentMedia({
          sourceId: item.sourceId,
          type: 'image', // Default to image if not specified
          url: item.url,
          title: item.text || 'Content Media',
          mediaUrl: item.url,
          isPermanent: true
        });
      }
    }
  }, [isPlaying, currentContentItem, contentQueue]);

  // Add state for text highlighting in sync with audio
  const [highlightedWordIndex, setHighlightedWordIndex] = useState<number>(-1);
  
  // Function to render highlighted text
  const renderHighlightedText = (text: string | undefined) => {
    if (!text) return <p className="text-lg">No text available</p>;
    
    const words = text.split(' ');
    
    return (
      <p className="text-xl leading-relaxed">
        {words.map((word, index) => (
          <span 
            key={index} 
            className={cn(
              "transition-all duration-200",
              index === highlightedWordIndex ? "text-primary font-medium scale-110 inline-block" : "text-white"
            )}
          >
            {word}{' '}
          </span>
        ))}
      </p>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <style>{highlightStyle}</style>
      <style>{panelStyles}</style>
      <DialogContent 
        className="max-w-[100vw] w-full h-[100vh] p-0 max-h-screen bg-gradient-to-b from-background to-accent/10"
      >
        {/* Add DialogTitle and DialogDescription for accessibility - 
            using VisuallyHidden from Radix UI is better than sr-only, 
            but we need to keep the component in the tree */}
        <DialogHeader className="sr-only">
          <DialogTitle>Lesson Content</DialogTitle>
          <DialogDescription>
            Interactive lesson with questions, exercises, and media content
          </DialogDescription>
        </DialogHeader>

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
              {/* Add debug button after the audio controls */}
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
                {/* Debug button to manually trigger media display */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={debugExercisePrompts}
                  className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
                >
                  Debug Media
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
              <Progress value={currentAudioTime} className="h-1 flex-1" />
              <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
                {Math.round(currentAudioTime)}%
              </span>
            </div>
            {audioDuration > 0 && (
              <div className="flex items-center gap-4 mt-1">
                <Progress value={audioDuration} className="h-1 flex-1 bg-primary/20" />
                <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
                  {Math.round(audioDuration)}%
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
        <div className="flex mobile-layout overflow-hidden h-full">
          {/* Left Panel - Content and Controls */}
          <div 
            className={cn(
              "h-full mobile-bottom-panel overflow-y-auto",
              "transition-all duration-75 left-panel-width"
            )}
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
                        questions={lessonContent.content?.questions || []} 
                        selectedIndex={selectedQuestionIndex}
                        onQuestionSelect={handleQuestionSelect}
                        onNextLesson={() => setActiveTab("exercises")}
                        currentlyHighlightedId={currentlyHighlightedId}
                        onQuestionExpand={displayMediaFromQuestion}
                      />
                    </TabsContent>
                    <TabsContent value="exercises">
                      <ExercisesTab 
                        exercises={lessonContent.content?.exercise_prompts || []}
                        currentlyHighlightedId={currentlyHighlightedId}
                      />
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
            ref={resizeRef}
            className={cn(
              "w-1 h-full mobile-resize-handle bg-border hover:bg-primary/50 cursor-col-resize",
              "transition-colors duration-200 flex items-center justify-center relative z-10"
            )}
            onMouseDown={() => {
              setStartResizing(true);
            }}
            onMouseEnter={() => setIsResizeHovered(true)}
            onMouseLeave={() => setIsResizeHovered(false)}
          >
            {/* Desktop resize icon */}
            <div className="hidden md:flex">
              <GripVertical className={cn(
                "h-4 w-4 transition-colors duration-200",
                (startResizing || isResizeHovered) ? "text-primary" : "text-muted-foreground/50"
              )} />
            </div>
            
            {/* Mobile resize icon */}
            <div className="flex md:hidden">
              <GripHorizontal className={cn(
                "h-4 w-4 transition-colors duration-200",
                (startResizing || isResizeHovered) ? "text-primary" : "text-muted-foreground/50"
              )} />
            </div>
          </div>

          {/* Right Panel - Media Preview */}
          {showRightPanel && (
            <div 
              className={cn(
                "h-full mobile-top-panel border-l md:border-l border-t md:border-t-0 bg-muted/5 backdrop-blur-sm",
                "relative overflow-hidden transition-all duration-75 right-panel-width"
              )}
              style={{ display: showRightPanel ? 'block' : 'none' }} // Force display based on state
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b bg-background/50 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-primary/10">
                      <ImageIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-primary">Media Preview</h3>
                  </div>
                  <div className="flex items-center gap-2 mobile-media-controls">
                    <Button
                      title="Toggle Media Fullscreen"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0 rounded-full",
                        "hover:bg-primary/10 hover:text-primary",
                        "transition-all duration-200",
                        "bg-black/30" // Add a semi-transparent background for better visibility
                      )}
                      onClick={() => setIsMediaFullscreen(!isMediaFullscreen)}
                    >
                      {isMediaFullscreen ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                    
                    {/* Debug button to reload media */}
                    <Button
                      title="Force Reload Media"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0 rounded-full",
                        "hover:bg-destructive/10 hover:text-destructive",
                        "transition-all duration-200",
                        "bg-black/30" // Add a semi-transparent background for better visibility
                      )}
                      onClick={() => {
                        // Only do this if we have currentMedia
                        if (currentMedia) {
                          console.log("Forcing reload with Next.js Image");
                          
                          // Create a new state object to force re-render
                          setCurrentMedia({
                            ...currentMedia,
                            // Add a timestamp to force the Image to reload
                            url: currentMedia.url.includes('?') 
                              ? `${currentMedia.url}&t=${Date.now()}` 
                              : `${currentMedia.url}?t=${Date.now()}`,
                            isExternalDomain: true // Force using unoptimized mode
                          });
                        }
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-6 space-y-6">
                    {/* Debug info to show current state */}
                    {/* <div className="bg-black/10 p-2 rounded text-xs">
                      <p>showRightPanel: {showRightPanel ? 'true' : 'false'}</p>
                      <p>currentMedia: {currentMedia ? 'exists' : 'null'}</p>
                      {currentMedia && (
                        <>
                          <p>URL: {currentMedia?.url ? currentMedia.url.substring(0, 30) : 'No URL'}...</p>
                          <p>Type: {currentMedia.type}</p>
                        </>
                      )}
                    </div> */}
                    
                    {currentMedia ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
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
                        {/* Debug info to show what media we're trying to display */}
                        {/* <div className="absolute top-0 right-0 bg-black/50 text-white text-xs p-1 z-50">
                          {JSON.stringify({url: currentMedia?.url ? currentMedia.url.substring(0, 30) : 'No URL', type: currentMedia?.type || 'unknown'}, null, 2)}
                        </div> */}
                        
                        {/* Main content */}
                        {currentMedia?.type === 'image' ? (
                          <div 
                            className={cn(
                              "relative w-full overflow-hidden group media-container mobile-media-container",
                              "rounded-lg shadow-sm",
                              "min-h-[200px]", 
                              isMediaFullscreen ? "h-full" : "aspect-video",
                              "max-w-full",
                              "flex justify-center items-center", // Added flex layout for better centering
                              isMediaFullscreen && "fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-8"
                            )}>
                            {/* Debug image info */}
                            {/* <div className="absolute bottom-0 left-0 bg-black/50 text-white text-xs p-1 z-40">
                              Loading: {currentMedia?.url ? currentMedia.url.substring(0, 30) : 'No URL'}...
                              {currentMedia?.isExternalDomain && " (External Domain)"}
                            </div> */}
                            
                            {/* For external domains or fullscreen, use Next.js Image with unoptimized */}
                            {(isMediaFullscreen || currentMedia?.isExternalDomain) ? (
                              // Use Next.js Image with unoptimized prop instead of img tag
                              <div className="relative w-full h-full min-h-[200px] flex items-center justify-center">
                                <Image
                                  src={currentMedia?.url || FALLBACK_IMAGE}
                                  alt={currentMedia?.title || "Image"}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  priority={activeTab === "questions"}
                                  className={cn(
                                    "object-contain",
                                    "transition-all duration-500",
                                    "hover:scale-[1.02]",
                                    "group-hover:brightness-110",
                                    isMediaFullscreen && "object-contain"
                                  )}
                                  style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }} // Added specific styling
                                  onError={(e) => {
                                    console.error("Error loading image with Next.js Image:", currentMedia.url);
                                    // Try to replace with regular img tag on error
                                    const container = e.currentTarget.parentElement;
                                    if (container) {
                                      const imgElement = document.createElement('img');
                                      imgElement.src = currentMedia.url;
                                      imgElement.alt = currentMedia.title || "Image";
                                      imgElement.className = "w-full h-full object-contain rounded-lg";
                                      imgElement.onerror = () => {
                                        imgElement.src = FALLBACK_IMAGE;
                                        imgElement.alt = "Image not available";
                                      };
                                      
                                      // Clear container and append new img
                                      while (container.firstChild) {
                                        container.removeChild(container.firstChild);
                                      }
                                      container.appendChild(imgElement);
                                    } else {
                                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                    }
                                  }}
                                  unoptimized={true} // Always unoptimize external images
                                />
                              </div>
                            ) : (
                              // Use Next.js Image for local/internal images
                              <Image
                                src={currentMedia?.url || FALLBACK_IMAGE}
                                alt={currentMedia?.title || "Image"}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={activeTab === "questions"}
                                className={cn(
                                  "object-contain", 
                                  "transition-all duration-500",
                                  "hover:scale-[1.02]",
                                  "group-hover:brightness-110"
                                )}
                                onError={(e) => {
                                  console.error("Error loading image with Next.js Image:", currentMedia?.url || "No URL");
                                  // Try to replace with regular img tag on error
                                  const container = e.currentTarget.parentElement;
                                  if (container) {
                                    const imgElement = document.createElement('img');
                                    imgElement.src = currentMedia?.url || FALLBACK_IMAGE;
                                    imgElement.alt = currentMedia?.title || "Image";
                                    imgElement.className = "w-full h-full object-contain rounded-lg";
                                    
                                    // Clear container and append new img
                                    while (container.firstChild) {
                                      container.removeChild(container.firstChild);
                                    }
                                    container.appendChild(imgElement);
                                  } else {
                                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                  }
                                }}
                                unoptimized={true} // Always unoptimize external images
                              />
                            )}
                          </div>
                        ) : currentMedia?.type === 'video' && (
                          <div className="relative aspect-video min-h-[200px]">
                            {/* Debug video info */}
                            {/* <div className="absolute bottom-0 left-0 bg-black/50 text-white text-xs p-1 z-40">
                              Loading video: {currentMedia?.url ? currentMedia.url.substring(0, 30) : 'No URL'}...
                              {currentMedia?.isExternalDomain && " (External Domain)"}
                            </div>
                             */}
                            <video
                              src={currentMedia?.url || ''}
                              controls
                              className={cn(
                                "w-full h-full object-cover rounded-lg",
                                "transition-all duration-500",
                                "hover:scale-[1.02]",
                                "group-hover:brightness-110",
                                isMediaFullscreen && "h-full mx-auto object-contain"
                              )}
                              preload="metadata"
                              autoPlay
                              playsInline
                              onError={(e) => {
                                console.error("Error loading video:", currentMedia?.url || "No URL");
                                // Replace with fallback image on error
                                const imgElement = document.createElement('img');
                                imgElement.src = FALLBACK_IMAGE;
                                imgElement.alt = "Video not available";
                                imgElement.className = "w-full h-full object-cover rounded-lg";
                                e.currentTarget.parentNode?.replaceChild(imgElement, e.currentTarget);
                              }}
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
                              {currentMedia?.type === 'image' ? (
                                <span className="flex items-center gap-2">
                                  <ImageIcon className="h-4 w-4" />
                                  {currentMedia?.title || 'Image'}
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <Video className="h-4 w-4" />
                                  {currentMedia?.title || 'Video'}
                                </span>
                              )}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center p-8 rounded-lg border border-dashed border-muted-foreground/30">
                          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                          <p className="text-muted-foreground">No media available for this lesson</p>
                          <p className="text-sm text-muted-foreground/70 mt-2">
                            Media will appear here when available in exercises or questions
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        {/* Fullscreen Media Display */}
        {isMediaFullscreen && (
          <div className="fixed inset-0 z-50 w-screen h-screen bg-black flex flex-col">
            {/* Close button */}
            <div className="absolute top-4 right-4 z-50">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMediaFullscreen(false)}
                className="rounded-full bg-black/40 text-white hover:bg-black/60"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Media content - centered */}
            <div className="flex-1 relative w-full h-full overflow-hidden">
              {currentMedia ? (
                <>
                  {/* Media display - image or video */}
                  {currentMedia.type === 'image' ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={currentMedia.url || FALLBACK_IMAGE}
                        alt={currentMedia.title || "Media"}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : currentMedia.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <video
                        className="h-full w-full object-contain"
                        controls
                        src={currentMedia.url}
                        poster={FALLBACK_IMAGE}
                      />
                    </div>
                  )}
                  
                  {/* Title bar with controls at top */}
                  <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-10">
                    <div className="flex items-center gap-2 text-white">
                      <h3 className="font-medium">{currentMedia.title || 'Media Preview'}</h3>
                    </div>
                  </div>
                  
                  {/* Current text display at bottom with progress */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-10">
                    {/* Audio progress bar */}
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-4">
                      <div 
                        className="h-full bg-primary transition-all duration-100" 
                        style={{ width: `${currentAudioTime}%` }}
                      />
                    </div>
                    
                    {/* Current text with highlighting - with robust null checking */}
                    {Array.isArray(contentQueue) && contentQueue.length > 0 && 
                     typeof currentContentItem === 'number' && currentContentItem >= 0 && 
                     currentContentItem < contentQueue.length && 
                     contentQueue[currentContentItem] ? (
                      <div className="text-white">
                        <div className="text-lg font-medium mb-1">Now Playing:</div>
                        {renderHighlightedText(contentQueue[currentContentItem]?.text)}
                        
                        {/* Next line preview if available */}
                        {currentContentItem + 1 < contentQueue.length && 
                         contentQueue[currentContentItem + 1] ? (
                          <div className="mt-4 text-white/70">
                            <div className="text-sm font-medium mb-1">Up Next:</div>
                            <p className="text-lg">
                              {contentQueue[currentContentItem + 1]?.text || 'No text available'}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-white text-center py-4">
                        <p>No active content available</p>
                      </div>
                    )}
                    
                    {/* Audio controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={togglePlayback}
                        className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={toggleMute}
                        className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-8 rounded-lg border border-dashed border-white/30 bg-black/50">
                    <ImageIcon className="h-12 w-12 mx-auto text-white/50 mb-3" />
                    <p className="text-white">No media selected</p>
                    <p className="text-sm text-white/70 mt-2">
                      Select media or play audio to display content
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Keep the old Sheet for compatibility but don't use it for fullscreen anymore */}
        <Sheet open={false} onOpenChange={() => {}}>
          <SheetContent side="right" className="hidden">
            {/* Placeholder to maintain component structure */}
          </SheetContent>
        </Sheet>

        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={contentQueue[currentAudioTime]?.url}
          onEnded={handleAudioEnded}
          onTimeUpdate={handleTimeUpdate}
          onCanPlay={() => setIsAudioReady(true)}
          onError={(e) => {
            logger.error('Audio playback error', {
              source: 'LessonDialog',
              context: { 
                error: e,
                currentAudioIndex: 0,
                audioUrl: contentQueue[currentAudioTime]?.url
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
  // Function to display the lesson title image in the right panel
  const displayLessonTitleImage = () => {
    if (!content?.media_url) return;
    
    try {
      console.log("Displaying lesson title image:", content.media_url);
      
      // Check if URL is from external domains that need special handling
      const isExternalDomain = content.media_url.includes('gifsec.com') || content.media_url.includes('gifdb.com');
      
      // Create a custom event to display the media
      const mediaEvent = new CustomEvent('displayMediaInRightPanel', {
        bubbles: true,
        composed: true,
        detail: {
          mediaUrl: content.media_url,
          mediaType: 'image',
          mediaTitle: content.title || 'Lesson Image',
          sourceId: 'lesson-title',
          isExternalDomain
        }
      });
      
      // Dispatch the event to both document and window for compatibility
      document.dispatchEvent(mediaEvent);
      window.dispatchEvent(mediaEvent);
    } catch (err) {
      console.error("Error dispatching lesson title image event:", err);
    }
  };
  
  // Display the lesson title image when the component mounts
  useEffect(() => {
    if (content?.media_url) {
      displayLessonTitleImage();
    }
  }, [content?.media_url]);
  
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
          {content?.title && (
            <div className="text-2xl font-bold flex items-center gap-4">
              {content.title}
              {content.media_url && (
                <div 
                  className="relative h-12 w-12 rounded-md overflow-hidden cursor-pointer border border-primary/20 hover:border-primary/50 transition-colors"
                  onClick={displayLessonTitleImage}
                >
                  <Image
                    src={content.media_url}
                    alt={content.title || 'Lesson Image'}
                    fill
                    className="object-cover"
                    unoptimized={content.media_url.includes('gifsec.com') || content.media_url.includes('gifdb.com')}
                    onError={(e) => {
                      console.error("Error loading lesson title image");
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
              )}
            </div>
          )}
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
  onNextLesson,
  currentlyHighlightedId,
  onQuestionExpand
}: { 
  questions: Question[],
  selectedIndex: number | null,
  onQuestionSelect: (index: number) => void,
  onNextLesson: () => void,
  currentlyHighlightedId: string | null,
  onQuestionExpand?: (question: Question) => void
}) {
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<Record<string, number>>({});
  
  const toggleQuestion = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
    
    // Find the question in the array
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1 && onQuestionSelect) {
      onQuestionSelect(questionIndex);
    }
    
    // If we have an onQuestionExpand handler, call it
    if (onQuestionExpand && questionIndex !== -1) {
      onQuestionExpand(questions[questionIndex]);
    }
  };
  
  const handleQuestionAnswer = (questionId: string, progress: number) => {
    setProgress(prev => ({
      ...prev,
      [questionId]: progress
    }));
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-40">
        <div className="p-4 rounded-full bg-primary/10">
          <HelpCircle className="h-6 w-6 text-primary" />
        </div>
        <p className="text-center text-muted-foreground">No questions available for this lesson</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, idx) => (
        <QuestionCard
          key={question.id}
          question={question}
          index={idx + 1}
          isExpanded={!!expandedQuestions[question.id]}
          onToggle={() => toggleQuestion(question.id)}
          onAnswer={(value) => handleQuestionAnswer(question.id, value)}
          progress={progress[question.id] || 0}
          id={`question-${question.id}`}
          className={selectedIndex === idx ? 'ring-2 ring-primary' : ''}
          onMediaDisplay={onQuestionExpand}
        />
      ))}
      {/* Next lesson button */}
      <div className="mt-8 flex justify-center">
          <Button
            onClick={onNextLesson}
          className="gap-2"
          size="lg"
          >
          Go to Exercises <ArrowRight className="h-4 w-4" />
          </Button>
      </div>
    </div>
  );
}

// Exercises Tab Component
function ExercisesTab({ 
  exercises,
  currentlyHighlightedId
}: { 
  exercises: any[],
  currentlyHighlightedId: string | null
}) {
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
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: index * 0.1 }}
          id={`exercise-${exercise.id}`}
          className={currentlyHighlightedId === `exercise-${exercise.id}` ? 'highlight-active-content' : ''}
        >
          <ExercisePromptView prompt={exercise} index={index} />
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
  progress,
  id,
  className,
  onMediaDisplay
}: { 
  question: Question;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onAnswer: (progress: number) => void;
  progress: number;
  id: string;
  className: string;
  onMediaDisplay?: (question: Question) => void
}): React.JSX.Element {
  const mediaDisplayedRef = useRef(false);
  
  // Reset the ref when the question changes
  useEffect(() => {
    mediaDisplayedRef.current = false;
  }, [question.id]);
  
  // Trigger media display when expanded
  useEffect(() => {
    if (isExpanded && onMediaDisplay && !mediaDisplayedRef.current && question) {
      console.log(`Displaying media on expand for question: ${question.id || 'unknown'}`);
      mediaDisplayedRef.current = true;
      onMediaDisplay(question);
    }
  }, [isExpanded, onMediaDisplay, question.id]);

  const [activeFollowup, setActiveFollowup] = useState<number | null>(null);
  
  // Handle hover to display media
  const handleMouseEnter = () => {
    // Display media on every hover, not just the first time
    if (onMediaDisplay && question) {
      console.log(`Displaying media on hover for question: ${question.id || 'unknown'}`);
      // We're setting mediaDisplayedRef.current to true only for expanded state tracking
      // but still allowing every hover to trigger media display
      onMediaDisplay(question);
    }
  };

  // Add a useEffect to trigger media display when expanded
  useEffect(() => {
    if (isExpanded && onMediaDisplay && question) {
      // Add a small delay to avoid triggering too often
      const timer = setTimeout(() => {
        onMediaDisplay(question);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isExpanded, onMediaDisplay, question.id]);

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
              <p className="text-muted-foreground">{question.data.teacher_script}</p>
            </CardContent>
          </Card>

          {/* Sample Answer - Optional */}
          {question.data.sample_answer && (
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <h4 className="font-medium">Sample Answer</h4>
                </div>
                <p className="text-muted-foreground">{question.data.sample_answer}</p>
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
      case 'speakingAndSpeaking':
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
    <div
      id={id}
      className={cn(
        "w-full rounded-lg mb-2 overflow-hidden border shadow-sm",
        isExpanded ? "border-primary bg-card" : "bg-background hover:bg-accent/50 border-border",
        className
      )}
      onMouseEnter={handleMouseEnter}
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
              Question {index}
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
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
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
                <p className="text-muted-foreground">{question.content || 'No content available.'}</p>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-primary/10 shadow-sm"
              >
                {renderQuestionContent()}
              </motion.div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 