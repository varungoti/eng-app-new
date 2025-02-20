"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Sparkles,
  Star,
  Trophy,
  Crown,
  Lightbulb,
  Rocket,
  Target,
  Zap,
  Timer,
  Gift,
  Medal,
  BookOpen,
  Mic
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillSpecificExerciseProps {
  skill: SkillType;
  level: 'beginner' | 'intermediate' | 'advanced';
  ageGroup: '4-6' | '7-9' | '10-13';
  onProgress: (progress: SkillProgress) => void;
}

type SkillType = 
  | 'phonological_awareness'
  | 'reading_fluency'
  | 'vocabulary_building'
  | 'grammar_mastery'
  | 'listening_comprehension'
  | 'speaking_fluency'
  | 'pronunciation_accuracy'
  | 'conversation_skills';

interface SkillProgress {
  skillLevel: number;
  accuracy: number;
  speed: number;
  consistency: number;
  achievements: Achievement[];
  powerUps: PowerUp[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlockedAt: string;
}

interface PowerUp {
  id: string;
  type: 'boost' | 'shield' | 'multiplier';
  effect: string;
  duration: number;
  active: boolean;
}

interface Exercise {
  type: string;
  title: string;
  description: string;
  gameMode?: {
    timeLimit?: number;
    points?: number;
    bonusRounds?: boolean;
    animation?: string;
    soundEffects?: boolean;
    flashCards?: boolean;
    timeChallenge?: boolean;
    treeGrowth?: boolean;
    rewards?: string[];
  };
  pairs?: { 
    word1: string; 
    word2: string; 
    image1?: string; 
    image2?: string; 
  }[];
  words?: string[];
  challenges?: { word: string; remove: string; becomes: string; }[];
  phrases?: string[];
  roots?: string[];
}

interface SkillExercises {
  [key: string]: {
    [level: string]: Exercise[];
  };
}

// Enhanced skill-specific exercises
const SKILL_EXERCISES: SkillExercises = {
  phonological_awareness: {
    beginner: [
      {
        type: 'rhyming_pairs',
        title: 'Rhyme Time',
        description: 'Find words that rhyme',
        pairs: [
          { word1: 'cat', word2: 'hat', image1: '/cat.png', image2: '/hat.png' },
          { word1: 'dog', word2: 'log', image1: '/dog.png', image2: '/log.png' }
        ],
        gameMode: {
          timeLimit: 30,
          points: 10,
          bonusRounds: true
        }
      },
      {
        type: 'syllable_counting',
        title: 'Syllable Hop',
        description: 'Count syllables in words',
        words: ['butterfly', 'cat', 'elephant', 'dog'],
        gameMode: {
          animation: 'hop',
          soundEffects: true
        }
      }
    ],
    intermediate: [
      {
        type: 'phoneme_deletion',
        title: 'Sound Detective',
        description: 'Remove sounds from words',
        challenges: [
          { word: 'smile', remove: 's', becomes: 'mile' },
          { word: 'plate', remove: 'l', becomes: 'pate' }
        ]
      }
    ]
  },
  reading_fluency: {
    beginner: [
      {
        type: 'sight_words',
        title: 'Speed Reader',
        description: 'Recognize common words quickly',
        words: ['the', 'and', 'is', 'in', 'it'],
        gameMode: {
          flashCards: true,
          timeChallenge: true
        }
      }
    ],
    intermediate: [
      {
        type: 'phrase_reading',
        title: 'Smooth Operator',
        description: 'Read phrases smoothly',
        phrases: [
          'in the morning',
          'under the tree',
          'around the corner'
        ]
      }
    ]
  },
  vocabulary_building: {
    beginner: [
      {
        type: 'word_families',
        title: 'Word Family Tree',
        description: 'Build word families',
        roots: ['play', 'help', 'walk'],
        gameMode: {
          treeGrowth: true,
          rewards: ['leaves', 'flowers', 'fruits']
        }
      }
    ],
    intermediate: [
      {
        type: 'synonym_matching',
        title: 'Word Twins',
        description: 'Match words with similar meanings',
        pairs: [
          { word1: 'happy', word2: 'glad' },
          { word1: 'big', word2: 'large' }
        ]
      }
    ]
  }
};

// Enhanced game mechanics
const GAME_MECHANICS = {
  powerUps: {
    'time_freeze': {
      duration: 10,
      effect: 'Pause the timer',
      icon: <Timer className="h-5 w-5" />
    },
    'point_boost': {
      duration: 30,
      effect: 'Double points',
      icon: <Zap className="h-5 w-5" />
    },
    'perfect_shield': {
      duration: 20,
      effect: 'Prevent mistakes',
      icon: <Target className="h-5 w-5" />
    }
  },
  rewards: {
    'speed_star': {
      condition: 'Complete under 30 seconds',
      bonus: 50,
      icon: <Star className="h-5 w-5" />
    },
    'accuracy_crown': {
      condition: '100% accuracy',
      bonus: 100,
      icon: <Crown className="h-5 w-5" />
    },
    'streak_medal': {
      condition: '5 perfect exercises in a row',
      bonus: 200,
      icon: <Medal className="h-5 w-5" />
    }
  },
  challenges: {
    'time_trial': {
      description: 'Complete as many as possible in 60 seconds',
      reward: 'Golden Timer'
    },
    'perfect_run': {
      description: 'Complete 10 exercises without mistakes',
      reward: 'Perfect Badge'
    },
    'speed_master': {
      description: 'Average completion time under 20 seconds',
      reward: 'Speed Wings'
    }
  }
};

export function SkillSpecificExercises({
  skill,
  level,
  ageGroup,
  onProgress
}: SkillSpecificExerciseProps) {
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [activePowerUps, setActivePowerUps] = useState<PowerUp[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const startExercise = (exercise: any) => {
    setCurrentExercise(exercise);
    // Initialize exercise-specific state and timers
  };

  const usePowerUp = (powerUp: PowerUp) => {
    setActivePowerUps(prev => [...prev, { ...powerUp, active: true }]);
    setTimeout(() => {
      setActivePowerUps(prev => 
        prev.map(p => p.id === powerUp.id ? { ...p, active: false } : p)
      );
    }, powerUp.duration * 1000);
  };

  const handleExerciseComplete = (result: any) => {
    // Update score and streak
    const basePoints = 100;
    const streakMultiplier = 1 + (streak * 0.1);
    const powerUpMultiplier = activePowerUps.reduce((acc, p) => 
      p.active && p.type === 'multiplier' ? acc * 2 : acc, 1
    );

    const points = basePoints * streakMultiplier * powerUpMultiplier;
    setScore(prev => prev + points);

    // Update streak
    if (result.accuracy > 80) {
      setStreak(prev => prev + 1);
      if (streak + 1 >= 5) {
        unlockAchievement('streak_master');
      }
    } else {
      setStreak(0);
    }

    // Check for achievements
    if (result.accuracy === 100) {
      unlockAchievement('perfect_score');
    }
    if (result.speed < 30) {
      unlockAchievement('speed_demon');
    }

    onProgress({
      skillLevel: Math.floor(score / 1000),
      accuracy: result.accuracy,
      speed: result.speed,
      consistency: streak / 5 * 100,
      achievements,
      powerUps: activePowerUps
    });
  };

  const unlockAchievement = (achievementId: string) => {
    const newAchievement = {
      id: achievementId,
      title: achievementId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: `Unlocked ${achievementId}!`,
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      unlockedAt: new Date().toISOString()
    };

    setAchievements(prev => [...prev, newAchievement]);
  };

  return (
    <div className="space-y-8">
      {/* Skill Progress */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Level {Math.floor(score / 1000)}</h2>
                <p className="text-sm text-muted-foreground">
                  {score} points • {streak} streak
                </p>
              </div>
            </div>
            {streak >= 3 && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-yellow-500">Hot Streak!</span>
              </div>
            )}
          </div>
          <Progress value={(score % 1000) / 10} className="h-2" />
        </CardContent>
      </Card>

      {/* Active Power-ups */}
      {activePowerUps.length > 0 && (
        <div className="flex gap-2">
          {activePowerUps.filter(p => p.active).map((powerUp) => (
            <Card key={powerUp.id} className="bg-primary/5">
              <CardContent className="p-2 flex items-center gap-2">
                {GAME_MECHANICS.powerUps[powerUp.type as keyof typeof GAME_MECHANICS.powerUps].icon}
                <span className="text-sm font-medium">{powerUp.effect}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SKILL_EXERCISES[skill]?.[level]?.map((exercise: Exercise, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => startExercise(exercise)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    {exercise.type.includes('reading') ? (
                      <BookOpen className="h-5 w-5 text-primary" />
                    ) : exercise.type.includes('speaking') ? (
                      <Mic className="h-5 w-5 text-primary" />
                    ) : (
                      <Lightbulb className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{exercise.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.description}
                    </p>
                  </div>
                </div>
                {exercise.gameMode && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {exercise.gameMode.timeLimit && (
                      <div className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        <span>{exercise.gameMode.timeLimit}s</span>
                      </div>
                    )}
                    {exercise.gameMode.points && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>{exercise.gameMode.points} pts</span>
                      </div>
                    )}
                    {exercise.gameMode.bonusRounds && (
                      <div className="flex items-center gap-1">
                        <Gift className="h-4 w-4" />
                        <span>Bonus Rounds</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <CardTitle>Achievements</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement) => (
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
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 