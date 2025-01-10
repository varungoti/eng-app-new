import React from 'react';
import { Calendar } from 'lucide-react';

const classes = [
  {
    id: 1,
    subject: 'English Literature',
    time: '09:00 AM',
    students: 28,
    topic: 'Shakespeare: Romeo & Juliet',
    room: 'Room 101',
  },
  {
    id: 2,
    subject: 'Creative Writing',
    time: '11:30 AM',
    students: 24,
    topic: 'Character Development',
    room: 'Room 203',
  },
  {
    id: 3,
    subject: 'Grammar Fundamentals',
    time: '02:00 PM',
    students: 26,
    topic: 'Advanced Verb Tenses',
    room: 'Room 105',
  },
];

export default function UpcomingClasses() {
  return (
    <div className=" border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Upcoming Classes</h2>
        <Calendar className="h-5 w-5 text-gray-500" />
      </div>
      
      <div className="space-y-4">
        {classes.map((cls) => (
          <div key={cls.id} className="flex items-center justify-between p-4 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{cls.subject}</h3>
              <p className="text-sm text-gray-600">{cls.topic}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{cls.time}</span>
                <span>•</span>
                <span>{cls.room}</span>
                <span>•</span>
                <span>{cls.students} students</span>
              </div>
            </div>
            {/* <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Start Class
            </button>  */}
          </div>
        ))}
      </div>
    </div>
  );
}