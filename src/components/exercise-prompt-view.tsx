"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Volume2, MessageCircle, Clock, Video, ImageIcon, 
  Maximize2, Play, CheckCircle, PenLine, Mic, Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ImagePreview } from "@/components/common/ImagePreview";

interface ExercisePromptViewProps {
  prompt: {
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
  };
  index: number;
}

// Create a module-level (shared) controller for speech
const SpeechController = {
  _activeRequestIds: new Set<string>(),
  _speechSynthesisUtterance: null as SpeechSynthesisUtterance | null,
  
  registerAudio(requestId: string) {
    this._activeRequestIds.add(requestId);
    // Also log registration for debugging
    console.log(`SpeechController: Registered audio ${requestId}, active: `, 
      Array.from(this._activeRequestIds));
    return requestId;
  },
  
  stopAll() {
    // Cancel browser's speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Cancel any active speech by dispatching stop events
    if (this._activeRequestIds.size > 0) {
      this._activeRequestIds.forEach(id => {
        const stopEvent = new CustomEvent("stop-audio", {
          bubbles: true,
          detail: { requestId: id }
        });
        document.dispatchEvent(stopEvent);
        console.log(`SpeechController: Sent stop event for ${id}`);
      });
      
      // Also dispatch a global stop all audio event
      const stopAllEvent = new CustomEvent("stop-all-audio", {
        bubbles: true
      });
      document.dispatchEvent(stopAllEvent);
      
      this._activeRequestIds.clear();
    }
    
    // If there's a current utterance, stop it
    if (this._speechSynthesisUtterance) {
      try {
        window.speechSynthesis.cancel();
        this._speechSynthesisUtterance = null;
      } catch (e) {
        console.error("Error stopping speech synthesis:", e);
      }
    }
    
    console.log("SpeechController: Stopped all audio");
  },
  
  stopRequestId(requestId: string) {
    if (this._activeRequestIds.has(requestId)) {
      const stopEvent = new CustomEvent("stop-audio", {
        bubbles: true,
        detail: { requestId }
      });
      document.dispatchEvent(stopEvent);
      this._activeRequestIds.delete(requestId);
      console.log(`SpeechController: Stopped audio ${requestId}`);
      return true;
    }
    return false;
  }
};

// Add a global event listener to handle stop requests from other components
document.addEventListener("stop-all-audio", () => {
  window.speechSynthesis?.cancel();
  console.log("Global speech synthesis canceled");
});

