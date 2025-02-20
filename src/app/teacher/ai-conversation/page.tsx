"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { AIConversationSystem } from "@/components/ai/AIConversationSystem";
import { EnhancedAIFeedback } from "@/components/ai/EnhancedAIFeedback";
import { SpecializedExercises } from "@/components/ai/SpecializedExercises";
import { RealTimePronunciationTrainer } from "@/components/ai/RealTimePronunciationTrainer";
import { SkillSpecificExercises } from "@/components/ai/SkillSpecificExercises";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import {  Bot, Brain, Sparkles, Star, Trophy, Crown, Lightbulb, Wand2, Gauge, Mic, BookOpen, Keyboard, Languages } from "lucide-react";


// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5
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

export default function AIAssistantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'assessment' | 'game'>('assessment');
  const [studentAge, setStudentAge] = useState<number>(8);
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container mx-auto px-4 py-6 space-y-8"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Interactive AI-powered learning assistant for personalized education
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant={mode === 'assessment' ? 'default' : 'outline'}
            onClick={() => setMode('assessment')}
            className="gap-2"
          >
            <Brain className="h-4 w-4" />
            Assessment Mode
          </Button>
          <Button
            variant={mode === 'game' ? 'default' : 'outline'}
            onClick={() => setMode('game')}
            className="gap-2"
          >
            <Trophy className="h-4 w-4" />
            Game Mode
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="conversation" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="conversation" className="gap-2">
              <Bot className="h-4 w-4" />
              Conversation
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Feedback
            </TabsTrigger>
            <TabsTrigger value="exercises" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Exercises
            </TabsTrigger>
            <TabsTrigger value="skills" className="gap-2">
              <Star className="h-4 w-4" />
              Skill Training
            </TabsTrigger>
            <TabsTrigger value="pronunciation" className="gap-2">
              <Mic className="h-4 w-4" />
              Pronunciation
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="conversation" className="mt-6">
                <ErrorBoundary source="AIConversation">
                  <Card className="relative overflow-hidden">
                    {isLoading && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <AIConversationSystem
                        mode={mode}
                        studentAge={studentAge}
                        skillLevel={skillLevel}
                        onLoading={setIsLoading}
                      />
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="feedback" className="mt-6">
                <ErrorBoundary source="AIFeedback">
                  <Card className="relative overflow-hidden">
                    {isLoading && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <EnhancedAIFeedback
                        studentAge={studentAge}
                        feedback={{
                          pronunciation: {
                            overall: 85,
                            details: {
                              phonemeAccuracy: { score: 85, issues: [], examples: [] },
                              intonation: { score: 88, patterns: [], improvements: [] },
                              stress: { score: 82, correctPatterns: [], incorrectPatterns: [] },
                              rhythm: { score: 84, feedback: [] }
                            }
                          },
                          grammar: {
                            overall: 90,
                            details: {
                              sentenceStructure: { score: 90, errors: [], corrections: [] },
                              verbTenses: { score: 88, correctUsage: [], incorrectUsage: [] },
                              articles: { score: 92, mistakes: [], rules: [] },
                              prepositions: { score: 89, errors: [], examples: [] }
                            }
                          },
                          vocabulary: {
                            overall: 88,
                            details: {
                              range: { score: 88, level: 'intermediate', suggestions: [] },
                              appropriateness: { score: 87, feedback: [] },
                              collocations: { score: 89, correct: [], incorrect: [] },
                              idiomaticExpressions: { score: 86, mastered: [], toLearn: [] }
                            }
                          },
                          fluency: {
                            overall: 87,
                            details: {
                              speakingRate: { score: 87, wordsPerMinute: 120, target: 130 },
                              pauses: { score: 86, appropriate: 8, inappropriate: 2, suggestions: [] },
                              fillers: { score: 88, common: [], alternatives: [] },
                              coherence: { score: 87, feedback: [] }
                            }
                          },
                          comprehension: {
                            overall: 89,
                            details: {
                              listeningAccuracy: { score: 89, missedPoints: [] },
                              responseRelevance: { score: 90, feedback: [] },
                              contextualUnderstanding: { score: 88, observations: [] },
                              criticalThinking: { score: 89, strengths: [], areasToImprove: [] }
                            }
                          },
                          recommendations: [
                            {
                              id: '1',
                              type: 'practice',
                              title: 'Pronunciation Practice',
                              description: 'Focus on improving stress patterns in multi-syllable words',
                              priority: 'high',
                              timeEstimate: '15 minutes',
                              expectedOutcome: 'Better word stress accuracy'
                            },
                            {
                              id: '2',
                              type: 'exercise',
                              title: 'Grammar Exercise',
                              description: 'Practice using past perfect tense',
                              priority: 'medium',
                              timeEstimate: '20 minutes',
                              expectedOutcome: 'Improved past perfect usage'
                            }
                          ],
                          achievements: [
                            {
                              id: '1',
                              title: 'Pronunciation Pro',
                              description: 'Achieved excellent pronunciation accuracy',
                              icon: <Trophy className="h-6 w-6 text-yellow-500" />,
                              unlockedAt: new Date().toISOString()
                            },
                            {
                              id: '2',
                              title: 'Grammar Master',
                              description: 'Mastered complex grammar structures',
                              icon: <Star className="h-6 w-6 text-purple-500" />,
                              unlockedAt: new Date().toISOString()
                            }
                          ]
                        }}
                        onRecommendationSelect={(recommendation) => {
                          console.log('Selected recommendation:', recommendation);
                          setIsLoading(false);
                        }}
                      />
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="exercises" className="mt-6">
                <ErrorBoundary source="Exercises">
                  <Card className="relative overflow-hidden">
                    {isLoading && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <SpecializedExercises
                        ageGroup={studentAge >= 4 && studentAge <= 6 ? '4-6' : 
                                studentAge >= 7 && studentAge <= 9 ? '7-9' : 
                                studentAge >= 10 && studentAge <= 13 ? '10-13' : '7-9'}
                        level={skillLevel}
                        onExerciseComplete={(result) => {
                          console.log('Exercise completed:', result);
                          setIsLoading(false);
                        }}
                      />
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="skills" className="mt-6">
                <ErrorBoundary source="SkillTraining">
                  <Card className="relative overflow-hidden">
                    {isLoading && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      {/* SkillSpecificExercises component removed as per instructions */}
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="pronunciation" className="mt-6">
                <ErrorBoundary source="Pronunciation">
                  <Card className="relative overflow-hidden">
                    {isLoading && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <RealTimePronunciationTrainer
                        word="hello"
                        phonetics="həˈloʊ"
                        difficulty={skillLevel}
                        syllables={["he", "llo"]}
                        stressPattern={[0, 1]}
                        onProgress={(progress) => {
                          console.log('Pronunciation progress:', progress);
                          setIsLoading(false);
                        }}
                      />
                    </CardContent>
                  </Card>
                </ErrorBoundary>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}