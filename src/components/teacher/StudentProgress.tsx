"use client" 

import React, { useState } from 'react';
import { Users, BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';

const dashboardData = {
  grades: ['Grade 1', 'Grade 2', 'Grade 3'],
  stats: {
    totalStudents: 124,
    lessonsPlanned: 45,
    avgPerformance: 87,
    teachingHours: 156
  },
  classWiseData: {
    'Grade 1': {
      lessons: { planned: 15, completed: 10 },
      avgPerformance: 88,
      students: [
        { id: 1, name: 'Alice', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 90 },
        { id: 2, name: 'Bob', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 75 },
        { id: 3, name: 'Charlie', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 80 }
      ]
    },
    'Grade 2': {
      lessons: { planned: 18, completed: 14 },
      avgPerformance: 84,
      students: [
        { id: 4, name: 'Dave', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 78 },
        { id: 5, name: 'Eve', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 85 }
      ]
    },
    'Grade 3': {
      lessons: { planned: 12, completed: 9 },
      avgPerformance: 90,
      students: [
        { id: 6, name: 'Frank', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 95 },
        { id: 7, name: 'Grace', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 88 }
      ]
    }
  }
};

export default function DashboardStats() {
  const [selectedGrade, setSelectedGrade] = useState(dashboardData.grades[0]);

  // Retrieve data for the selected grade
  const gradeData = dashboardData.classWiseData[selectedGrade];
  const lessonCompletionPercentage = Math.round((gradeData.lessons.completed / gradeData.lessons.planned) * 100);

  return (
    <div className="space-y-4">
      {/* Grade Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-800">
        {dashboardData.grades.map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`pb-2 text-lg font-semibold ${
              selectedGrade === grade
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600'
            }`}
          >
            {grade}
          </button>
        ))}
      </div> 

      {/* Lesson Completion Progress Bar */}
      <div className=" bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-2">Lesson Completion</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Completed: {gradeData.lessons.completed} / {gradeData.lessons.planned}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${lessonCompletionPercentage}%` }}
          />
        </div>
        <p className="mt-1 text-indigo-600 font-medium">
          {lessonCompletionPercentage}%
        </p>
      </div>

      {/* Top Performing Students */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Performing Students</h2>
          <TrendingUp className="h-5 w-5 text-gray-500" />
        </div>
        
        <div className="space-y-4">
          {gradeData.students.map((student) => (
            <div key={student.id} className="flex items-center gap-4">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{student.name}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${student.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {student.progress}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
