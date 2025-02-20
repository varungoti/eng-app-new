import React from 'react';
import { motion } from "framer-motion";
import { Star, Award, Target, Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  isUnlocked: boolean;
  color: string;
}

const achievements: Achievement[] = [
  {
    id: "1",
    title: "Grammar Master",
    description: "Complete all grammar lessons",
    icon: <Star className="h-6 w-6" />,
    progress: 75,
    isUnlocked: true,
    color: "text-yellow-500"
  },
  {
    id: "2",
    title: "Reading Champion",
    description: "Read 10 stories",
    icon: <Award className="h-6 w-6" />,
    progress: 60,
    isUnlocked: true,
    color: "text-blue-500"
  },
  {
    id: "3",
    title: "Vocabulary Expert",
    description: "Learn 100 new words",
    icon: <Target className="h-6 w-6" />,
    progress: 45,
    isUnlocked: false,
    color: "text-purple-500"
  },
  {
    id: "4",
    title: "Perfect Score",
    description: "Get 100% in any test",
    icon: <Trophy className="h-6 w-6" />,
    progress: 0,
    isUnlocked: false,
    color: "text-emerald-500"
  },
  {
    id: "5",
    title: "Quick Learner",
    description: "Complete 5 lessons in a day",
    icon: <Medal className="h-6 w-6" />,
    progress: 20,
    isUnlocked: false,
    color: "text-pink-500"
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

export function AchievementBadges() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {achievements.map((achievement) => (
        <motion.div
          key={achievement.id}
          variants={itemVariants}
          className={cn(
            "flex items-center gap-4 p-3 rounded-lg transition-all duration-200",
            achievement.isUnlocked
              ? "bg-white/70 dark:bg-gray-800/70"
              : "bg-gray-100/50 dark:bg-gray-900/50 opacity-70"
          )}
        >
          <div className={cn(
            "p-3 rounded-full",
            achievement.isUnlocked ? "bg-white dark:bg-gray-800" : "bg-gray-200 dark:bg-gray-700"
          )}>
            <div className={achievement.color}>
              {achievement.icon}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium truncate">{achievement.title}</h3>
              <span className="text-sm text-muted-foreground">
                {achievement.progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  achievement.isUnlocked ? "bg-gradient-to-r from-violet-500 to-purple-500" : "bg-gray-400 dark:bg-gray-600"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${achievement.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1 truncate">
              {achievement.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
} 