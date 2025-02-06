import React from 'react';
import Link from 'next/link';
import { Book, Target, Zap, Trophy, Award, BarChart2 } from 'lucide-react';

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, John!</h1>
      
      {/* Progress Overview */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ProgressCard title="Lessons Completed" value={42} icon={<Book className="w-8 h-8" />} />
          <ProgressCard title="Practice Sessions" value={28} icon={<Target className="w-8 h-8" />} />
          <ProgressCard title="Vocabulary Mastered" value={350} icon={<Zap className="w-8 h-8" />} />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <QuickActionCard title="Continue Learning" description="Resume your last lesson" href="/student/lessons" icon={<Book className="w-6 h-6" />} />
        <QuickActionCard title="Practice Now" description="Improve your skills" href="/student/practice" icon={<Target className="w-6 h-6" />} />
        <QuickActionCard title="AI Conversation" description="Chat with AI tutor" href="/student/ai-conversation" icon={<Zap className="w-6 h-6" />} />
      </section>

      {/* Recent Achievements */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Recent Achievements</h2>
        <div className="flex space-x-4">
          <AchievementBadge title="Grammar Master" icon={<Trophy className="w-8 h-8" />} />
          <AchievementBadge title="Vocabulary Expert" icon={<Award className="w-8 h-8" />} />
          <AchievementBadge title="5-Day Streak" icon={<BarChart2 className="w-8 h-8" />} />
        </div>
      </section>

      {/* Upcoming Lessons */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Lessons</h2>
        <ul className="space-y-2">
          <LessonItem title="Advanced Grammar: Conditionals" date="Tomorrow, 10:00 AM" />
          <LessonItem title="Vocabulary: Business Terms" date="Wed, 2:00 PM" />
          <LessonItem title="Speaking Practice: Job Interviews" date="Fri, 11:00 AM" />
        </ul>
      </section>
    </div>
  );
}

function ProgressCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      {icon}
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, href, icon }: { title: string; description: string; href: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">{icon}</div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </Link>
  );
}

function AchievementBadge({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full mb-2">{icon}</div>
      <span className="text-sm font-medium text-center">{title}</span>
    </div>
  );
}

function LessonItem({ title, date }: { title: string; date: string }) {
  return (
    <li className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <span className="font-medium">{title}</span>
      <span className="text-sm text-gray-600 dark:text-gray-400">{date}</span>
    </li>
  );
}