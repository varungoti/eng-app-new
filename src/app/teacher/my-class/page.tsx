"use client";

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ClassTabs } from "@/components/common/ClassTab";
import { LearningPath } from "@/components/common/learningpath";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  ChevronLeft,
  Bot
} from "lucide-react";
import { LessonDelivery } from "@/components/teacher/LessonDelivery";
import { SpecializedQuestionManager } from "@/components/teacher/SpecializedQuestionManager";
import { EnhancedAudioFeedback } from "@/components/teacher/EnhancedAudioFeedback";
import { LanguageLearningFeedback } from "@/components/teacher/LanguageLearningFeedback";
import { InteractiveActivity } from "@/components/teacher/InteractiveActivity";
import { SpecializedActivities } from "@/components/teacher/SpecializedActivities";
import { RhythmAndIntonation } from "@/components/teacher/RhythmAndIntonation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIConversationSystem } from "@/components/ai/AIConversationSystem";
import { EnhancedAIFeedback } from "@/components/ai/EnhancedAIFeedback";
import { SpecializedExercises } from "@/components/ai/SpecializedExercises";
import { SkillSpecificExercises } from "@/components/ai/SkillSpecificExercises";
import { RealTimePronunciationTrainer } from "@/components/ai/RealTimePronunciationTrainer";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.2
    }
  }
};

interface ClassItem {
  id: number;
  name: string;
}

// Convert mock data to match the new interface
const mockClasses: ClassItem[] = [
  {
    id: 1,
    name: "Grade 1A - English Basic"
  },
  {
    id: 2,
    name: "Grade 2B - English Intermediate"
  },
  {
    id: 3,
    name: "Grade 3C - English Advanced"
  }
];

type ViewType = 'overview' | 'lesson' | 'ai-assistant';

// Helper function to get level from class name
function getSkillLevel(name: string): "beginner" | "intermediate" | "advanced" {
  if (name.toLowerCase().includes("basic")) return "beginner";
  if (name.toLowerCase().includes("intermediate")) return "intermediate";
  return "advanced";
}

