# LessonDialog Fixes

This document outlines the issues with the current LessonDialog component and proposed solutions.

## Issues Identified

1. **Audio playing twice**: The audio playback mechanism is triggering multiple times.
   
2. **Pause button not working properly**: Even when the pause button is pressed, audio continues playing.
   
3. **Media display in fullscreen mode**: In fullscreen mode, media is displayed in a small column.
   
4. **UI layout issues**: Need to simplify the UI structure while maintaining the main content and right media panels.
   
5. **Audio section highlighting**: Need to highlight active audio sections with a background glow effect.
   
6. **Next lesson navigation**: Need to add next lesson button after the last question to navigate to the next exercise.

## Proposed Solutions

### 1. Fix Duplicate Audio Playback

Add a reference to track audio playback state and prevent duplicate play triggers:

```tsx
// Add at the top of the component with other refs
const audioPlaybackRef = useRef<{isPlaying: boolean}>({isPlaying: false});

// Update speakWithFishSpeech function to check this ref before playing
const speakWithFishSpeech = useCallback(async (text: string, elementId?: string) => {
  // Check if already playing to prevent duplicates
  if (audioPlaybackRef.current.isPlaying) {
    console.log('Audio already playing, not starting again');
    return;
  }
  
  // Set playing flag
  audioPlaybackRef.current.isPlaying = true;
  
  // Rest of function remains the same
  
  // Make sure to reset the flag when done or on error
  audioSource.onended = () => {
    audioPlaybackRef.current.isPlaying = false;
    // Existing code...
  };
  
  // Also reset on error
  catch (error) {
    audioPlaybackRef.current.isPlaying = false;
    // Existing error handling...
  }
}, [/* existing dependencies */]);
```

### 2. Fix Pause Button

Update the togglePlayback function to properly handle all audio sources:

```tsx
const togglePlayback = useCallback(() => {
  if (isPlaying) {
    // Stop playback and set flag
    setIsPlaying(false);
    audioPlaybackRef.current.isPlaying = false;
    
    // Cancel all possible audio sources
    
    // 1. Stop Web Audio API source
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current = null;
      } catch (error) {
        console.error('Error stopping audio source:', error);
      }
    }
    
    // 2. Pause HTML audio element
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
    
    // 3. Cancel browser speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Clear highlighting
    setCurrentlyHighlightedId(null);
  } else {
    // Only start if not already playing
    if (!audioPlaybackRef.current.isPlaying) {
      // Set state before playing to prevent duplicate plays
      setIsPlaying(true);
      
      // Existing code to start playback...
    }
  }
}, [/* existing dependencies */]);
```

### 3. Improve Fullscreen Media Display

Create a dedicated FullscreenMediaViewer component in a separate file:

```tsx
// src/components/lesson/FullscreenMediaViewer.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Minimize2, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface FullscreenMediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: string;
  mediaTitle: string;
}

export function FullscreenMediaViewer({
  isOpen,
  onClose,
  mediaUrl,
  mediaType,
  mediaTitle
}: FullscreenMediaViewerProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="ghost" size="sm" onClick={onClose}>
          <Minimize2 className="h-5 w-5 text-white" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5 text-white" />
        </Button>
      </div>
      
      {/* Media display */}
      <div className="w-[90%] h-[90%] max-w-6xl">
        {mediaType === 'image' ? (
          <Image
            src={mediaUrl}
            alt={mediaTitle}
            layout="fill"
            objectFit="contain"
            priority
          />
        ) : (
          <video
            src={mediaUrl}
            controls
            className="w-full h-full object-contain"
            autoPlay
          />
        )}
      </div>
    </motion.div>
  );
}
```

### 4. Add Audio Section Highlighting

Add CSS for highlight effect and apply it to elements being spoken:

```css
.audio-glow {
  box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.4);
  background-color: rgba(var(--primary-rgb), 0.08);
  border-radius: 0.5rem;
  position: relative;
  z-index: 1;
  animation: pulsate 2s ease-in-out infinite;
}

@keyframes pulsate {
  0% { box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.4); }
  50% { box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.6); }
  100% { box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.4); }
}
```

Apply this class to elements when they are being spoken:

```tsx
// In speakWithFishSpeech function
if (elementId) {
  setCurrentlyHighlightedId(elementId);
  
  // Add glow effect
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.classList.add('audio-glow');
  }
}

// Remove when done
audioSource.onended = () => {
  // Remove glow effect
  if (elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove('audio-glow');
    }
  }
  
  // Existing code...
};
```

### 5. Add Next Lesson Button

Update the QuestionsTab component to include a next lesson button at the end:

```tsx
function QuestionsTab({ 
  questions, 
  selectedIndex,
  onQuestionSelect,
  onNextLesson,
  currentlyHighlightedId,
  onQuestionExpand,
  onClose
}: { 
  questions: Question[],
  selectedIndex: number | null,
  onQuestionSelect: (index: number) => void,
  onNextLesson: () => void,
  currentlyHighlightedId: string | null,
  onQuestionExpand?: (question: Question) => void,
  onClose: () => void
}) {
  // Existing code...
  
  // Check if this is the last question
  const isLastQuestion = selectedIndex === questions.length - 1;
  
  return (
    <div className="space-y-4">
      {/* Existing code for displaying questions */}
      
      {/* Navigation buttons */}
      <div className="mt-8 flex justify-center gap-4">
        {!isLastQuestion ? (
          <Button
            onClick={onNextLesson}
            className="gap-2"
            size="lg"
          >
            Go to Exercises <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-4">
            <Button
              onClick={onNextLesson}
              className="gap-2"
              size="lg"
              variant="default"
            >
              Go to Exercises <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={onClose}
              className="gap-2"
              size="lg"
              variant="outline"
            >
              Back to Topics <BookOpen className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Implementation Strategy

Due to the size and complexity of the LessonDialog component, it's recommended to implement these changes incrementally:

1. First, fix the duplicate audio playback issue by adding the audio playback ref.
2. Update the pause functionality to properly stop all audio sources.
3. Create and integrate the FullscreenMediaViewer component.
4. Add the audio glow highlighting effect.
5. Implement the next lesson navigation.

For each change, thoroughly test the component to ensure there are no regressions in the existing functionality. 