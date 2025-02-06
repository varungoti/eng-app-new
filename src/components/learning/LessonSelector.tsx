import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Layers,
  BookOpenCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Topic {
  id: string;
  title: string;
  subtopics: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      description: string;
      duration: number;
      completed: boolean;
    }[];
  }[];
}

interface LessonSelectorProps {
  onLessonSelect: (lessonId: string, grade: string, topic: string, subtopic: string) => void;
  currentGrade: string;
}

export function LessonSelector({ onLessonSelect, currentGrade }: LessonSelectorProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);

  // Mock data - replace with API call
  const topics: Topic[] = [
    {
      id: '1',
      title: 'Grammar',
      subtopics: [
        {
          id: '1-1',
          title: 'Adjectives',
          lessons: [
            {
              id: 'l-1-1-1',
              title: 'Describing Words',
              description: 'Learn how to use adjectives to describe things',
              duration: 30,
              completed: false
            },
            {
              id: 'l-1-1-2',
              title: 'Comparing Things',
              description: 'Learn about comparative and superlative adjectives',
              duration: 45,
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Reading',
      subtopics: [
        {
          id: '2-1',
          title: 'Stories',
          lessons: [
            {
              id: 'l-2-1-1',
              title: 'Short Stories',
              description: 'Read and understand simple stories',
              duration: 40,
              completed: false
            }
          ]
        }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const currentTopic = topics.find(t => t.id === selectedTopic);
  const currentSubtopic = currentTopic?.subtopics.find(s => s.id === selectedSubtopic);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Grade Indicator */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-6 py-3">
            <GraduationCap className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-medium">Grade {currentGrade}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Topics */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-500" />
              Topics
            </h2>
            {topics.map((topic) => (
              <motion.div
                key={topic.id}
                variants={itemVariants}
                onClick={() => setSelectedTopic(topic.id)}
                className={cn(
                  "cursor-pointer p-4 rounded-lg transition-all",
                  selectedTopic === topic.id
                    ? "bg-blue-500 text-white"
                    : "bg-white/70 dark:bg-gray-800/70 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{topic.title}</span>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Subtopics */}
          {selectedTopic && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                Subtopics
              </h2>
              {currentTopic?.subtopics.map((subtopic) => (
                <motion.div
                  key={subtopic.id}
                  variants={itemVariants}
                  onClick={() => setSelectedSubtopic(subtopic.id)}
                  className={cn(
                    "cursor-pointer p-4 rounded-lg transition-all",
                    selectedSubtopic === subtopic.id
                      ? "bg-purple-500 text-white"
                      : "bg-white/70 dark:bg-gray-800/70 hover:bg-purple-50 dark:hover:bg-purple-900/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subtopic.title}</span>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Lessons */}
          {selectedSubtopic && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-emerald-500" />
                Lessons
              </h2>
              {currentSubtopic?.lessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  variants={itemVariants}
                  className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {lesson.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <span>{lesson.duration} minutes</span>
                        {lesson.completed && (
                          <span className="text-green-500">• Completed</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => onLessonSelect(
                      lesson.id,
                      currentGrade,
                      currentTopic?.title || '',
                      currentSubtopic?.title || ''
                    )}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                  >
                    Start Lesson
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
} 