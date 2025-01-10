'use client';

import { useState } from 'react';
import { ChevronDown, BookOpen, GraduationCap, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLesson, useTeacherData } from '@/hooks/useApiQueries';  

interface SidebarProps {
  course: any;
  onSelectExercise: (exerciseId: string) => void;
}

export function Sidebar({ course, onSelectExercise }: SidebarProps) {
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data: lessonData } = useLesson(selectedLesson as string);
  // const { data: teacherData } = useTeacherData('mrmftgf6ooqptvw7hu8ki8uy');

  // const toggleLesson = (lessonId: string) => {
  //   setExpandedLessons((prev) =>
  //     prev.includes(lessonId)
  //       ? prev.filter((id) => id !== lessonId)
  //       : [...prev, lessonId]
  //   );
  //   setSelectedLesson(lessonId);
  // };

  console.log(lessonData, "lessonData")

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">{course?.name}</h2>
        {/* {teacherData?.data?.[0]?.attributes?.name && (
          <p className="text-sm text-muted-foreground mt-1">
            {teacherData.data[0].attributes.name}
          </p>
        )} */}
      </div>
      <div className="flex-1">
        <div className="p-4">
          {course?.lessons?.map((lesson: any) => (
            <div key={lesson.documentId} className="mb-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                // onClick={() => toggleLesson(lesson.documentId)}
              >
                <ChevronDown
                  className={cn(
                    'mr-2 h-4 w-4 transition-transform',
                    expandedLessons.includes(lesson.documentId) ? 'transform rotate-180' : ''
                  )}
                />
                <BookOpen className="mr-2 h-4 w-4" />
                {lesson.title}
              </Button>
              
              {expandedLessons.includes(lesson.documentId) && lessonData?.data && (
                <div className="ml-6 mt-2 space-y-2">
                  {lessonData.data.exercises?.map((exercise: any) => (
                    <Button
                      key={exercise.documentId}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        onSelectExercise(exercise.documentId);
                        setIsMobileOpen(false);
                      }}
                    >
                      <GraduationCap className="mr-2 h-4 w-4" />
                      {exercise.title}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // Mobile sidebar
  const MobileSidebar = () => (
    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex md:w-80 md:flex-col border-r bg-card h-screen">
      <SidebarContent />
    </div>
  );

  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
}