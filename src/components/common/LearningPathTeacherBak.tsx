"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  BookOpen,
  BookOpenIcon,
  Calendar,
  CheckCircle2,
  CheckCircleIcon,
  Clock,
  ClockIcon,
  Lock,
  Plus,
  RotateCcw,
  Unlock,
  Users,
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

export function LearningPathTeacher() { 
  const [lessons, setLessons] = useState(lessonsData);
  const [selectedClass, setSelectedClass] = useState<any>(classesData[0]);
  const [selectedLesson, setSelectedLesson] = useState(lessonsData[0]);

  const [selectedSubLesson, setSelectedSubLesson] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<any | null>(null);

  const handleClassChange = (classData) => {
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
    subLesson: any,
    lesson: any
  ) => {
    e.preventDefault();
    setSelectedSubLesson(subLesson);
    setCurrentLesson(lesson);
    setDialogOpen(true);
  };

  const handleStartLesson = (lessonId: number, subLessonId: number) => {
    setDialogOpen(false);
    // Navigate programmatically
    window.location.href = `/lesson/${lessonId}/${subLessonId}`;
  };

  const handleRestartLesson = (lessonId: number, subLessonId: number) => {
    setDialogOpen(false);
    // You might want to add a different URL parameter or path for restarting
    window.location.href = `/lesson/${lessonId}/${subLessonId}?restart=true`;
  };

  const lessonRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the lesson is in the view, set it as the selected lesson
          if (entry.isIntersecting) {
            const lessonInView = lessons.find(
              (lesson) => lesson.id === parseInt(entry.target.id)
            );
            if (lessonInView) {
              setSelectedLesson(lessonInView);
            }
          } else {
            // If the lesson is not in the view, handle accordingly
            // Optionally, reset or show another lesson (if desired)
          }
        });
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: "-05% 0px -85% 0px", // Triggers when element is in the middle 20% of viewport
        threshold: [0, 0.25, 0.5, 0.75, 1], // More threshold points for smoother tracking
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
      <ClassHeader
        classes={classesData}
        selectedClass={selectedClass}
        onClassChange={handleClassChange}
      />
      <div className="sticky top-0 z-30 w-full ">
        {/* <Card className={`text-gray-700 bg-white bg-opacity-15 rounded-3xl mb-4 border-0 shadow`}>
            <CardHeader>
              <CardTitle className="text-2xl">{selectedClass?.name}</CardTitle>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Users size={16} className="text-blue-300" />
                  <span className="text-sm font-medium">
                    {selectedClass?.studentIds.length}/
                    {selectedClass?.maxStudents} Students
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen size={16} className="text-green-300" />
                  <span className="text-sm font-medium">
                    {selectedClass?.lessonIds.length} Lessons
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-purple-300" />
                  <span className="text-sm font-medium">
                    {selectedClass?.assignments.length} Assignments
                  </span>
                </div>
                <div className="text-sm mt-2">70% Completed</div>
              </div> 
            </CardHeader>
          </Card> */}

        <Card className={`${selectedLesson.color} text-white rounded-xl `}>
          <CardHeader className="p-2 md:p-4 md:pl-6">
            <CardTitle className="text-2xl">{selectedLesson.title}</CardTitle>
            <div className="flex flex-row md:flex-row items-center text-white text-sm space-y-2 md:space-y-0 md:space-x-4 md:p-2">
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="h-5 w-5 text-white" />
                <div className="text-sm font-medium">
                  {selectedClass?.name}{" "}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span>Lesson {selectedLesson.lessonNumber}</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <ClockIcon className="h-5 w-5 text-white" />
                  <span>{selectedLesson.duration} minutes</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <BookOpenIcon className="h-5 w-5 text-white" />
                  <span>{selectedLesson.totalTopics} Topics</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <CheckCircleIcon className="h-5 w-5 text-white" />
                  <span>1/5 Completed</span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-8 -z-10 pb-[100vh]">
        {lessons.map((lesson, index) => (
          <div
            id={lesson.id.toString()}
            ref={(el) => (lessonRefs.current[index] = el)}
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

              {/* <Card className={`${lesson.color} text-white rounded-3xl`}>
                <CardHeader>
                  <CardTitle className="text-2xl">{lesson.title} </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      lesson: {lesson.lessonNumber} <span>•</span> total topics{" "}
                      {lesson.totalTopics}
                    </div>
                    <span>•</span>
                    <span>{lesson.duration} minutes</span>
                  </div>
                  <Progress
                    value={lesson.completed ? 100 : 0}
                    className="w-full bg-white/30"
                  />
                </CardHeader>
              </Card> */}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSubLesson?.title}
              {selectedSubLesson?.completed && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </DialogTitle>
            <DialogDescription className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{selectedSubLesson?.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4" />
                  <span>Part of {currentLesson?.title}</span>
                </div>
                <div>{selectedSubLesson?.description}</div>

                {selectedSubLesson?.completed && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-green-700 dark:text-green-300 text-sm">
                      You&apos;ve already completed this lesson!
                    </div>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start gap-2">
            {!selectedSubLesson?.unlocked ? (
              <div className="text-sm text-gray-500">
                Complete previous lessons to unlock this content
              </div>
            ) : selectedSubLesson.completed ? (
              <>
                <Button
                  onClick={() =>
                    selectedSubLesson &&
                    handleRestartLesson(currentLesson.id, selectedSubLesson.id)
                  }
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Restart Lesson
                </Button>
                <Button
                  onClick={() =>
                    selectedSubLesson &&
                    handleStartLesson(currentLesson.id, selectedSubLesson.id)
                  }
                >
                  Continue to Review
                </Button>
              </>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  selectedSubLesson &&
                  handleStartLesson(currentLesson.id, selectedSubLesson.id)
                }
              >
                Start Lesson
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
