import React from 'react';
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Card } from "@/components/ui/card";
import { Clock, Target, Zap } from "lucide-react";

const learningData = [
  { day: 'Mon', minutes: 45, lessons: 3, score: 85 },
  { day: 'Tue', minutes: 60, lessons: 4, score: 90 },
  { day: 'Wed', minutes: 30, lessons: 2, score: 88 },
  { day: 'Thu', minutes: 75, lessons: 5, score: 92 },
  { day: 'Fri', minutes: 50, lessons: 3, score: 87 },
  { day: 'Sat', minutes: 90, lessons: 6, score: 95 },
  { day: 'Sun', minutes: 40, lessons: 2, score: 89 }
];

const stats = [
  {
    id: 1,
    title: "Study Time",
    value: "6.5 hrs",
    description: "This week",
    icon: <Clock className="h-4 w-4" />,
    color: "text-blue-500"
  },
  {
    id: 2,
    title: "Lessons Completed",
    value: "25",
    description: "Total",
    icon: <Target className="h-4 w-4" />,
    color: "text-purple-500"
  },
  {
    id: 3,
    title: "Average Score",
    value: "89%",
    description: "All lessons",
    icon: <Zap className="h-4 w-4" />,
    color: "text-emerald-500"
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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export function LearningAnalytics() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            variants={itemVariants}
            className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <div className={stat.color}>{stat.icon}</div>
              <span className="text-sm font-medium">{stat.title}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.description}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={itemVariants}
        className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4"
      >
        <h3 className="text-sm font-medium mb-4">Learning Progress</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={learningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4"
      >
        <h3 className="text-sm font-medium mb-4">Daily Activity</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={learningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
} 