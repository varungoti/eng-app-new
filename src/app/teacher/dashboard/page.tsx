"use client";

import React from "react";
import Link from "next/link";
import { Book, Target, Zap, Trophy, Award, BarChart2 } from "lucide-react";
import DashboardStats from "@/components/teacher/DashboardStats";
import UpcomingClasses from "@/components/teacher/UpcomingClasses";
import StudentProgress from "@/components/teacher/StudentProgress";
import GradeOverview from "@/components/teacher/GradeOverview";
import OverallGradesOverview from "@/components/teacher/GradeOverview";
import TeacherStats from "@/components/teacher/TeacherStats";
import { useComponentLogger } from "@/hooks/useComponentLogger";

export default function TeacherDashboard() {
  const { logError } = useComponentLogger('TeacherDashboard');

  try {
    return (
      <div className="w-full min-h-screen flex flex-col lg:flex-row bg-gray-100 dark:bg-gray-900">
        {/* Main content area */}
        <main className="w-full flex-grow overflow-y-auto p-4 md:py-6 px-4 space-y-2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Hello! Teacher</h1>
            <p className="text-gray-600">
              Welcome back! Here's an overview of your teaching activities
            </p>
          </div>
      
          {/* DashboardStats Component */}
          <DashboardStats />
      
          {/* <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2  gap-6 mb-4"> */}
            {/* Upcoming Classes */}
            <UpcomingClasses />
          {/* </div> */}
      
          {/* Student Progress Component */}
          <div className="pt-4">
            <StudentProgress />
          </div>
        </main>
      
        {/* Sidebar */}
        <aside className="w-full lg:w-1/3 xl:w-1/2  md:px-2 py-4 px-0">
          <div className="sticky top-0 p-4 md:p-6">
            {/* TeacherStats Component */}
            <TeacherStats />
          </div>
        </aside>
      </div>
    );
  } catch (error) {
    logError(error);
    return <div>Error loading teacher dashboard</div>;
  }
}