export function ExercisePromptView({ prompt, index }: ExercisePromptViewProps) {
  const [mediaHovered, setMediaHovered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastDispatchRef = useRef<number>(0);
  const audioRequestIdRef = useRef<string>("");
  const isMountedRef = useRef(true);

  // Enhanced function to dispatch media display event with debounce and fallback handling
  const displayMedia = useCallback(() => {
    if (!isMountedRef.current) {
      console.log("Component unmounted, not displaying media");
      return;
    }
    
    // Prevent duplicate dispatch within 300ms
    const now = Date.now();
    if (now - lastDispatchRef.current < 300) {
      console.log("Preventing duplicate media display event");
      return;
    }
    
    lastDispatchRef.current = now;
    
    try {
      // Generate a unique identifier to ensure media updates
      const timestamp = new Date().getTime();
      
      // Determine if we have prompt-specific media
      const promptHasMedia = prompt && prompt.media && typeof prompt.media === 'string';
      
      // If no prompt-specific media, we'll attempt to retrieve lesson media or show fallback
      if (!promptHasMedia) {
        console.log("No specific media available for this prompt, using fallback");
        
        // Dispatch event to request fallback media - will be handled by LessonDialog
        const fallbackMediaEvent = new CustomEvent('requestFallbackMedia', {
          bubbles: true,
          composed: true,
          detail: {
            sourceId: prompt?.id || `exercise-${index}`,
            promptTitle: prompt?.text || 'Exercise Media',
            index: index,
            timestamp
          }
        });
        
        // Dispatch the fallback request event
        document.dispatchEvent(fallbackMediaEvent);
        return;
      }
      
      // If we reach here, we have prompt-specific media to display
      
      // Check if URL is from external domains that need special handling
      const isExternalDomain = 
        typeof prompt.media === 'string' && 
        (prompt.media.includes('gifsec.com') || prompt.media.includes('gifdb.com'));
      
      // Add a timestamp parameter to force media refresh
      let mediaUrl = prompt.media as string; // Cast to string to avoid null error
      if (mediaUrl.includes('?')) {
        mediaUrl = `${mediaUrl}&_t=${timestamp}`;
      } else {
        mediaUrl = `${mediaUrl}?_t=${timestamp}`;
      }
      
      // Create a persistent media object
      const persistentMedia = {
        mediaUrl,
        mediaType: prompt.type || 'image',
        mediaTitle: prompt.text || 'Exercise Media',
        sourceId: prompt.id || 'unknown',
        isExternalDomain,
        isPermanent: true,
        timestamp
      };
      
      // Store the selected media in localStorage to ensure it persists
      try {
        localStorage.setItem('lastSelectedMedia', JSON.stringify(persistentMedia));
      } catch (e) {
        console.warn("Failed to store media in localStorage:", e);
      }

      // Create a properly typed custom event with the correct detail structure
      const mediaEvent = new CustomEvent('displayMediaInRightPanel', {
        bubbles: true,
        composed: true,
        detail: persistentMedia
      });
      
      // Dispatch only once - on document is sufficient
      document.dispatchEvent(mediaEvent);
      console.log("Media display event dispatched successfully");
    } catch (err) {
      console.error("Error dispatching media event:", err);
    }
  }, [prompt, index]);

  // Enhanced function to forcefully stop all audio
  const stopAudio = useCallback(() => {
    if (!isMountedRef.current) return;
    
    // First try to stop specific audio
    if (audioRequestIdRef.current) {
      SpeechController.stopRequestId(audioRequestIdRef.current);
      audioRequestIdRef.current = "";
    }
    
    // Then make sure all speech synthesis is canceled
    window.speechSynthesis?.cancel();
    
    // Finally update UI state if we're still mounted
    if (isMountedRef.current) {
      setIsPlaying(false);
    }
    
    console.log("Audio stopped completely");
  }, []);

  // Enhanced play narration with better control
  const playNarration = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!prompt?.narration || !isMountedRef.current) return;
    
    // If already playing, stop it first
    if (isPlaying) {
      stopAudio();
      return;
    }
    
    // First ensure any existing audio is stopped
    SpeechController.stopAll();
    
    // Generate a unique request ID for this specific audio playback
    const requestId = `narration-${prompt.id}-${Date.now()}`;
    audioRequestIdRef.current = SpeechController.registerAudio(requestId);
    
    // Create text-to-speech event with enhanced callbacks
    const customEvent = new CustomEvent("text-to-speech", { 
      detail: {
        text: prompt.narration,
        lang: 'en-US',
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
        sourceId: prompt.id,
        requestId: requestId,
        onStart: () => {
          if (isMountedRef.current) {
            setIsPlaying(true);
            console.log(`Audio started: ${requestId}`);
          }
        },
        onEnd: () => {
          if (isMountedRef.current) {
            setIsPlaying(false);
            audioRequestIdRef.current = "";
            console.log(`Audio ended: ${requestId}`);
          }
        },
        onError: (err: any) => {
          console.error(`Audio error: ${requestId}`, err);
          if (isMountedRef.current) {
            setIsPlaying(false);
            audioRequestIdRef.current = "";
          }
        },
        // Add a cancel callback that LessonDialog should implement
        onCancel: () => {
          if (isMountedRef.current) {
            setIsPlaying(false);
            audioRequestIdRef.current = "";
            console.log(`Audio canceled: ${requestId}`);
          }
        }
      },
      bubbles: true,
      cancelable: true
    });
    
    // Dispatch the event
    document.dispatchEvent(customEvent);
    console.log(`Narration started: ${requestId}`);
    
    // Update UI immediately
    if (isMountedRef.current) {
      setIsPlaying(true);
    }
  }, [prompt, isPlaying, stopAudio]);

  // Set up listener for stopping audio from outside this component
  useEffect(() => {
    isMountedRef.current = true;
    
    // Listen for stop events that might be dispatched by other components
    const handleStopAudio = (e: CustomEvent) => {
      if (!isMountedRef.current) return;
      
      // If this is our audio or a global stop, update our UI
      if (!e.detail?.requestId || e.detail.requestId === audioRequestIdRef.current) {
        if (isMountedRef.current) {
          setIsPlaying(false);
          audioRequestIdRef.current = "";
        }
      }
    };
    
    // Cast to any to avoid TypeScript errors
    document.addEventListener("stop-audio", handleStopAudio as any);
    document.addEventListener("stop-all-audio", handleStopAudio as any);
    
    // Register for pagehide and visibilitychange to handle when page is hidden/navigated away
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopAudio();
      }
    };
    
    window.addEventListener('pagehide', stopAudio);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up all listeners and stop any audio on unmount
    return () => {
      isMountedRef.current = false;
      stopAudio();
      SpeechController.stopAll();
      
      document.removeEventListener("stop-audio", handleStopAudio as any);
      document.removeEventListener("stop-all-audio", handleStopAudio as any);
      window.removeEventListener('pagehide', stopAudio);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      console.log("ExercisePrompt cleanup complete - all audio should be stopped");
    };
  }, [stopAudio]);

  // Add effect to handle browser navigation (back/forward)
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopAudio();
      SpeechController.stopAll();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [stopAudio]);

  // Function to handle completion
  const handleComplete = () => {
    if (!isMountedRef.current) return;
    
    setIsCompleted(!isCompleted);
    
    // Dispatch an event to notify completion
    const customEvent = new CustomEvent("exercise-completed", {
      detail: {
        exerciseId: prompt.id,
        completed: !isCompleted
      },
      bubbles: true
    });
    
    document.dispatchEvent(customEvent);
  };
  
  // Helper for checking content availability
  const mediaAvailable = prompt.media && prompt.type;
  const hasNarration = !!prompt.narration;
  const hasSayText = !!prompt.saytext;
  const estimatedTime = prompt.metadata?.estimatedTime || 5;
  const difficulty = prompt.metadata?.difficulty || 'beginner';

  // Get difficulty styles
  const getDifficultyColor = () => {
    switch(difficulty) {
      case 'beginner': return 'from-green-500/10 to-green-500/5 border-green-500/20';
      case 'intermediate': return 'from-blue-500/10 to-blue-500/5 border-blue-500/20';
      case 'advanced': return 'from-red-500/10 to-red-500/5 border-red-500/20';
      default: return 'from-primary/10 to-primary/5 border-primary/20';
    }
  };

  // Get difficulty badge style
  const getDifficultyBadgeStyle = () => {
    switch(difficulty) {
      case 'beginner': return 'bg-green-500/10 text-green-600 hover:bg-green-500/20';
      case 'intermediate': return 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20';
      case 'advanced': return 'bg-red-500/10 text-red-600 hover:bg-red-500/20';
      default: return 'bg-primary/10 text-primary hover:bg-primary/20';
    }
  };

  return (
    <motion.div
      id={`exercise-${prompt.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn("group", isCompleted && "opacity-75")}
      onMouseEnter={() => {
        // Always attempt to display media, even if no specific media is available
        // The fallback mechanism will handle cases with no media
        console.log("Mouse entered exercise prompt:", prompt.id || 'unknown');
        displayMedia();
      }}
    >
      <Card className={cn(
        "overflow-hidden backdrop-blur-sm transition-all duration-300",
        "border bg-gradient-to-b from-background to-background/70 hover:shadow-md hover:-translate-y-1",
        isCompleted && "bg-muted/50 border-success/20",
        getDifficultyColor()
      )}>
        {/* Media preview (if available) */}
        {mediaAvailable && (
          <div 
            className="relative cursor-pointer overflow-hidden" 
            style={{ height: '180px' }}
            onClick={() => {
              // Always attempt to display media, even without prompt media
              console.log("Clicked on exercise prompt:", prompt.id || 'unknown');
              displayMedia();
              
              // Re-dispatch after a short delay to ensure it sticks
              setTimeout(() => {
                console.log("Resending media display event after delay");
                displayMedia();
              }, 200);
            }}
            onMouseEnter={() => setMediaHovered(true)}
            onMouseLeave={() => setMediaHovered(false)}
          >
            {prompt.type === 'image' && (
              <div 
                className="h-full w-full transition-transform duration-700" 
                style={{ transform: mediaHovered ? 'scale(1.05)' : 'scale(1)' }}
              >
                <ImagePreview
                  imageUrl={prompt.media || ''}
                  alt={prompt.text}
                  className="w-full h-full object-cover"
                  priority={false}
                />
              </div>
            )}
            
            {prompt.type === 'video' && (
              <div className="h-full w-full">
                <video
                  src={prompt.media || ''}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    const videoEl = e.currentTarget.closest('.relative')?.querySelector('video') as HTMLVideoElement;
                    if (videoEl) {
                      videoEl.controls = true;
                      videoEl.play();
                    }
                  }}
                />
              </div>
            )}
            
            {/* Media overlay with play/expand button */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent",
              "flex flex-col items-center justify-center",
              "transition-opacity duration-300",
              mediaHovered ? "opacity-100" : "opacity-0"
            )}>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={displayMedia}
                className="bg-white/30 hover:bg-white/50 backdrop-blur-sm border-white/40 text-white rounded-full h-14 w-14 transform transition-transform duration-300 mb-4"
                style={{ transform: mediaHovered ? 'scale(1.1)' : 'scale(1)' }}
              >
                <Maximize2 className="h-6 w-6" />
              </Button>
              
              {/* Title on hover - improved for projector visibility */}
              <div className="max-w-[90%] text-center px-5 py-3 bg-black/60 backdrop-blur-sm rounded-md">
                <p className="text-white text-lg font-semibold line-clamp-2">{prompt.text}</p>
              </div>
            </div>
            
            {/* Adding a badge with exercise number */}
            <div className="absolute top-3 right-3 z-10">
              <Badge 
                variant="outline" 
                className="bg-background/80 backdrop-blur-sm border-primary/30 text-base px-3 py-1"
              >
                Exercise {index + 1}
              </Badge>
            </div>
            
            {/* Video controls if needed */}
            {prompt.type === 'video' && (
              <div className="absolute bottom-2 right-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="bg-black/60 hover:bg-black/80 text-white text-base px-4 py-2"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    const videoEl = e.currentTarget.closest('.relative')?.querySelector('video') as HTMLVideoElement;
                    if (videoEl) {
                      videoEl.controls = true;
                      videoEl.play();
                    }
                  }}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Play
                </Button>
              </div>
            )}
          </div>
        )}

        <CardContent className="p-4 space-y-4">
          {/* For cards without media, wrap the entire card in a tooltip to show title */}
          {!mediaAvailable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full h-1 -mt-2 mb-3 invisible">
                    {/* Invisible element for tooltip trigger */}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[350px] text-base p-3">
                  <p className="font-medium">{prompt.text}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Instructions if available */}
          {prompt.content?.instructions && (
            <div className="flex gap-3 items-start text-base text-foreground">
              <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
              <p>{prompt.content.instructions}</p>
            </div>
          )}

          {/* Content row for narration and say text - combined in a single section */}
          {(hasNarration || hasSayText) && (
            <div className="flex flex-col gap-4 mt-1">
              {hasNarration && (
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Volume2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-foreground line-clamp-3">
                      {prompt.narration}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={playNarration}
                    className="flex-shrink-0 text-primary hover:bg-primary/10 h-9 px-3 rounded-full"
                  >
                    {isPlaying ? (
                      <>
                        <span className="sr-only">Stop</span>
                        <span className="h-4 w-4 mr-2 relative">
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="h-3 w-3 bg-primary"></span>
                          </span>
                        </span>
                        <span className="text-sm">Stop</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        <span className="text-sm">Play</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {hasSayText && (
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-foreground">
                      {prompt.saytext}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Writing/Speaking prompts in a compact form */}
          {(prompt.content?.writingPrompt || prompt.content?.speakingPrompt) && (
            <div className="flex flex-col gap-4 mt-3">
              {prompt.content?.writingPrompt && (
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <PenLine className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-foreground">
                      {prompt.content.writingPrompt}
                    </p>
                  </div>
                </div>
              )}
              
              {prompt.content?.speakingPrompt && (
                <div className="flex gap-3 items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Mic className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base text-foreground">
                      {prompt.content.speakingPrompt}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>

        {/* Action footer */}
        <CardFooter className={cn(
          "flex justify-between items-center px-4 py-3",
          "border-t border-border/50 bg-muted/30"
        )}>
          <TooltipProvider>
            <div className="flex items-center gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm">{estimatedTime} min</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-base p-3">
                  <p>Estimated time: {estimatedTime} minutes</p>
                </TooltipContent>
              </Tooltip>
              
              <Badge variant="outline" className="capitalize bg-background/50 text-sm px-2.5 py-1">
                {prompt.type}
              </Badge>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className={cn("capitalize text-sm px-2.5 py-1", getDifficultyBadgeStyle())}>
                    {difficulty}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="text-base p-3">
                  <p>{difficulty} level exercise</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          
          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {hasNarration && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={playNarration} 
                className="h-9 px-4 rounded-full bg-muted/50 hover:bg-primary/10 text-sm"
              >
                {isPlaying ? (
                  <>
                    <span className="h-4 w-4 mr-2 relative">
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="h-3 w-3 bg-primary"></span>
                      </span>
                    </span>
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    <span>Listen</span>
                  </>
                )}
              </Button>
            )}
            
            {mediaAvailable && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={displayMedia} 
                className="h-9 px-4 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border-primary/30 text-sm"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                <span>Fullscreen</span>
              </Button>
            )}
            
            <Button 
              className={cn(
                "h-9 px-4 rounded-full text-sm", 
                isCompleted ? "bg-green-500 hover:bg-green-600" : ""
              )} 
              size="sm"
              onClick={handleComplete}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>{isCompleted ? "Completed" : "Complete"}</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
} 