import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PlayCircle,
  PauseCircle,
  SkipForward,
  Mic,
  Volume2,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonContent {
  id: string;
  type: 'text' | 'media' | 'activity' | 'question' | 'exercise';
  content: string;
  mediaUrl?: string;
  options?: string[];
  correctAnswer?: string;
}

interface LessonDeliveryProps {
  lessonId: string;
  grade: string;
  topic: string;
  subtopic: string;
}

export function LessonDelivery({ lessonId, grade, topic, subtopic }: LessonDeliveryProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [needMoreContent, setNeedMoreContent] = useState(false);

  // Mock lesson content - replace with actual API call
  const [lessonContent, setLessonContent] = useState<LessonContent[]>([
    {
      id: '1',
      type: 'text',
      content: 'Today we will learn about adjectives. Adjectives are words that describe nouns.'
    },
    {
      id: '2',
      type: 'media',
      content: 'Watch this fun video about adjectives!',
      mediaUrl: '/videos/adjectives.mp4'
    },
    {
      id: '3',
      type: 'activity',
      content: 'Let\'s practice! Repeat after me: "The big brown dog jumped over the small white fence."'
    },
    {
      id: '4',
      type: 'question',
      content: 'What color was the dog in our sentence?',
      options: ['Black', 'Brown', 'White', 'Gray'],
      correctAnswer: 'Brown'
    }
  ]);

  const generateMoreContent = async () => {
    try {
      // Mock API call to OpenAI - replace with actual implementation
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade,
          topic,
          subtopic,
          lessonId,
          previousContent: lessonContent
        })
      });
      
      const newContent = await response.json();
      setLessonContent(prev => [...prev, ...newContent]);
      setNeedMoreContent(false);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < lessonContent.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setNeedMoreContent(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Implement text-to-speech logic here
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Implement speech-to-text logic here
  };

  const contentVariants = {
    enter: { x: 1000, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -1000, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Controls */}
        <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="text-blue-500 hover:text-blue-600"
          >
            Previous
          </Button>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayPause}
              className={cn(
                "rounded-full transition-all",
                isPlaying ? "bg-blue-500 text-white" : "text-blue-500"
              )}
            >
              {isPlaying ? (
                <PauseCircle className="h-6 w-6" />
              ) : (
                <PlayCircle className="h-6 w-6" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleListening}
              className={cn(
                "rounded-full transition-all",
                isListening ? "bg-green-500 text-white" : "text-green-500"
              )}
            >
              <Mic className="h-6 w-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={handleNext}
            className="text-blue-500 hover:text-blue-600"
          >
            Next
          </Button>
        </div>

        {/* Content Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                {(() => {
                  const content = lessonContent[currentStep];
                  switch (content.type) {
                    case 'text':
                      return (
                        <div className="space-y-4">
                          <BookOpen className="h-12 w-12 text-blue-500 mx-auto" />
                          <p className="text-2xl text-center font-medium">{content.content}</p>
                        </div>
                      );
                    case 'media':
                      return (
                        <div className="space-y-4">
                          <div className="aspect-video rounded-lg overflow-hidden bg-black/10">
                            {/* Add video/image component here */}
                          </div>
                          <p className="text-lg text-center">{content.content}</p>
                        </div>
                      );
                    case 'activity':
                      return (
                        <div className="space-y-6 text-center">
                          <Volume2 className="h-12 w-12 text-green-500 mx-auto" />
                          <p className="text-xl">{content.content}</p>
                          <Button
                            size="lg"
                            onClick={toggleListening}
                            className={cn(
                              "rounded-full transition-all",
                              isListening ? "bg-green-500" : "bg-blue-500"
                            )}
                          >
                            {isListening ? "Listening..." : "Start Speaking"}
                          </Button>
                        </div>
                      );
                    case 'question':
                      return (
                        <div className="space-y-6">
                          <HelpCircle className="h-12 w-12 text-purple-500 mx-auto" />
                          <p className="text-xl text-center font-medium">{content.content}</p>
                          <div className="grid grid-cols-2 gap-4">
                            {content.options?.map((option, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                className="text-lg py-8 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                              >
                                {option}
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    default:
                      return null;
                  }
                })()}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* More Content Generation */}
        {needMoreContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button
              size="lg"
              onClick={generateMoreContent}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Generate More Practice Content
            </Button>
          </motion.div>
        )}

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2">
          {lessonContent.map((_, index) => (
            <motion.div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full",
                index === currentStep
                  ? "bg-blue-500"
                  : index < currentStep
                  ? "bg-green-500"
                  : "bg-gray-300 dark:bg-gray-700"
              )}
              initial={false}
              animate={{
                scale: index === currentStep ? 1.2 : 1
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 