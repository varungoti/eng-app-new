"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActivityCard } from "./ActivityCard";
import { ResourcesSection } from "./ResourcesSection";
import { AchievementBadges } from "./AchievementBadges";
import { LearningAnalytics } from "./LearningAnalytics";
import { useLearning, Activity } from "@/hooks/useLearning";
import { Brain, Rocket, Trophy, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

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
    transition: {
      duration: 0.5
    }
  }
};

export function LearningDashboard() {
  const { activities, completedActivities, startActivity, reviewActivity } = useLearning();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-slate-900 p-6 space-y-8"
    >
      <header className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-full"
        >
          <Brain className="h-8 w-8 text-white" />
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          Your Learning Journey
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          Embark on an exciting adventure of knowledge and growth. Track your progress and achieve your goals!
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Rocket className="h-6 w-6 text-blue-500" />
                <CardTitle>Current Activities</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  isCompleted={completedActivities.includes(activity.id)}
                  onStart={() => startActivity(activity.id)}
                  onReview={() => reviewActivity(activity.id)}
                />
              ))}
            </CardContent>
          </Card>

          <ResourcesSection />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6">
          <Card className={cn(
            "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
            "backdrop-blur-sm shadow-xl"
          )}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-purple-500" />
                <CardTitle>Your Achievements</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <AchievementBadges />
            </CardContent>
          </Card>

          <Card className={cn(
            "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20",
            "backdrop-blur-sm shadow-xl"
          )}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-emerald-500" />
                <CardTitle>Learning Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <LearningAnalytics />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
} 