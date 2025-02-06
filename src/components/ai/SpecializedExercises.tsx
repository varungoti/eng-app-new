"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Gamepad2,
  Sparkles,
  Star,
  Music,
  BookOpen,
  Mic,
  Image as ImageIcon,
  Puzzle,
  Brain,
  Trophy,
  Crown
} from "lucide-react";

interface SpecializedExerciseProps {
  ageGroup: '4-6' | '7-9' | '10-13';
  level: 'beginner' | 'intermediate' | 'advanced';
  onExerciseComplete: (result: ExerciseResult) => void;
}

interface ExerciseResult {
  score: number;
  metrics: {
    accuracy: number;
    speed: number;
    comprehension: number;
    creativity: number;
  };
  achievements: string[];
}

// Age-specific exercise configurations
const SPECIALIZED_EXERCISES = {
  '4-6': {
    phonics: {
      title: 'Letter Sounds Adventure',
      exercises: [
        {
          type: 'sound_matching',
          content: 'Match the letter with its sound',
          pairs: [
            { letter: 'A', sound: '/audio/a-sound.mp3', image: '/images/apple.png' },
            { letter: 'B', sound: '/audio/b-sound.mp3', image: '/images/ball.png' }
          ]
        },
        {
          type: 'word_building',
          content: 'Build simple words with sounds',
          words: ['cat', 'dog', 'sun', 'hat']
        }
      ],
      rewards: ['Sound Master', 'Word Builder']
    },
    visualLearning: {
      title: 'Picture Word Fun',
      exercises: [
        {
          type: 'picture_naming',
          content: 'Name what you see',
          images: ['/images/animals/', '/images/colors/', '/images/shapes/']
        },
        {
          type: 'memory_game',
          content: 'Remember and match pictures',
          difficulty: 1
        }
      ],
      rewards: ['Memory Master', 'Picture Perfect']
    }
  },
  '7-9': {
    sentenceBuilding: {
      title: 'Sentence Creator',
      exercises: [
        {
          type: 'sentence_arrangement',
          content: 'Arrange words to make sentences',
          sentences: [
            'The dog plays in the park',
            'I like to read books'
          ]
        },
        {
          type: 'story_completion',
          content: 'Complete the story',
          templates: ['Once upon a time...', 'Last summer...']
        }
      ],
      rewards: ['Story Weaver', 'Grammar Guru']
    },
    conversationPractice: {
      title: 'Talk & Learn',
      exercises: [
        {
          type: 'dialogue_practice',
          content: 'Practice conversations',
          scenarios: ['At School', 'Making Friends']
        },
        {
          type: 'role_play',
          content: 'Act out situations',
          roles: ['Student', 'Teacher', 'Friend']
        }
      ],
      rewards: ['Conversation Star', 'Role Play Master']
    }
  },
  '10-13': {
    criticalThinking: {
      title: 'Think & Speak',
      exercises: [
        {
          type: 'debate_preparation',
          content: 'Prepare and present arguments',
          topics: ['Technology in Schools', 'Environmental Protection']
        },
        {
          type: 'problem_solving',
          content: 'Solve and explain solutions',
          scenarios: ['Community Issues', 'School Improvements']
        }
      ],
      rewards: ['Critical Thinker', 'Problem Solver']
    },
    creativeExpression: {
      title: 'Creative Speaking',
      exercises: [
        {
          type: 'storytelling',
          content: 'Create and tell stories',
          themes: ['Future World', 'Adventure', 'Mystery']
        },
        {
          type: 'presentation',
          content: 'Present your ideas',
          topics: ['My Favorite Book', 'Dream Vacation']
        }
      ],
      rewards: ['Story Master', 'Presentation Pro']
    }
  }
};

// Game elements and rewards
const GAME_ELEMENTS = {
  streaks: {
    types: ['daily', 'weekly', 'perfect_score'],
    bonuses: {
      '3_day': 1.2,
      '7_day': 1.5,
      'perfect': 2.0
    }
  },
  powerUps: {
    'hint_boost': { duration: 60, effect: 'Extra hints available' },
    'time_freeze': { duration: 30, effect: 'More time to answer' },
    'point_multiplier': { duration: 45, effect: 'Double points' }
  },
  challenges: {
    daily: {
      type: 'Complete 3 exercises',
      reward: 'Special Badge'
    },
    weekly: {
      type: 'Maintain 5-day streak',
      reward: 'Premium Power-up'
    }
  }
};

export function SpecializedExercises({
  ageGroup,
  level,
  onExerciseComplete
}: SpecializedExerciseProps) {
  const exercises = SPECIALIZED_EXERCISES[ageGroup];
  
  // Guard clause for when exercises don't exist for the age group
  if (!exercises) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6 text-gray-500" />
          <div>
            <h3 className="font-medium">No exercises available</h3>
            <p className="text-sm text-muted-foreground">
              No exercises found for age group {ageGroup}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const renderExercise = (exercise: any) => {
    switch (exercise.type) {
      case 'sound_matching':
        return (
          <Card className="p-4 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <Music className="h-6 w-6 text-purple-500" />
              <div>
                <h3 className="font-medium">{exercise.content}</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {exercise.pairs.map((pair: any, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-20 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">{pair.letter}</span>
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        );

      case 'word_building':
        return (
          <Card className="p-4 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <Puzzle className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-medium">{exercise.content}</h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {exercise.words.map((word: string, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="px-6 py-8 text-lg"
                    >
                      {word.split('').map((letter, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="inline-block"
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        );

      case 'dialogue_practice':
      case 'role_play':
        return (
          <Card className="p-4 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <Mic className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="font-medium">{exercise.content}</h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {(exercise.scenarios || exercise.roles).map((item: string, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-24 relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-lg">{item}</span>
                        <Sparkles className="h-4 w-4" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        );

      case 'debate_preparation':
      case 'presentation':
        return (
          <Card className="p-4 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-indigo-500" />
              <div>
                <h3 className="font-medium">{exercise.content}</h3>
                <div className="space-y-4 mt-4">
                  {(exercise.topics || exercise.themes).map((topic: string, index: number) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full h-16 relative group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center justify-between w-full px-4">
                        <span className="text-lg">{topic}</span>
                        <Crown className="h-4 w-4" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(exercises).map(([key, category]: [string, any]) => (
        <div key={key} className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">{category.title}</h2>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="grid gap-4">
            {category.exercises.map((exercise: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {renderExercise(exercise)}
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 