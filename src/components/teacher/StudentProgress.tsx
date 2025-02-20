"use client"

import React, { useEffect, useState } from 'react';
import { Users, BookOpen, Trophy, Clock, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';

interface GradeData {
  lessons: { planned: number; completed: number };
  avgPerformance: number;
  students: Array<{
    id: number;
    name: string;
    avatar: string;
    progress: number;
  }>;
}

interface ClassWiseData {
  [key: string]: GradeData;
}

export default function StudentProgress() {
  const [grades, setGrades] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [classWiseData, setClassWiseData] = useState<ClassWiseData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const { data, error } = await supabase
          .from('grades')
          .select('name');

        if (error) throw error;

        const gradeNames = data?.map(g => g.name) || [];
        setGrades(gradeNames);
        if (gradeNames.length > 0) {
          setSelectedGrade(gradeNames[0]);
        }

        // Initialize with mock data for now
        const mockClassWiseData: ClassWiseData = {
          'Grade 1': {
            lessons: { planned: 15, completed: 10 },
            avgPerformance: 88,
            students: [
              { id: 1, name: 'Alice', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 90 },
              { id: 2, name: 'Bob', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 75 },
            ]
          },
          'Grade 2': {
            lessons: { planned: 18, completed: 14 },
            avgPerformance: 84,
            students: [
              { id: 4, name: 'Dave', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 78 },
              { id: 5, name: 'Eve', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', progress: 85 }
            ]
          }
        };
        setClassWiseData(mockClassWiseData);
      } catch (err) {
        console.error('Error fetching grades:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Error: {error}
      </div>
    );
  }

  // Add null check and default value
  const gradeData = selectedGrade ? (classWiseData[selectedGrade] || {
    lessons: { planned: 0, completed: 0 },
    avgPerformance: 0,
    students: []
  }) : {
    lessons: { planned: 0, completed: 0 },
    avgPerformance: 0,
    students: []
  };
  
  const lessonCompletionPercentage = Math.round((gradeData.lessons.completed / gradeData.lessons.planned) * 100) || 0;

  return (
    <div className="space-y-4">
      {/* Grade Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-800">
        {grades.map((grade) => (
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
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-semibold mb-2">Lesson Completion</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Completed: {gradeData.lessons.completed} / {gradeData.lessons.planned}
        </p>
        <Progress 
          value={lessonCompletionPercentage} 
          className="mt-2"
        />
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
                <Progress 
                  value={student.progress}
                  className="mt-2"
                />
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
