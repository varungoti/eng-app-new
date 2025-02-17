"use client"

import React from 'react';
import TeacherSidebar from "@/components/common/sidebar_teacher";
import { Toaster } from "@/components/ui/toaster";
import { Outlet } from 'react-router-dom';

export default function TeacherLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <main className="flex-1 overflow-x-hidden">
        <div className="container mx-auto px-4 py-6 max-w-[1600px]">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}