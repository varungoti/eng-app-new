'use client';
import { LearningPath } from "@/components/common/learningpath";
import SidebarDashboard from "@/components/common/sidebar-student";

export default function LessonsPage() {
  return (
   <div className="w-full min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
   {/* Main content area */}
   <main className="w-full flex-grow overflow-y-auto p-4 md:p-6">
    <LearningPath />
   </main>

   {/* Sidebar */}
   <aside className="w-full max-w-lg">
     <div className="sticky top-0 p-4 md:p-6">
       <SidebarDashboard />
     </div>
   </aside>
 </div>
  );
}
