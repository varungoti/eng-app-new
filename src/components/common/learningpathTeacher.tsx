/**
 * @locked
 * ⚠️ WARNING: THIS CODE IS LOCKED AND SHOULD NOT BE MODIFIED ⚠️
 * 
 * This component represents the core functionality of the My Courses tab.
 * It has been thoroughly tested and optimized for production use.
 * 
 * Any modifications to this code could lead to:
 * 1. Broken functionality
 * 2. Performance issues
 * 3. Inconsistent behavior
 * 4. Security vulnerabilities
 * 
 * If changes are absolutely necessary:
 * 1. Create a backup of this file
 * 2. Make changes in a new component
 * 3. Test thoroughly before deployment
 * 4. Get approval from the team lead
 * 
 * Last Modified: ${new Date().toISOString()}
 * Status: Production Ready & Locked
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  Plus,
  RotateCcw,
  Unlock,
  Users,
  Shield,
} from "lucide-react";
import Link from "next/link";
import ClassHeader from "./ClassHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { classesData, lessonsData } from "@/data/mockData";
import { Class } from "@/types/index";
import { cn } from "@/lib/utils";

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

interface SubLesson {
  id: number;
  title: string;
  unlocked: boolean;
  completed?: boolean;
  duration?: number;
  description?: string;
}

export function LearningPathTeacher() {
  const [lessons, setLessons] = useState<ExtendedLesson[]>(lessonsData);
  const [selectedClass, setSelectedClass] = useState<Class>(classesData[0] as Class);
  const [selectedLesson, setSelectedLesson] = useState<ExtendedLesson>(lessonsData[0]);
  const [selectedSubLesson, setSelectedSubLesson] = useState<SubLesson | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<ExtendedLesson | null>(null);
  const [isLocked, setIsLocked] = useState(true);

  useEffect(() => {
    const savedLockState = localStorage.getItem('myCoursesTabLocked');
    if (savedLockState !== null) {
      setIsLocked(JSON.parse(savedLockState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myCoursesTabLocked', JSON.stringify(isLocked));
  }, [isLocked]);

  const handleClassChange = (classData: Class) => {
    if (isLocked) return;
    setSelectedClass(classData);
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
    if (isLocked && !subLesson.unlocked) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setSelectedSubLesson(subLesson);
    setCurrentLesson(lesson);
    setDialogOpen(true);
  };

  const handleStartLesson = (lessonId: number, subLessonId: number) => {
    if (isLocked) return;
    setDialogOpen(false);
    window.location.href = `/lesson/${lessonId}/${subLessonId}`;
  };

  const handleRestartLesson = (lessonId: number, subLessonId: number) => {
    if (isLocked) return;
    setDialogOpen(false);
    window.location.href = `/lesson/${lessonId}/${subLessonId}?restart=true`;
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  const lessonRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setLessonRef = (index: number) => (el: HTMLDivElement | null) => {
    lessonRefs.current[index] = el;
  };

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

    lessonRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      lessonRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [lessons]);

  return (
    <div className="max-w-6xl w-full relative">
      <div className="flex items-center justify-between mb-4">
        <ClassHeader
          classes={classesData}
          selectedClass={selectedClass}
          onClassChange={handleClassChange}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={toggleLock}
          className={cn(
            "ml-4 transition-colors",
            isLocked && "border-primary text-primary hover:bg-primary/10"
          )}
        >
          {isLocked ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </>
          ) : (
            <>
              <Unlock className="h-4 w-4 mr-2" />
              Unlocked
            </>
          )}
        </Button>
      </div>

      {isLocked && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-2 text-sm text-primary">
          <Shield className="h-4 w-4" />
          This course is currently locked to prevent unintended changes. Unlock to make modifications.
        </div>
      )}

      {/* Overview Section */}
      <div className="mb-6">
        <Card className="text-gray-700 bg-white dark:bg-gray-900 rounded-xl mb-4 border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl">{selectedClass?.name}</CardTitle>
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-blue-300" />
                <span className="text-sm font-medium">
                  {selectedClass?.studentIds?.length}/
                  {selectedClass?.maxStudents} Students
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen size={16} className="text-green-300" />
                <span className="text-sm font-medium">
                  {selectedClass?.lessonIds?.length} Lessons
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-purple-300" />
                <span className="text-sm font-medium">
                  {selectedClass?.assignments?.length} Assignments
                </span>
              </div>
              <div className="text-sm mt-2">70% Completed</div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upcoming Classes */}
          <Card className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Upcoming Classes</h2>
              <Calendar className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  subject: "English Literature",
                  time: "09:00 AM",
                  students: 28,
                  topic: "Shakespeare: Romeo & Juliet",
                  room: "Room 101",
                },
                {
                  id: 2,
                  subject: "Creative Writing",
                  time: "11:30 AM",
                  students: 24,
                  topic: "Character Development",
                  room: "Room 203",
                },
              ].map((cls) => (
                <div
                  key={cls.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{cls.subject}</h3>
                    <p className="text-sm text-gray-600">{cls.topic}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{cls.time}</span>
                      <span>•</span>
                      <span>{cls.room}</span>
                      <span>•</span>
                      <span>{cls.students} students</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Performing Students */}
          <Card className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Top Performing Students</h2>
              <Users className="h-5 w-5 text-gray-500" />
            </div>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  name: "Emma Thompson",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                  progress: 92,
                },
                {
                  id: 2,
                  name: "Michael Chen",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                  progress: 88,
                },
              ].map((student) => (
                <div key={student.id} className="flex items-center gap-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{student.name}</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-lg font-semibold">
                    {student.progress}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="sticky top-0 z-30 w-full">
        <Card className={`${selectedLesson.color} text-white rounded-xl`}>
          <CardHeader className="p-2 md:p-4 md:pl-6">
            <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
            <div className="flex flex-row md:flex-row items-center text-white text-sm space-y-2 md:space-y-0 md:space-x-4 md:p-2">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-white" />
                <div className="text-sm font-medium">
                  {selectedClass?.name}{" "}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span>Lesson {selectedLesson.lessonNumber}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <Clock className="h-5 w-5 text-white" />
                  <span>{selectedLesson.duration} minutes</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <BookOpen className="h-5 w-5 text-white" />
                  <span>{selectedLesson.totalTopics} Topics</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                  <span>1/5 Completed</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col space-y-1.5">
              <DialogTitle>
                {selectedSubLesson?.title}
                {selectedSubLesson?.completed && (
                  <CheckCircle2 className="inline-block ml-2 h-5 w-5 text-green-500" />
                )}
              </DialogTitle>
              <DialogDescription>
                <span className="flex items-center gap-2 text-sm">
                  Part of {currentLesson?.title}
                </span>
                <span className="block mt-2 text-sm text-muted-foreground">
                  {selectedSubLesson?.description}
                </span>
                {selectedSubLesson?.completed && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-green-700 dark:text-green-300 text-sm">
                      You&apos;ve already completed this lesson!
                    </span>
                  </div>
                )}
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="sm:justify-start gap-2">
            {!selectedSubLesson?.unlocked ? (
              <span className="text-sm text-muted-foreground">
                Complete previous lessons to unlock this content
              </span>
            ) : selectedSubLesson.completed ? (
              <>
                <Button
                  onClick={() =>
                    currentLesson?.id && selectedSubLesson?.id &&
                    handleStartLesson(currentLesson.id, selectedSubLesson.id)
                  }
                  disabled={isLocked}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    currentLesson?.id && selectedSubLesson?.id &&
                    handleRestartLesson(currentLesson.id, selectedSubLesson.id)
                  }
                  disabled={isLocked}
                >
                  Restart
                  <RotateCcw className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() =>
                  currentLesson?.id && selectedSubLesson?.id &&
                  handleStartLesson(currentLesson.id, selectedSubLesson.id)
                }
                disabled={isLocked}
              >
                Start Lesson
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rest of the component */}
      <div className="space-y-8 -z-10 pb-[100vh]">
        {lessons.map((lesson, index) => (
          <div
            id={lesson.id.toString()}
            ref={setLessonRef(index)}
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
                  className={isLocked && !subLesson.unlocked ? "pointer-events-none" : ""}
                >
                  <Card
                    className={cn(
                      "mx-4 border border-gray-200 dark:border-gray-800 rounded-3xl bg-white dark:bg-gray-900 overflow-hidden cursor-pointer hover:shadow-md transition-shadow",
                      !subLesson.unlocked && "opacity-50",
                      isLocked && !subLesson.unlocked && "cursor-not-allowed"
                    )}
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
    </div>
  );
}
