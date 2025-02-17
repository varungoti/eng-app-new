"use client";

import { useEffect, useRef, useState, memo, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen, Calendar, CheckCircle2, Clock, Lock, Plus, RotateCcw, Unlock, Users, Shield, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate as useRouterNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import ClassHeader from "./ClassHeader";
import {  Dialog,  DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Class, ExtendedLesson, SubLesson, ClassStudent, Student, Question, Activity, ExercisePrompt, Lesson, Topic, Subtopic, Grade } from "@/types";
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

type Tables = Database['public']['Tables'] & {
  topics: {
    Row: {
      id: string;
      title: string;
      grade_id: string;
      order_index?: number;
      subtopics?: SubtopicWithHierarchy[];
    };
  };
  subtopics: {
    Row: {
      id: string;
      title: string;
      topic_id: string;
      order_index?: number;
      lessons?: LessonWithContent[];
    };
  };
};
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

interface CustomLesson extends Partial<DbLesson> {
  id: string;
  title: string;
  status?: 'draft' | 'published';
  color: string;
  unlocked: boolean;
  completed: boolean;
  lessonNumber: string;
  totalTopics: string;
  difficulty: string;
  customSubLessons: CustomSubLesson[];
  questions?: Question[];
  activities?: Activity[];
  exercise_prompts?: ExercisePrompt[];
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

// Add these interfaces to match the database schema
interface SchoolClass {
  id: string;
  name: string;
  grade_id: string;
  section?: string;
  description?: string;
}

interface GradeWithHierarchy {
  id: string;
  name: string;
  level: number;
  topics: TopicWithHierarchy[];
  classes: SchoolClass[];
}

type DbTopic = Tables['topics']['Row'] & {
  subtopics?: {
    id: string;
    title: string;
    topic_id: string;
    order_index?: number;
    lessons: LessonWithContent[];
  }[];
};

interface TopicWithHierarchy extends DbTopic {
  subtopics: SubtopicWithHierarchy[];
}

// Add with other type definitions at the top
type DbSubtopic = Tables['subtopics']['Row'];

// Then update the interface to use it
interface SubtopicWithHierarchy extends DbSubtopic {
  lessons: LessonWithContent[];
  id: string;
  title: string;
  topic_id: string;
  order_index?: number; 
}

interface LessonWithContent {
  id: string;
  title: string;
  content: string;
  questions: Question[];
  activities: Activity[];
  exercise_prompts: ExercisePrompt[];
  duration?: number;
  description?: string;
  subtopic_id: string;
  order_index?: number;
  metadata?: {
    difficulty?: string;
    [key: string]: any;
  };
}

interface LessonCardProps {
  lesson: CustomLesson;
  isSelected: boolean;
  onSelect: (lesson: CustomLesson) => void;
}

const LessonCard = memo(({ lesson, isSelected, onSelect }: LessonCardProps) => {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:translate-y-[-2px]",
        "hover:bg-accent/50 hover:border-primary/50",
        "active:translate-y-[0px]",
        isSelected && "border-primary bg-accent/50 shadow-md",
        "group"
      )}
      onClick={() => onSelect(lesson)}
    >
      <CardHeader className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-medium">{lesson.title}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/5">
              {lesson.questions?.length || 0} Questions
            </Badge>
            <Badge variant="outline" className="bg-primary/5">
              {lesson.activities?.length || 0} Activities
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
});

LessonCard.displayName = 'LessonCard';

interface GradeData {
  grade_id: string;
  grades: {
    id: string;
    name: string;
    level: number;
  };
}

interface TeacherClassData {
  classes: {
    id: string;
    name: string;
    grade_id: string;
    section?: string;
    description?: string;
  }[];
}

