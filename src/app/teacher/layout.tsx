"use client"

import React from 'react';
import TeacherSidebar from "@/components/common/sidebar_teacher";
import {
  Layout,
  Users,
  Book,
  Activity,
  Award,
  MessageSquare,
  Calendar,
  Settings,
} from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

const sidebarItems = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/teacher/dashboard"
  },
  {
    icon: Users,
    label: "My Classes",
    href: "/teacher/my-class"
  },
  {
    icon: Book,
    label: "Lessons",
    href: "/teacher/lessons"
  },
  {
    icon: Activity,
    label: "Assessments",
    href: "/teacher/assessments"
  },
  {
    icon: Award,
    label: "Progress",
    href: "/teacher/progress"
  },
  {
    icon: MessageSquare,
    label: "AI Assistant",
    href: "/teacher/ai-assistant"
  },
  {
    icon: Calendar,
    label: "Schedule",
    href: "/teacher/schedule"
  },
  {
    icon: Settings,
    label: "Settings",
    href: "/teacher/settings"
  }
];

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <TeacherSidebar
        sidebarItems={sidebarItems}
        className="h-screen"
      />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}