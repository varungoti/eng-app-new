"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/components/common/ImagePreview";
import AIFeedback from "@/components/common/AIFeedback";
import { useToast } from "@/components/ui/use-toast";
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Mic,
  Volume2,
  RefreshCw,
  Plus,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Crown,
  Star
} from "lucide-react";

interface LessonContent {
  type: 'text' | 'media' | 'activity' | 'question' | 'interactive' | 'reward';
  content: string;
  mediaUrl?: string;
  options?: string[];
  correctAnswer?: string;
  points?: number;
  feedback?: string;
  hints?: string[];
}

interface LessonDeliveryProps {
  lessonId: string;
  onComplete: () => void;
  onGenerateContent: () => void;
}

export function LessonDelivery({ lessonId, onComplete, onGenerateContent }: LessonDeliveryProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [currentHint, setCurrentHint] = useState(0);
  const [showReward, setShowReward] = useState(false);

  // Mock lesson content - this would come from your API
  const [lessonContent] = useState<LessonContent[]>([
    {
      type: 'text',
      content: 'Today we will learn about colors. Let\'s start with basic colors!',
      points: 5
    },
    {
      type: 'media',
      content: 'Here are some common colors:',
      mediaUrl: '/images/colors.jpg',
      points: 10
    },
    {
      type: 'activity',
      content: 'Repeat after me: "Red, Blue, Green"',
      points: 15,
      feedback: "Great pronunciation! Keep practicing!"
    },
    {
      type: 'interactive',
      content: 'Match the colors with their names',
      options: ['Red Square', 'Blue Circle', 'Green Triangle'],
      correctAnswer: 'match_all',
      points: 20,
      hints: [
        "Look at the shapes carefully",
        "Match the colors one by one",
        "Remember the basic shapes we learned"
      ]
    },
    {
      type: 'question',
      content: 'What color is the sky?',
      options: ['Red', 'Blue', 'Green'],
      correctAnswer: 'Blue',
      points: 25,
      hints: [
        "Look up at the sky",
        "It's the same color as the ocean",
        "It's between Red and Green in the options"
      ]
    },
    {
      type: 'reward',
      content: 'Congratulations! You\'ve earned a star!',
      points: 50
    }
  ]);

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.3 }
    }
  };

  const handleNext = useCallback(() => {
    if (currentStep < lessonContent.length - 1) {
      const currentContent = lessonContent[currentStep];
      setPoints(prev => prev + (currentContent.points || 0));
      
      // Show reward animation for points
      toast({
        title: "Points Earned!",
        description: `+${currentContent.points} points`
      });

      setCurrentStep(prev => prev + 1);
      setCurrentHint(0); // Reset hints for next step
    } else {
      setShowReward(true);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [currentStep, lessonContent, onComplete, toast]);

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setCurrentHint(0);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Implement text-to-speech logic here
    const utterance = new SpeechSynthesisUtterance(lessonContent[currentStep].content);
    if (!isPlaying) {
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement speech-to-text logic here
    if ('webkitSpeechRecognition' in window) {
      // Implementation would go here
      toast({
        title: isRecording ? "Recording Stopped" : "Recording Started",
        description: isRecording ? "Processing your speech..." : "Speak now..."
      });
    } else {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
    }
  };

  const showNextHint = () => {
    const currentContent = lessonContent[currentStep];
    if (currentContent.hints && currentHint < currentContent.hints.length - 1) {
      setCurrentHint(prev => prev + 1);
      toast({
        title: "Hint",
        description: currentContent.hints![currentHint + 1]
      });
    }
  };

  const renderContent = (content: LessonContent) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="text-2xl font-medium text-center p-8 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {content.content}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              Points available: {content.points}
            </motion.div>
          </div>
        );
      
      case 'media':
        return (
          <div className="space-y-4">
            <div className="text-xl font-medium text-center">
              {content.content}
            </div>
            {content.mediaUrl && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative aspect-video rounded-lg overflow-hidden"
              >
                <ImagePreview
                  imageUrl={content.mediaUrl}
                  width={1280}
                  height={720}
                  className="object-cover"
                />
              </motion.div>
            )}
          </div>
        );
      
      case 'activity':
        return (
          <div className="space-y-6 text-center">
            <div className="text-xl font-medium">
              {content.content}
            </div>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={togglePlayPause}
                className="w-40"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Play
                  </>
                )}
              </Button>
              <Button
                size="lg"
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "secondary"}
                className="w-40"
              >
                {isRecording ? (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Record
                  </>
                )}
              </Button>
            </div>
            {content.feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-muted-foreground"
              >
                {content.feedback}
              </motion.div>
            )}
          </div>
        );
      
      case 'interactive':
        return (
          <div className="space-y-6">
            <div className="text-xl font-medium text-center">
              {content.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.options?.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-32 text-lg"
                    onClick={() => {
                      // Handle interactive matching
                      toast({
                        title: "Good job!",
                        description: "Keep matching the colors!"
                      });
                    }}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        );
      
      case 'question':
        return (
          <div className="space-y-6">
            <div className="text-xl font-medium text-center">
              {content.content}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.options?.map((option, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full text-lg py-8"
                    onClick={() => {
                      const isCorrect = option === content.correctAnswer;
                      setFeedback(isCorrect ? 
                        "Correct! Well done!" : 
                        "Try again!");
                      
                      if (isCorrect) {
                        toast({
                          title: "Excellent!",
                          description: `+${content.points} points!`
                        });
                      }
                    }}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center p-4 rounded-lg ${
                  feedback.includes("Correct") ? 
                    "bg-green-100 text-green-800" : 
                    "bg-red-100 text-red-800"
                }`}
              >
                {feedback}
              </motion.div>
            )}
          </div>
        );

      case 'reward':
        return (
          <motion.div
            className="text-center space-y-6 p-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Crown className="h-24 w-24 text-yellow-500 mx-auto" />
            <div className="text-3xl font-bold text-yellow-500">
              {content.content}
            </div>
            <div className="text-xl">
              Total Points: {points}
            </div>
            <div className="flex justify-center gap-4">
              <Star className="h-8 w-8 text-yellow-500" />
              <Star className="h-8 w-8 text-yellow-500" />
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ 
            width: `${((currentStep + 1) / lessonContent.length) * 100}%` 
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Points display */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Step {currentStep + 1} of {lessonContent.length}
        </div>
        <motion.div
          className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Crown className="h-5 w-5 text-primary" />
          <span className="font-bold">{points} Points</span>
        </motion.div>
      </div>

      {/* Content area */}
      <Card className="relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="p-6"
          >
            {renderContent(lessonContent[currentStep])}
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={showNextHint}
            disabled={!lessonContent[currentStep].hints || currentHint >= (lessonContent[currentStep].hints?.length || 0) - 1}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Hint
          </Button>
          <Button
            variant="outline"
            onClick={onGenerateContent}
          >
            <Plus className="mr-2 h-5 w-5" />
            More Practice
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentStep(0)}
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Restart
          </Button>
        </div>

        <Button
          onClick={handleNext}
          className="bg-primary"
        >
          {currentStep === lessonContent.length - 1 ? 'Complete' : 'Next'}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Reward animation */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div className="bg-white p-8 rounded-lg text-center space-y-4">
              <Crown className="h-16 w-16 text-yellow-500 mx-auto" />
              <h2 className="text-2xl font-bold">Lesson Complete!</h2>
              <p>You earned {points} points!</p>
              <div className="flex justify-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                <Star className="h-6 w-6 text-yellow-500" />
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 