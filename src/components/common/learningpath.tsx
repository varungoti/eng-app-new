'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Unlock, ChevronRight, ChevronDown, BookOpen, Star, Trophy, Target } from 'lucide-react'
import { cn } from "@/lib/utils"
import Link from 'next/link'

interface Topic {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: string;
  progress: number;
  unlocked: boolean;
  subtopics: Subtopic[];
}

interface Subtopic {
  id: number;
  title: string;
  description: string;
  progress: number;
  unlocked: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  type: 'practice' | 'vocabulary' | 'exam' | 'activity';
  duration: number;
  unlocked: boolean;
  completed: boolean;
  content: LessonContent[];
}

interface LessonContent {
  id: number;
  type: 'text' | 'media' | 'activity' | 'question' | 'interactive';
  content: string;
  mediaUrl?: string;
  options?: string[];
  correctAnswer?: string;
  points?: number;
}

export function LearningPath() {
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState<number | null>(null);

  const [topics] = useState<Topic[]>([
    {
      id: 1,
      title: "Basic Grammar",
      description: "Learn fundamental English grammar rules",
      color: "bg-blue-500",
      icon: "BookOpen",
      progress: 60,
      unlocked: true,
      subtopics: [
        {
          id: 1,
          title: "Nouns and Pronouns",
          description: "Understanding naming words and their replacements",
          progress: 80,
          unlocked: true,
          lessons: [
            {
              id: 1,
              title: "Types of Nouns",
              type: "practice",
              duration: 20,
              unlocked: true,
              completed: true,
              content: [
                {
                  id: 1,
                  type: "text",
                  content: "Let's learn about different types of nouns!",
                  points: 5
                },
                {
                  id: 2,
                  type: "media",
                  content: "Watch this video about nouns:",
                  mediaUrl: "/videos/nouns.mp4",
                  points: 10
                }
              ]
            },
            {
              id: 2,
              title: "Personal Pronouns",
              type: "vocabulary",
              duration: 15,
              unlocked: true,
              completed: false,
              content: []
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Reading Comprehension",
      description: "Improve your reading and understanding",
      color: "bg-green-500",
      icon: "BookOpen",
      progress: 30,
      unlocked: true,
      subtopics: [
        {
          id: 2,
          title: "Story Reading",
          description: "Practice reading short stories",
          progress: 40,
          unlocked: true,
          lessons: [
            {
              id: 3,
              title: "Short Story: The Red Apple",
              type: "practice",
              duration: 25,
              unlocked: true,
              completed: false,
              content: []
            }
          ]
        }
      ]
    }
  ]);

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="h-6 w-6 text-white" />;
      case 'Star':
        return <Star className="h-6 w-6 text-white" />;
      case 'Trophy':
        return <Trophy className="h-6 w-6 text-white" />;
      default:
        return <Target className="h-6 w-6 text-white" />;
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {topics.map((topic) => (
        <motion.div key={topic.id} variants={itemVariants}>
          <Card className={cn(
            "overflow-hidden transition-all duration-300",
            topic.unlocked ? "hover:shadow-lg" : "opacity-75"
          )}>
            <CardHeader className={cn(topic.color, "text-white")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    {getTopicIcon(topic.icon)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{topic.title}</CardTitle>
                    <p className="text-sm text-white/80">{topic.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  {expandedTopic === topic.id ? (
                    <ChevronDown className="h-6 w-6" />
                  ) : (
                    <ChevronRight className="h-6 w-6" />
                  )}
                </button>
              </div>
              <Progress value={topic.progress} className="mt-4 bg-white/30" />
            </CardHeader>
            <AnimatePresence>
              {expandedTopic === topic.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {topic.subtopics.map((subtopic) => (
                        <motion.div
                          key={subtopic.id}
                          variants={itemVariants}
                          className="space-y-4"
                        >
                          <Card className="border border-gray-200 dark:border-gray-800">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <CardTitle className="text-xl">{subtopic.title}</CardTitle>
                                  <p className="text-sm text-muted-foreground">
                                    {subtopic.description}
                                  </p>
                                </div>
                                <button
                                  onClick={() => setExpandedSubtopic(expandedSubtopic === subtopic.id ? null : subtopic.id)}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                >
                                  {expandedSubtopic === subtopic.id ? (
                                    <ChevronDown className="h-5 w-5" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5" />
                                  )}
                                </button>
                              </div>
                              <Progress value={subtopic.progress} className="mt-4" />
                            </CardHeader>
                            <AnimatePresence>
                              {expandedSubtopic === subtopic.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <CardContent className="pt-4">
                                    <div className="grid gap-4">
                                      {subtopic.lessons.map((lesson) => (
                                        <motion.div
                                          key={lesson.id}
                                          variants={itemVariants}
                                          whileHover={{ scale: 1.02 }}
                                          whileTap={{ scale: 0.98 }}
                                        >
                                          <Link href={`/teacher/my-class/lesson/${lesson.id}`}>
                                            <Card className={cn(
                                              "cursor-pointer transition-all",
                                              lesson.unlocked ? "hover:shadow-md" : "opacity-75"
                                            )}>
                                              <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                      "p-2 rounded-lg",
                                                      lesson.completed ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                                    )}>
                                                      {lesson.completed ? (
                                                        <Trophy className="h-5 w-5" />
                                                      ) : (
                                                        <BookOpen className="h-5 w-5" />
                                                      )}
                                                    </div>
                                                    <div>
                                                      <h3 className="font-medium">{lesson.title}</h3>
                                                      <p className="text-sm text-muted-foreground">
                                                        {lesson.type} • {lesson.duration} min
                                                      </p>
                                                    </div>
                                                  </div>
                                                  {lesson.unlocked ? (
                                                    <Unlock className="h-5 w-5 text-green-500" />
                                                  ) : (
                                                    <Lock className="h-5 w-5" />
                                                  )}
                                                </div>
                                              </CardContent>
                                            </Card>
                                          </Link>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}