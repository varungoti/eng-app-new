"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Brain,
  Sparkles,
  Star,
  Trophy,
  Crown,
  Lightbulb,
  Rocket,
  Target,
  Zap
} from "lucide-react";

export interface SpecializedActivityProps {
  studentAge: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  onActivityComplete: (result: ActivityResult) => void;
}

interface ActivityResult {
  skillName: string;
  score: number;
  accuracy: number;
  completedExercises: number;
  timeSpent: number;
  recommendations: string[];
}

const SPECIALIZED_ACTIVITIES = {
  'phonological-awareness': {
    title: 'Sound Play',
    description: 'Develop awareness of sounds in words',
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
    exercises: [
      'Rhyming Words',
      'Sound Blending',
      'Sound Segmentation'
    ]
  },
  'vocabulary-building': {
    title: 'Word Explorer',
    description: 'Expand vocabulary through interactive exercises',
    icon: <BookOpen className="h-6 w-6 text-primary" />,
    exercises: [
      'Word Families',
      'Synonyms and Antonyms',
      'Context Clues'
    ]
  },
  'reading-comprehension': {
    title: 'Story Detective',
    description: 'Enhance reading comprehension skills',
    icon: <Brain className="h-6 w-6 text-primary" />,
    exercises: [
      'Main Idea Finding',
      'Detail Spotting',
      'Making Inferences'
    ]
  }
};

export function SpecializedActivities({
  studentAge,
  skillLevel,
  onActivityComplete
}: SpecializedActivityProps) {
  const [currentActivity, setCurrentActivity] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  const startActivity = (activityKey: string) => {
    setCurrentActivity(activityKey);
    setProgress(0);
    // Initialize activity-specific state
  };

  const completeActivity = () => {
    const result: ActivityResult = {
      skillName: currentActivity || '',
      score: score,
      accuracy: Math.random() * 100, // Replace with actual accuracy calculation
      completedExercises: 5, // Replace with actual count
      timeSpent: 300, // Replace with actual time tracking
      recommendations: [
        'Practice more rhyming words',
        'Try advanced vocabulary exercises',
        'Focus on reading speed'
      ]
    };
    onActivityComplete(result);
    setCurrentActivity(null);
  };

  const getAgeAppropriateActivities = () => {
    if (studentAge >= 4 && studentAge <= 6) {
      return ['phonological-awareness'];
    } else if (studentAge >= 7 && studentAge <= 9) {
      return ['phonological-awareness', 'vocabulary-building'];
    } else {
      return ['phonological-awareness', 'vocabulary-building', 'reading-comprehension'];
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Specialized Activities</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Age: {studentAge} • Level: {skillLevel}
                </p>
              </div>
            </div>
            {achievements.length > 0 && (
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-bold">{achievements.length} Achievements</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentActivity ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {SPECIALIZED_ACTIVITIES[currentActivity as keyof typeof SPECIALIZED_ACTIVITIES].title}
                </h3>
                <Button variant="outline" onClick={completeActivity}>
                  Complete Activity
                </Button>
              </div>
              <Progress value={progress} className="h-2" />
              <Card className="p-6">
                <div className="space-y-4">
                  {SPECIALIZED_ACTIVITIES[currentActivity as keyof typeof SPECIALIZED_ACTIVITIES].exercises.map((exercise, index) => (
                    <motion.div
                      key={exercise}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Target className="h-5 w-5 text-primary" />
                            <span>{exercise}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setProgress((prev) => Math.min(prev + 20, 100))}
                          >
                            Start Exercise
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getAgeAppropriateActivities().map((activityKey) => {
                const activity = SPECIALIZED_ACTIVITIES[activityKey as keyof typeof SPECIALIZED_ACTIVITIES];
                return (
                  <motion.div
                    key={activityKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => startActivity(activityKey)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          {activity.icon}
                          <div>
                            <h3 className="font-medium">{activity.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 