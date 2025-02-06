"use client";

import { useEffect, useRef, useState, memo, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {  ArrowRight, BookOpen, Calendar, CheckCircle2, Clock, Lock, Plus, RotateCcw, Unlock, Users, Shield, GraduationCap, } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import ClassHeader from "./ClassHeader";
import {  Dialog,  DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Class, ExtendedLesson, SubLesson, ClassStudent, Student } from "@/types";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { useComponentLogger } from "@/hooks/useComponentLogger";
import type { PostgrestResponse, PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { transformLearningPathData } from "@/lib/transforms/learningPath";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper functions defined outside the component
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry<T>(
  fetchFn: () => Promise<{ data: T[] | null; error: PostgrestError | null }>,
  retries = MAX_RETRIES
): Promise<T[]> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const { data, error } = await fetchFn();
      
      if (error) {
        throw new Error(error.message || 'Database operation failed');
      }
      
      if (!data) {
        throw new Error('No data returned from the database');
      }

      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === retries - 1) {
        throw lastError;
      }
      
      await delay(RETRY_DELAY * Math.pow(2, attempt));
    }
  }

  throw lastError || new Error('Failed to fetch data after retries');
}

type Tables = Database['public']['Tables'];
type DbClass = Tables['classes']['Row'];
type DbLesson = Tables['lessons']['Row'] & {
  topic?: { title: string };
  subtopic?: { title: string };
};
type DbStudent = Tables['students']['Row'];
type DbClassStudent = Tables['class_students']['Row'] & {
  student: DbStudent;
};

interface ExtendedClass extends Omit<DbClass, 'id'> {
  id: string;
  students: number;
}

interface CustomLesson extends Omit<DbLesson, 'id' | 'status'> {
  id: string;
  status?: 'draft' | 'published';
  color: string;
  unlocked: boolean;
  completed: boolean;
  lessonNumber: string;
  totalTopics: string;
  difficulty: string;
  customSubLessons: CustomSubLesson[];
}

interface CustomSubLesson {
  id: string;
  title: string;
  unlocked: boolean;
  completed: boolean;
  duration: number;
  description: string;
}

interface ClassHeaderProps {
  classes: ExtendedClass[];
  selectedClass: ExtendedClass | null;
  onClassChange: (classData: ExtendedClass) => void;
}

interface ClassCardProps {
  classData: ExtendedClass;
  isSelected: boolean;
  onClassChange: (classData: ExtendedClass) => Promise<void>;
  logError: (error: unknown) => void;
}

const ClassCard = memo(({ 
  classData, 
  isSelected, 
  onClassChange, 
  logError 
}: ClassCardProps): JSX.Element => {
  const handleClick = useCallback(async () => {
    try {
      await onClassChange(classData);
    } catch (error) {
      logError(error);
    }
  }, [classData, onClassChange, logError]);

  const cardClassName = useMemo(() => 
    cn(
      "flex-shrink-0 cursor-pointer p-4",
      isSelected ? "border-primary" : "border-transparent"
    ),
    [isSelected]
  );

  return (
    <Card
      key={classData.id}
      className={cardClassName}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <GraduationCap 
          className="h-5 w-5 text-primary" 
        />
        <span className="font-medium">{classData.name}</span>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{classData.students} Students</span>
        </div>
      </div>
    </Card>
  );
});

ClassCard.displayName = 'ClassCard';

