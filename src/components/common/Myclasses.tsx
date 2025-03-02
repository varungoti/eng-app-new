"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import { classesData, lessonsData } from "@/data/mockData";
import { Icon } from '@/components/ui/icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ClassHeader from "./ClassHeader";
import Link from "next/link";
import { Lock, Unlock } from "lucide-react";

interface SubLesson {
  id: number;
  title: string;
  unlocked: boolean;
  completed?: boolean;
  duration?: number;
  description?: string;
}

interface ExtendedClass {
  id: number;
  name: string;
  schedule: string;
  students: number;
  gradeLevel?: string;
  createdAt?: Date;
  maxStudents?: number;
  lessonIds?: number[];
  assignments?: number[];
  studentIds?: number[];
}

interface ExtendedLesson {
  id: number;
  classId: number;
  title: string;
  topic: string;
  duration: number;
  lessonNumber: string;
  totalTopics: string;
  difficulty: string;
  color: string;
  unlocked: boolean;
  completed: boolean;
  subLessons: SubLesson[];
}

interface MyClassesProps {
  data?: any;
}

export function MyClasses({ data }: MyClassesProps) {
  const [lessons, setLessons] = useState<ExtendedLesson[]>(lessonsData);
  const [selectedClass, setSelectedClass] = useState<ExtendedClass>(classesData[0]);
  const [selectedLesson, setSelectedLesson] = useState<ExtendedLesson>(lessonsData[0]);
  const [selectedSubLesson, setSelectedSubLesson] = useState<SubLesson | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<ExtendedLesson | null>(null);

  const handleClassChange = (classData: ExtendedClass) => {
    setSelectedClass(classData);
    console.log(classData, "classData");
    if (classData) {
      const filteredLessons = lessonsData.filter(
        (lesson) => lesson.classId === classData?.id
      );
      setLessons(filteredLessons);
    }
  };

  const handleSubLessonClick = (
    e: React.MouseEvent,
    subLesson: SubLesson,
    lesson: ExtendedLesson
  ) => {
    e.preventDefault();
    setSelectedSubLesson(subLesson);
    setCurrentLesson(lesson);
    setDialogOpen(true);
  };

  const handleStartLesson = (lessonId: number, subLessonId: number) => {
    setDialogOpen(false);
    window.location.href = `/lesson/${lessonId}/${subLessonId}`;
  };

  const handleRestartLesson = (lessonId: number, subLessonId: number) => {
    setDialogOpen(false);
    window.location.href = `/lesson/${lessonId}/${subLessonId}?restart=true`;
  };

  const lessonRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lessonInView = lessons.find(
              (lesson) => lesson.id === parseInt(entry.target.id)
            );
            if (lessonInView) {
              setSelectedLesson(lessonInView);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-05% 0px -85% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const currentRefs = lessonRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [lessons]);

  return (
    <div className="max-w-6xl w-full relative">
      <ClassHeader
        classes={classesData}
        selectedClass={selectedClass}
        onClassChange={handleClassChange as any}
      />
      
      <Card className="text-gray-700 bg-white bg-opacity-15 rounded-3xl mb-4 border-0 shadow">
        <CardHeader>
          <CardTitle className="text-2xl">{selectedClass?.name}</CardTitle>
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Icon type="phosphor" name="USERS" className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-medium">
                {selectedClass?.studentIds?.length ?? 0}/
                {selectedClass?.maxStudents ?? 0} Students
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon type="phosphor" name="BOOK_OPEN" className="h-4 w-4 text-green-300" />
              <span className="text-sm font-medium">
                {selectedClass?.lessonIds?.length ?? 0} Lessons
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon type="phosphor" name="CALENDAR" className="h-4 w-4 text-purple-300" />
              <span className="text-sm font-medium">
                {selectedClass?.assignments?.length ?? 0} Assignments
              </span>
            </div>
            <div className="text-sm mt-2">70% Completed</div>
          </div> 
        </CardHeader>
      </Card>

      <Card className={`${selectedLesson.color} text-white rounded-xl`}>
        <CardHeader className="p-2 md:p-4 md:pl-6">
          <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Icon type="phosphor" name="CLOCK_COUNTDOWN" className="h-4 w-4" />
            <span>{selectedLesson.duration} minutes</span>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-8 -z-10 pb-[100vh]">
        {lessons.map((lesson, index) => (
          <div
            id={lesson.id.toString()}
            ref={(el: HTMLDivElement | null) => {
              if (lessonRefs.current) {
                lessonRefs.current[index] = el;
              }
            }}
            key={lesson.id}
            className="space-y-4 mb-8"
          >
            <div className={`pt-2 pb-2 px-4 ${index === 0 && `-mt-10`}`}>
              <div className="flex w-full justify-center">
                <div className="flex items-center relative max-w-lg w-full">
                  {/* Left line */}
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>

                  {/* Text with dynamic color */}
                  <div
                    className={`${lesson.color} z-10 text-white rounded-3xl text-xl px-4`}
                  >
                    {lesson.title}
                  </div>

                  {/* Progress bar */}
                  {/* <Progress
                    value={lesson.completed ? 100 : 50}
                    className="z-0 w-full bg-white/30 absolute rounded-3xl top-1/2 transform -translate-y-1/2"
                  /> */}

                  {/* Right line */}
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                </div>
              </div>
 
            </div>
            <div className="flex flex-col gap-4">
              {lesson.subLessons.map((subLesson) => (
                <Link
                  href={`/lesson/${lesson.id}/${subLesson.id}`}
                  key={subLesson.id}
                  onClick={(e) => handleSubLessonClick(e, subLesson, lesson)}
                >
                  <Card
                    className={`mx-4 border border-gray-200 dark:border-gray-800  rounded-3xl bg-white dark:bg-gray-900 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                      subLesson.unlocked ? "" : "opacity-50"
                    }`}
                  >
                    <CardHeader className="pb-0">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className="text-xl">{subLesson.title}</span>
                        {subLesson.unlocked ? (
                          <Unlock className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <Progress
                        value={subLesson.completed ? 100 : 0}
                        className="w-full absolute bottom-0 -ml-6"
                      />
                      <p className="mt-2 text-sm text-gray-600">
                        {subLesson.completed
                          ? "Completed"
                          : subLesson.unlocked
                          ? "Ready to start"
                          : "Locked"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Estimated time: 15 minutes
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon type="phosphor" name="BOOK_OPEN" className="h-5 w-5" />
              {selectedSubLesson?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center gap-2">
            <Icon type="phosphor" name="CLOCK_COUNTDOWN" className="h-4 w-4" />
            <span>{selectedSubLesson?.duration} minutes</span>
          </div>

          <DialogFooter className="sm:justify-start gap-2">
            {!selectedSubLesson?.unlocked ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Icon type="phosphor" name="LOCK_SIMPLE" className="h-4 w-4" />
                <span>Complete previous lessons to unlock</span>
              </div>
            ) : selectedSubLesson.completed ? (
              <>
                <Button variant="outline" className="gap-2">
                  <Icon type="phosphor" name="ARROWS_CLOCKWISE" className="h-4 w-4" />
                  Restart Lesson
                </Button>
                <Button>
                  <Icon type="phosphor" name="CARET_RIGHT" className="h-4 w-4 mr-2" />
                  Continue to Review
                </Button>
              </>
            ) : (
              <Button className="w-full gap-2">
                <Icon type="phosphor" name="PLAY_CIRCLE" className="h-4 w-4" />
                Start Lesson
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
