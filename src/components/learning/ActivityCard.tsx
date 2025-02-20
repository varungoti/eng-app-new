import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PlayCircle, RotateCcw, Clock, BookOpen, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: {
    id: string;
    title: string;
    description: string;
    duration: number;
    type: string;
    lesson_id: string;
    created_at: string;
    name: string;
  };
  isCompleted: boolean;
  onStart: () => void;
  onReview: () => void;
}

export function ActivityCard({ activity, isCompleted, onStart, onReview }: ActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg",
        isCompleted ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" : 
                     "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
      )}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-3 rounded-xl",
                isCompleted ? "bg-green-500" : "bg-blue-500"
              )}>
                {isCompleted ? (
                  <CheckCircle className="h-6 w-6 text-white" />
                ) : (
                  <BookOpen className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <CardTitle className="text-xl">{activity.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{activity.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm">{activity.duration} min</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            {activity.description}
          </p>
          <div className="flex gap-3">
            <Button
              className={cn(
                "flex-1 transition-all",
                isCompleted ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"
              )}
              onClick={isCompleted ? onReview : onStart}
            >
              {isCompleted ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Review
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 