export default function MyClassPage() {
  const [selectedClass, setSelectedClass] = useState<ClassItem>(mockClasses[0]);
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [studentAge, setStudentAge] = useState(10); // Default age

  const handleClassSelect = useCallback(async (classId: string) => {
    setIsLoading(true);
    try {
      const selected = mockClasses.find(c => c.id.toString() === classId);
      if (selected) {
        setSelectedClass(selected);
      }
    } catch (error) {
      console.error('Error selecting class:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div variants={itemVariants}>
          <ClassTabs
            classes={mockClasses}
            selectedClass={selectedClass}
            onSelectClass={handleClassSelect}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedClass && (
            <motion.div
              key={`${selectedClass.id}-${currentView}`}
              variants={itemVariants}
              className="mt-6"
            >
              {currentView === 'overview' ? (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">
                      {selectedClass.name}
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentView('ai-assistant')}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
                      >
                        <Bot className="h-5 w-5" />
                        AI Assistant
                      </button>
                      <button
                        onClick={() => setCurrentView('lesson')}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <BookOpen className="h-5 w-5" />
                        Start Lesson
                      </button>
                    </div>
                  </div>
                  <LearningPath />
                </Card>
              ) : currentView === 'lesson' ? (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <button
                        onClick={() => setCurrentView('overview')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Back to overview"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      {selectedClass.name} - Current Lesson
                    </h2>
                  </div>
                  <div className="space-y-6">
                    <LessonDelivery
                      lessonId="mock-lesson-id"
                      onComplete={() => {
                        setCurrentView('overview');
                      }}
                      onGenerateContent={() => {
                        console.log('Generating more content...');
                      }}
                    />

                    <Tabs defaultValue="interactive" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="interactive">Interactive Activities</TabsTrigger>
                        <TabsTrigger value="specialized">Specialized Activities</TabsTrigger>
                        <TabsTrigger value="assessment">Assessment Tools</TabsTrigger>
                      </TabsList>

                      <TabsContent value="interactive" className="space-y-6">
                        <InteractiveActivity
                          difficulty="intermediate"
                          onActivityComplete={(result) => {
                            console.log('Activity completed:', result);
                          }}
                        />
                        <RhythmAndIntonation
                          targetText="Practice sentence for rhythm and intonation"
                          difficulty="intermediate"
                          onProgress={(progress) => {
                            console.log('Rhythm progress:', progress);
                          }}
                        />
                      </TabsContent>

                      <TabsContent value="specialized" className="space-y-6">
                        <SpecializedActivities
                          studentAge={8}
                          skillLevel="intermediate"
                          onActivityComplete={(result) => {
                            console.log('Specialized activity completed:', result);
                          }}
                        />
                      </TabsContent>

                      <TabsContent value="assessment" className="space-y-6">
                        <SpecializedQuestionManager 
                          lessonId="mock-lesson-id"
                          onQuestionCreated={() => {
                            console.log('New question created');
                          }}
                        />
                        <EnhancedAudioFeedback
                          targetAudio="/path/to/target/audio.mp3"
                          gameMode={true}
                          onFeedbackComplete={(feedback) => {
                            console.log('Audio feedback:', feedback);
                          }}
                        />
                        <LanguageLearningFeedback
                          targetAudio="/path/to/target/audio.mp3"
                          targetText="The target text to practice"
                          practiceMode="pronunciation"
                          difficulty="intermediate"
                          gameMode={true}
                          onFeedbackComplete={(feedback) => {
                            console.log('Language feedback:', feedback);
                          }}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </Card>
              ) : (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <button
                        onClick={() => setCurrentView('overview')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Back to overview"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      {selectedClass.name} - AI Assistant
                    </h2>
                  </div>
                  <Tabs defaultValue="conversation" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="conversation">Conversation</TabsTrigger>
                      <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
                      <TabsTrigger value="exercises">Exercises</TabsTrigger>
                      <TabsTrigger value="skills">Skill Training</TabsTrigger>
                      <TabsTrigger value="pronunciation">Pronunciation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="conversation" className="mt-6">
                      <AIConversationSystem 
                        mode="assessment"
                        studentAge={studentAge}
                        skillLevel={getSkillLevel(selectedClass.name)}
                        onLoading={setIsLoading}
                      />
                    </TabsContent>

                    <TabsContent value="feedback" className="mt-6">
                      <EnhancedAudioFeedback 
                        targetAudio={undefined}
                        onFeedbackComplete={(feedback) => {
                          console.log('Enhanced AI feedback:', feedback);
                          setIsLoading(false);
                        }}
                        gameMode={true}
                      />
                    </TabsContent>

                    <TabsContent value="exercises" className="mt-6">
                      <SpecializedExercises 
                        ageGroup={studentAge >= 4 && studentAge <= 6 ? '4-6' : 
                                 studentAge >= 7 && studentAge <= 9 ? '7-9' : 
                                 studentAge >= 10 && studentAge <= 13 ? '10-13' : '7-9'}
                        level={getSkillLevel(selectedClass.name)}
                        onExerciseComplete={(result) => {
                          console.log('Exercise completed:', result);
                          setIsLoading(false);
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="skills" className="mt-6">
                      <SkillSpecificExercises 
                        skill="pronunciation_accuracy"
                        level={getSkillLevel(selectedClass.name)}
                        ageGroup={studentAge >= 4 && studentAge <= 6 ? '4-6' : 
                                 studentAge >= 7 && studentAge <= 9 ? '7-9' : 
                                 studentAge >= 10 && studentAge <= 13 ? '10-13' : '7-9'}
                        onProgress={(progress) => {
                          console.log('Skill progress:', progress);
                          setIsLoading(false);
                        }}
                      />
                    </TabsContent>

                    <TabsContent value="pronunciation" className="mt-6">
                      <RealTimePronunciationTrainer 
                        word="hello"
                        phonetics="həˈloʊ"
                        difficulty={getSkillLevel(selectedClass.name)}
                        syllables={["he", "llo"]}
                        stressPattern={[0, 1]}
                        onProgress={(progress) => {
                          console.log('Pronunciation progress:', progress);
                          setIsLoading(false);
                        }}
                      />
                    </TabsContent>
                  </Tabs>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 