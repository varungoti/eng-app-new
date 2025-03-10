"use client"

import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';

interface StudentProgress {
  id: number;
  name: string;
  avatar: string;
  progress: number;
  trend: 'up' | 'down' | 'stable';
}

export default function ClassStudentProgress() {
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentProgress = async () => {
      try {
        // For now, using mock data until we have the actual student progress tracking
        setStudents([
          {
            id: 1,
            name: 'Emma Thompson',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            progress: 92,
            trend: 'up',
          },
          {
            id: 2,
            name: 'Michael Chen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            progress: 88,
            trend: 'up',
          },
          {
            id: 3,
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
            progress: 85,
            trend: 'stable',
          },
        ]);
      } catch (err) {
        console.error('Error fetching student progress:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProgress();
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

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Top Performing Students</h2>
        <TrendingUp className="h-5 w-5 text-gray-500" />
      </div>
      
      <div className="space-y-4">
        {students.map((student) => (
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
  );
}