export function LearningPathTeacher() {
  const navigate = useNavigate();
  const { logError } = useComponentLogger('LearningPathTeacher');
  const lessonRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [lessons, setLessons] = useState<CustomLesson[]>([]);
  const [selectedClass, setSelectedClass] = useState<ExtendedClass | null>(null);
  const [classes, setClasses] = useState<ExtendedClass[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<CustomLesson | null>(null);
  const [selectedSubLesson, setSelectedSubLesson] = useState<CustomSubLesson | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<CustomLesson | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [classStudents, setClassStudents] = useState<DbStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Load lock state from localStorage
  useEffect(() => {
    try {
      const savedLockState = localStorage.getItem('myCoursesTabLocked');
      if (savedLockState !== null) {
        setIsLocked(JSON.parse(savedLockState));
      }
    } catch (error) {
      logError(error);
    }
  }, [logError]);

  // Save lock state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('myCoursesTabLocked', JSON.stringify(isLocked));
    } catch (error) {
      logError(error);
    }
  }, [isLocked, logError]);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setFetchError(null);

        const { data: classesData, error: classesError } = await supabase
          .from('classes')
          .select('*')
          .order('created_at', { ascending: false });

        if (classesError) {
          throw new Error('Error fetching classes: ' + classesError.message);
        }

        if (!classesData || classesData.length === 0) {
          throw new Error('No classes found');
        }

        const extendedClasses: ExtendedClass[] = classesData.map(cls => ({
          ...cls,
          id: String(cls.id),
          students: 0 // Will be updated with actual count
        }));

        setClasses(extendedClasses);
        setSelectedClass(extendedClasses[0]);

        const { data: lessonsData, error: lessonsError } = await supabase
          .from('lessons')
          .select(`
            *,
            topic:topics(title),
            subtopic:subtopics(title)
          `)
          .eq('grade_id', classesData[0].grade_id)
          .order('order_index', { ascending: true });

        if (lessonsError) {
          throw new Error('Error fetching lessons: ' + lessonsError.message);
        }

        const customLessons: CustomLesson[] = lessonsData.map((lesson, index) => ({
          ...lesson,
          id: String(lesson.id),
          status: lesson.status as 'draft' | 'published' | undefined,
          color: getColorForIndex(index),
          unlocked: index === 0,
          completed: false,
          lessonNumber: `${index + 1}`,
          totalTopics: '5',
          difficulty: 'Beginner',
          customSubLessons: [
            {
              id: String(lesson.id),
              title: lesson.title,
              unlocked: index === 0,
              completed: false,
              duration: lesson.duration || 15,
              description: lesson.description || ''
            }
          ]
        }));

        setLessons(customLessons);
        if (customLessons.length > 0) {
          setSelectedLesson(customLessons[0]);
        }

        const { data: studentsData, error: studentsError } = await supabase
          .from('class_students')
          .select(`
            *,
            student:students!class_students_student_id_fkey (
              id,
              first_name,
              last_name,
              roll_number,
              email,
              grade_id
            )
          `)
          .eq('class_id', classesData[0].id);

        if (studentsError) {
          throw new Error('Error fetching students: ' + studentsError.message);
        }

        if (studentsData) {
          const students = studentsData.map(data => data.student);
          setClassStudents(students);
          
          // Update the selected class with the correct student count
          setSelectedClass(prev => prev ? { ...prev, students: students.length } : null);
          
          // Update all classes with their student counts
          setClasses(prev => prev.map(cls => 
            cls.id === extendedClasses[0].id 
              ? { ...cls, students: students.length }
              : cls
          ));
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setFetchError(errorMessage);
        logError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [logError]);

  const handleClassChange = async (classData: ExtendedClass) => {
    if (isLocked) return;
    setSelectedClass(classData);
    
    try {
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select(`
          *,
          topic:topics(title),
          subtopic:subtopics(title)
        `)
        .eq('grade_id', classData.grade_id)
        .order('order_index', { ascending: true });

      if (lessonsError) {
        throw new Error('Error fetching lessons: ' + lessonsError.message);
      }

      const customLessons: CustomLesson[] = lessonsData.map((lesson, index) => ({
        ...lesson,
        id: String(lesson.id),
        status: lesson.status as 'draft' | 'published' | undefined,
        color: getColorForIndex(index),
        unlocked: index === 0,
        completed: false,
        lessonNumber: `${index + 1}`,
        totalTopics: '5',
        difficulty: 'Beginner',
        customSubLessons: [
          {
            id: String(lesson.id),
            title: lesson.title,
            unlocked: index === 0,
            completed: false,
            duration: lesson.duration || 15,
            description: lesson.description || ''
          }
        ]
      }));

      setLessons(customLessons);
    } catch (error) {
      logError(error);
    }
  };

  const getColorForIndex = (index: number): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500'
    ];
    return colors[index % colors.length];
  };

  const handleSubLessonClick = (
    e: React.MouseEvent,
    subLesson: CustomSubLesson,
    lesson: CustomLesson
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

  const handleStartLesson = (lessonId: string, subLessonId: string) => {
    if (isLocked) return;
    setDialogOpen(false);
    navigate(`/lesson/${lessonId}/${subLessonId}`);
  };

  const handleRestartLesson = (lessonId: string, subLessonId: string) => {
    if (isLocked) return;
    setDialogOpen(false);
    navigate(`/lesson/${lessonId}/${subLessonId}?restart=true`);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const setLessonRef = (index: number) => (el: HTMLDivElement | null) => {
    lessonRefs.current[index] = el;
  };

  // Intersection Observer effect
  useEffect(() => {
    if (!lessons.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lessonInView = lessons.find(
              (lesson) => lesson.id === entry.target.id
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading learning path...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4 p-6 bg-destructive/10 rounded-lg">
          <Shield className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-destructive font-medium">{fetchError}</p>
          <Button 
            variant="outline" 
            onClick={handleRetry}
            className="mt-4"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl w-full relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {classes.map(classData => (
            <ClassCard
              key={classData.id}
              classData={classData}
              isSelected={selectedClass?.id === classData.id}
              onClassChange={handleClassChange}
              logError={logError}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLocked(!isLocked)}
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
                  {classStudents.length} Students
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen size={16} className="text-green-300" />
                <span className="text-sm font-medium">
                  {lessons.length} Lessons
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-purple-300" />
                <span className="text-sm font-medium">
                  0 Assignments
                </span>
              </div>
              <div className="text-sm mt-2">
                {Math.round((lessons.filter(l => l.completed).length / lessons.length) * 100)}% Completed
              </div>
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
                    <div 
                      className={`progress-bar`}
                      data-progress={`${student.progress}`}
                    />
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
        {selectedLesson && (
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
        )}
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
                      You have completed this lesson
                    </span>
                  </div>
                )}
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter>
            {!selectedSubLesson?.unlocked ? (
              <span className="text-sm text-muted-foreground">
                Complete previous lessons to unlock this content
              </span>
            ) : selectedSubLesson.completed ? (
              <>
                <Button
                  onClick={() => {
                    if (currentLesson?.id && selectedSubLesson?.id) {
                      handleStartLesson(currentLesson.id, selectedSubLesson.id);
                    }
                  }}
                  disabled={isLocked}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentLesson?.id && selectedSubLesson?.id) {
                      handleRestartLesson(currentLesson.id, selectedSubLesson.id);
                    }
                  }}
                  disabled={isLocked}
                >
                  Restart
                  <RotateCcw className="ml-2 h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  if (currentLesson?.id && selectedSubLesson?.id) {
                    handleStartLesson(currentLesson.id, selectedSubLesson.id);
                  }
                }}
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
            id={lesson.id}
            ref={setLessonRef(index)}
            key={lesson.id}
            className="space-y-4 mb-8"
          >
            <div className={`pt-2 pb-2 px-4 ${index === 0 ? '-mt-10' : ''}`}>
              <div className="flex w-full justify-center">
                <div className="flex items-center relative max-w-lg w-full">
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                  <div className={`${lesson.color} z-10 text-white rounded-3xl text-xl px-4`}>
                    {lesson.title}
                  </div>
                  <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {lesson.customSubLessons.map((subLesson) => (
                <Link
                  to={`/lesson/${lesson.id}/${subLesson.id}`}
                  key={subLesson.id}
                  onClick={(e) => handleSubLessonClick(e, subLesson, lesson)}
                  className={`${isLocked && !subLesson.unlocked ? "pointer-events-none" : ""}`}
                >
                  <Card className={cn(
                    "hover:border-primary transition-colors",
                    !subLesson.unlocked && "opacity-50"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {subLesson.unlocked ? (
                            <BookOpen className="h-5 w-5 text-primary" />
                          ) : (
                            <Lock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <h3 className="font-medium">{subLesson.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {subLesson.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {subLesson.duration} min
                          </div>
                          {subLesson.completed && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                      </div>
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