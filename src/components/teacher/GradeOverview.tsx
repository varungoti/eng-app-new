import React from 'react';
import { Users, BookOpen, Trophy, Clock } from 'lucide-react';

// Data structure for the overall stats
const overallGradesData = {
  totalStudents: 334, // Sum of all students across all grades
  totalLessonsPlanned: 123, // Sum of all lessons planned across all grades
  avgPerformance: 87, // Average performance across all grades
  totalTeachingHours: 446, // Sum of all teaching hours across all grades
  totalLessonsCompleted: 104, // Sum of all completed lessons across all grades
  lessonCompletionProgress: 85 // Overall lesson completion progress
};

// Dynamic labels
const labels = {
  totalStudents: 'Total Students',
  totalLessonsPlanned: 'Total Lessons Planned',
  avgPerformance: 'Avg. Performance',
  totalTeachingHours: 'Total Teaching Hours',
  lessonCompletion: 'Overall Lesson Completion',
  completedLessons: 'Completed Lessons'
};

export default function OverallGradesOverview() {
  return (
    <div className="space-y-2 mb-2">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {overallGradesData.totalStudents}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{labels.totalStudents}</p>
        </div>

        {/* Total Lessons Planned */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {overallGradesData.totalLessonsPlanned}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{labels.totalLessonsPlanned}</p>
        </div>

        {/* Average Performance */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {overallGradesData.avgPerformance}%
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{labels.avgPerformance}</p>
        </div>

        {/* Total Teaching Hours */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {overallGradesData.totalTeachingHours}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{labels.totalTeachingHours}</p>
        </div>
      </div>

      <div className="space-y-4 bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-2">{labels.lessonCompletion}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {labels.completedLessons}: {overallGradesData.totalLessonsCompleted} / {overallGradesData.totalLessonsPlanned}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${overallGradesData.lessonCompletionProgress}%` }}
          />
        </div>
        <p className="mt-1 text-indigo-600 font-medium">
          {overallGradesData.lessonCompletionProgress}%
        </p>
      </div>
    </div>
  );
}
