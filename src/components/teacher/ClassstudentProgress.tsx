import React from 'react';
import { TrendingUp } from 'lucide-react';

const students = [
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
];

export default function ClassStudentProgress() {
  return (
    <div className=" bg-white dark:bg-gray-900  rounded-xl shadow-sm border  border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Top Performing Students</h2>
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
              <h3 className="font-medium text-gray-900">{student.name}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>
            <span className="text-lg font-semibold text-gray-900">{student.progress}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}