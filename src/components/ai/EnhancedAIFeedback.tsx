"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
//import { Button } from "@/components/ui/button";
import {
  Brain,
  Sparkles,
  Star,
  Trophy,
  Crown,
  Lightbulb,
  Wand2,
  Gauge,
  Mic,
  BookOpen,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedAIFeedbackProps {
  studentAge: number;
  feedback: DetailedFeedback;
  onRecommendationSelect?: (recommendation: string) => void;
}

export interface DetailedFeedback {
  pronunciation: PronunciationAnalysis;
  grammar: GrammarAnalysis;
  vocabulary: VocabularyAnalysis;
  fluency: FluencyAnalysis;
  comprehension: ComprehensionAnalysis;
  recommendations: Recommendation[];
  achievements: Achievement[];
}

interface PronunciationAnalysis {
  overall: number;
  details: {
    phonemeAccuracy: {
      score: number;
      issues: string[];
      examples: { correct: string; student: string }[];
    };
    intonation: {
      score: number;
      patterns: string[];
      improvements: string[];
    };
    stress: {
      score: number;
      correctPatterns: string[];
      incorrectPatterns: string[];
    };
    rhythm: {
      score: number;
      feedback: string[];
    };
  };
}

interface GrammarAnalysis {
  overall: number;
  details: {
    sentenceStructure: {
      score: number;
      errors: string[];
      corrections: string[];
    };
    verbTenses: {
      score: number;
      correctUsage: string[];
      incorrectUsage: string[];
    };
    articles: {
      score: number;
      mistakes: string[];
      rules: string[];
    };
    prepositions: {
      score: number;
      errors: string[];
      examples: string[];
    };
  };
}

interface VocabularyAnalysis {
  overall: number;
  details: {
    range: {
      score: number;
      level: string;
      suggestions: string[];
    };
    appropriateness: {
      score: number;
      feedback: string[];
    };
    collocations: {
      score: number;
      correct: string[];
      incorrect: string[];
    };
    idiomaticExpressions: {
      score: number;
      mastered: string[];
      toLearn: string[];
    };
  };
}

interface FluencyAnalysis {
  overall: number;
  details: {
    speakingRate: {
      score: number;
      wordsPerMinute: number;
      target: number;
    };
    pauses: {
      score: number;
      appropriate: number;
      inappropriate: number;
      suggestions: string[];
    };
    fillers: {
      score: number;
      common: string[];
      alternatives: string[];
    };
    coherence: {
      score: number;
      feedback: string[];
    };
  };
}

interface ComprehensionAnalysis {
  overall: number;
  details: {
    listeningAccuracy: {
      score: number;
      missedPoints: string[];
    };
    responseRelevance: {
      score: number;
      feedback: string[];
    };
    contextualUnderstanding: {
      score: number;
      observations: string[];
    };
    criticalThinking: {
      score: number;
      strengths: string[];
      areasToImprove: string[];
    };
  };
}

interface Recommendation {
  id: string;
  type: 'practice' | 'resource' | 'exercise';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string;
  expectedOutcome: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt: string;
}

export function EnhancedAIFeedback({
  studentAge,
  feedback,
  onRecommendationSelect
}: EnhancedAIFeedbackProps) {
  // Map feedback categories to their corresponding icons
  const categoryIcons = {
    pronunciation: <Mic className="h-5 w-5" />,
    grammar: <BookOpen className="h-5 w-5" />,
    vocabulary: <Languages className="h-5 w-5" />,
    fluency: <Gauge className="h-5 w-5" />,
    comprehension: <Brain className="h-5 w-5" />,
    achievements: <Trophy className="h-5 w-5" />,
    improvement: <Sparkles className="h-5 w-5" />,
    excellence: <Star className="h-5 w-5" />
  };

  const getAgeAppropriateExplanation = (text: string) => {
    if (studentAge <= 6) {
      // Simplify language for young children
      return text
        .replace(/pronunciation/g, 'way of saying words')
        .replace(/grammar/g, 'word order')
        .replace(/vocabulary/g, 'words you know')
        .replace(/fluency/g, 'smooth talking')
        .replace(/comprehension/g, 'understanding');
    }
    return text;
  };

  const renderMetricCard = (title: string, score: number, category: keyof typeof categoryIcons, details: any) => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-md flex items-center gap-2">
            {categoryIcons[category]}
            {title}
          </CardTitle>
          <div>
            <span className="text-2xl font-bold">{Math.round(score)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={score} className="h-2" />
          <div className="grid gap-2">
            {Object.entries(details).map(([key, value]: [string, any]) => (
              <div key={key} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="font-medium">{value.score}%</span>
                </div>
                {value.feedback && (
                  <ul className="mt-1 space-y-1">
                    {value.feedback.map((item: string, index: number) => (
                      <li key={index} className="text-xs text-muted-foreground">
                        • {getAgeAppropriateExplanation(item)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Learning Analysis</h2>
                <p className="text-sm text-muted-foreground">
                  Detailed feedback and recommendations
                </p>
              </div>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(feedback).slice(0, 5).map(([key, value]: [string, any]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold mb-1">
                  {Math.round(value.overall)}%
                </div>
                <div className="text-sm text-muted-foreground capitalize">
                  {key}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderMetricCard(
          'Pronunciation',
          feedback.pronunciation.overall,
          'pronunciation',
          feedback.pronunciation.details
        )}
        {renderMetricCard(
          'Grammar',
          feedback.grammar.overall,
          'grammar',
          feedback.grammar.details
        )}
        {renderMetricCard(
          'Vocabulary',
          feedback.vocabulary.overall,
          'vocabulary',
          feedback.vocabulary.details
        )}
        {renderMetricCard(
          'Fluency',
          feedback.fluency.overall,
          'fluency',
          feedback.fluency.details
        )}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <CardTitle>Personalized Recommendations</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {feedback.recommendations.map((recommendation) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card
                  className={cn(
                    "cursor-pointer hover:shadow-lg transition-all",
                    recommendation.priority === 'high' && "border-red-200 bg-red-50/50",
                    recommendation.priority === 'medium' && "border-yellow-200 bg-yellow-50/50",
                    recommendation.priority === 'low' && "border-green-200 bg-green-50/50"
                  )}
                  onClick={() => onRecommendationSelect?.(recommendation.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Wand2 className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <h3 className="font-medium">{recommendation.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getAgeAppropriateExplanation(recommendation.description)}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="text-muted-foreground">
                            ⏱️ {recommendation.timeEstimate}
                          </span>
                          <span className="text-muted-foreground">
                            🎯 {recommendation.expectedOutcome}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <CardTitle>Recent Achievements</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {feedback.achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="text-center p-4">
                  <div className="flex flex-col items-center gap-2">
                    {achievement.icon}
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                    <div className="text-xs text-muted-foreground mt-2">
                      🏆 Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 