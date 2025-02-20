"use client";

import { LearningPathTeacher } from "@/components/common/learningpathTeacher";

export default function LessonsBackupPage() {
  return (
    <div className="w-full flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
      <main className="w-full flex-grow p-4 md:p-6">
        <LearningPathTeacher isBackup={true} />
      </main>
    </div>
  );
} 