export function LearningPathTeacher() {
  const navigate = useRouterNavigate();
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
  const [grades, setGrades] = useState<GradeWithHierarchy[]>([]);
  const [topics, setTopics] = useState<TopicWithHierarchy[]>([]);
  const [subtopics, setSubtopics] = useState<SubtopicWithHierarchy[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<GradeWithHierarchy | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicWithHierarchy | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubtopicWithHierarchy | null>(null);

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

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) throw new Error('No authenticated user');

        // 1. First get user's assigned schools
        const { data: userSchoolsData, error: schoolsError } = await supabase
          .from('user_schools')
          .select('school_id')
          .eq('user_id', session.user.id);

        if (schoolsError) throw schoolsError;

        if (!userSchoolsData?.length) {
          throw new Error('No schools assigned to user');
        }

        // 2. Get school grades and associated data
        const { data: schoolGradesData, error: gradesError } = await supabase
          .from('school_grades')
          .select(`
            grade_id,
            grades:grades (
              id,
              name,
              level
            )
          ` as '*')
          .in('school_id', userSchoolsData.map(us => us.school_id))
          .order('grades(level)', { ascending: true });

        if (gradesError) throw gradesError;

        // 3. Get teacher's classes
        const { data: teacherClasses, error: classesError } = await supabase
          .from('class_teachers')
          .select(`
            classes (
              id,
              name,
              grade_id,
              section,
              description
            )
          ` as '*')
          .eq('teacher_id', session.user.id);

        if (classesError) throw classesError;

        // 4. For each grade, fetch the complete hierarchy
        const gradesWithHierarchy = await Promise.all(
          schoolGradesData.map(async ({ grades: grade }) => {
            const { data: topics } = await supabase
              .from('topics')
              .select(`
                *,
                subtopics (
                  *,
                  lessons (
                    *,
                    questions (
                      *,
                      exercise_prompts (*)
                    ),
                    activities (*)
                  )
                )
              `)
              .eq('grade_id', grade.id)
              .order('order_index');

            return {
              ...grade,
              topics: topics || [],
              classes: teacherClasses?.map(tc => tc.classes).flat() || []
            };
          })
        );

        // Update states while maintaining existing functionality
        setGrades(gradesWithHierarchy);
        
        // Set initial selections
        if (gradesWithHierarchy.length > 0) {
          const firstGrade = gradesWithHierarchy[0];
          setSelectedGrade(firstGrade);

          // Update existing class-based state
          const gradeClasses = firstGrade.classes.map((cls: SchoolClass) => ({
            ...cls,
            id: String(cls.id),
            students: 0 // Will be updated with actual count
          }));
          setClasses(gradeClasses);
          if (gradeClasses.length > 0) {
            setSelectedClass(gradeClasses[0]);
          }

          // Set topics and lessons
          if (firstGrade.topics.length > 0) {
            const firstTopic = firstGrade.topics[0];
            setSelectedTopic(firstTopic);
            setTopics(firstGrade.topics);

            if (firstTopic.subtopics.length > 0) {
              const firstSubtopic = firstTopic.subtopics[0];
              setSelectedSubtopic(firstSubtopic);
              setSubtopics(firstGrade.topics.flatMap((t: TopicWithHierarchy) => t.subtopics));

              // Transform lessons to match existing format
              const transformedLessons = firstSubtopic.lessons.map((lesson: LessonWithContent, index: number) => ({
                ...lesson,
                id: String(lesson.id),
                color: getColorForIndex(index),
                unlocked: index === 0,
                completed: false,
                lessonNumber: `${index + 1}`,
                totalTopics: String(firstGrade.topics.length),
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

              setLessons(transformedLessons);
              if (transformedLessons.length > 0) {
                setSelectedLesson(transformedLessons[0]);
              }
            }
          }
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
const toggleLock = () => {
    setIsLocked(!isLocked);
  };


  return (
    <div className="max-w-6xl w-full relative">
      {/* Grade Selection */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {grades
          .sort((a, b) => a.level - b.level)
          .map(grade => (
            <Card
              key={grade.id}
              className={cn(
                "cursor-pointer transition-all duration-200",
                selectedGrade?.id === grade.id && "border-primary border-l-4 border-l-primary hover:border-primary/50 bg-accent/55 bg-color-secondary"
              )}
              onClick={() => setSelectedGrade(grade)}
            >
               llllllll
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="font-medium">{grade.name}</span>
                </div>
              </CardHeader>
            </Card>
          ))}
      </div>

      

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
          {/* Upcoming Classes
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
          </Card> */}

          {/* Top Performing Students */}
          {/* <Card className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
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
          </Card> */}
        </div>
      </div>

      {/* Topics and their content
      <div className="mt-6 space-y-6">
        {topics
          .filter(topic => topic.grade_id === selectedGrade?.id)
          .map(topic => (
            <Card key={topic.id} className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subtopics
                    .filter(subtopic => subtopic.topic_id === topic.id)
                    .map(subtopic => (
                      <div key={subtopic.id} className="space-y-4">
                        <h3 className="text-lg font-semibold">{subtopic.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {lessons
                            .filter(lesson => lesson.subtopic_id === subtopic.id)
                            .map(lesson => (
                              <LessonCard 
                                key={lesson.id}
                                lesson={lesson}
                                isSelected={selectedLesson?.id === lesson.id}
                                onSelect={setSelectedLesson}
                              />
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div> */}


<div className="mt-6 space-y-6">
  {selectedGrade?.topics
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .map(topic => (
      <Card 
        key={topic.id} 
        className={cn(
          "border-l-4 border-l-primary transition-all duration-200",
          "hover:shadow-md"
        )}
      >
        <CardHeader className="cursor-pointer" onClick={() => setSelectedTopic(topic)}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {topic.title}
            </CardTitle>
            <Badge variant="outline" className="bg-primary/5">
              {topic.subtopics?.length || 0} Subtopics
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {topic.subtopics
              ?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
              .map(subtopic => (
                <div 
                  key={subtopic.id} 
                  className={cn(
                    "space-y-4 p-4 rounded-lg",
                    "border border-border/50",
                    "hover:border-primary/50 transition-colors",
                    selectedSubtopic?.id === subtopic.id && "border-primary/50 bg-accent/5"
                  )}
                >
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setSelectedSubtopic(subtopic)}
                  >
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        selectedSubtopic?.id === subtopic.id ? "bg-primary" : "bg-muted"
                      )} />
                      {subtopic.title}
                    </h3>
                    <Badge variant="outline">
                      {subtopic.lessons?.length || 0} Lessons
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subtopic.lessons
                      ?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                      .map(lesson => (
                        <LessonCard 
                          key={lesson.id}
                          lesson={{
                            ...lesson,
                            color: getColorForIndex(subtopic.lessons.indexOf(lesson)),
                            unlocked: true, // You can add your unlock logic here
                            completed: false, // Add completion logic
                            lessonNumber: `${subtopic.lessons.indexOf(lesson) + 1}`,
                            totalTopics: String(topic.subtopics?.length || 0),
                            difficulty: lesson.metadata?.difficulty || 'Beginner',
                            customSubLessons: [{
                              id: lesson.id,
                              title: lesson.title,
                              unlocked: true,
                              completed: false,
                              duration: lesson.duration || 15,
                              description: lesson.description || ''
                            }]
                          }}
                          isSelected={selectedLesson?.id === lesson.id}
                          onSelect={setSelectedLesson}
                        />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    ))}
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