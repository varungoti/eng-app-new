"use client"

import React from 'react';
import Sidebar from '@/components/common/sidebar';
import Header from '@/components/common/Header/Header';
import RightSection from '@/components/common/right-section';
import { Home, AlignLeft, Trophy, Target, ShoppingBag, User, Sun, Moon, Book, Zap, BookOpen, Briefcase, Award, Mic } from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {


const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/student/dashboard" },
  { icon: Book, label: "Lessons", href: "/student/lessons" },
  { icon: Target, label: "Practice", href: "/student/practice" },
  { icon: BookOpen, label: "Grammar Guide", href: "/student/grammar-guide" },
  { icon: Briefcase, label: "Vocabulary", href: "/student/vocabulary" },
  { icon: Mic, label: "Spell Bee", href: "/student/spell-bee" },
  { icon: Zap, label: "AI Conversation", href: "/student/ai-conversation" },
  { icon: Trophy, label: "Leaderboard", href: "/student/leaderboard" },
  { icon: Award, label: "Achievements", href: "/student/achievements" },
];

  return (
    <div className="flex flex-col h-screen text-black dark:text-white bg-white dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        <nav className="hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 p-4 space-y-4">
          <Sidebar  sidebarItems={sidebarItems} className="w-full md:w-64 flex-shrink-0" currentPath="/student" />
        </nav> 
          <div className='flex w-full'>
            <main className="flex-1 overflow-auto ">
              {children}
            </main> 
          </div> 
      </div>
    </div>
  );
}