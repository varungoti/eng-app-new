"use client";

import { useEffect, useRef, useState, memo, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen, Calendar, CheckCircle2, Clock, Lock, Plus, RotateCcw, Unlock, Users, Shield, GraduationCap, X, RefreshCw, PartyPopper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import ClassHeader from "./ClassHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Class, ExtendedLesson, SubLesson, ClassStudent, Student, Question, Activity, ExercisePrompt, Lesson, Topic, Subtopic, Grade } from "@/types";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/supabase";
import { useComponentLogger } from "@/hooks/useComponentLogger";
import type { PostgrestResponse, PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { transformLearningPathData } from "@/lib/transforms/learningPath";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { useInView } from 'react-intersection-observer';
import { useRouter } from "next/navigation";
import { logger } from "@/lib/logger";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useSound } from "use-sound";
import { useToast } from "@/hooks/use-toast";
import { LessonDialog } from "../lesson/LessonDialog";
import confetti from 'canvas-confetti';

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
      description: string | null;
      grade_id: string;
      order_index: number | null;
      created_at: string;
      updated_at: string;
      subtopics?: SubtopicWithHierarchy[];
    };
  };
  subtopics: {
    Row: {
      id: string;
      title: string;
      description: string | null;
      topic_id: string;
      order_index: number | null;
      created_at: string;
      updated_at: string;
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

interface CustomLesson {
  id: string;
  title: string;
  content: string | null;
  description: string | null;
  topic_id: string | null;
  subtopic_id: string;
  order_index: number | null;
  duration: number | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  contentheading: string | null;
  user_id: string | null;
  voice_id: string | null;
  color: string;
  unlocked: boolean;
  completed: boolean;
  lessonNumber: string;
  totalTopics: string;
  difficulty: string;
  customSubLessons: CustomSubLesson[];
  questions?: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    points: number;
    lesson_id: string;
    order_index: number | null;
    created_at: string;
    updated_at: string;
    status: 'draft' | 'published';
    data: Record<string, any>;
  }>;
  activities?: Array<{
    id: string;
    title: string;
    description: string | null;
    type: string;
    content: string | null;
    lesson_id: string;
    duration: number | null;
    created_at: string;
    updated_at: string;
    name: string;
    instructions: string | null;
    data: {
      prompt: string;
      teacherScript: string;
      media: string[];
    };
    media: Array<{
      url: string;
      type: 'image' | 'gif' | 'video';
    }>;
  }>;
  exercise_prompts?: Array<{
    id: string;
    text: string;
    media: string | null;
    type: 'image' | 'gif' | 'video';
    narration: string | null;
    saytext: string | null;
    question_id: string | null;
    correct: boolean | null;
    created_at: string;
    updated_at: string;
    contentId: string;
    questionType: string;
    difficulty: string;
    content: Record<string, any>;
    metadata: Record<string, any>;
    adaptiveSettings: Record<string, any>;
  }>;
}

interface CustomSubLesson {
  id: string;
  title: string;
  description: string | null;
  duration: number | null;
  unlocked: boolean;
  completed: boolean;
  order_index: number | null;
  created_at: string;
  updated_at: string;
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
  title: string;
  subtopics?: {
    id: string;
    title: string;
    topic_id: string;
    order_index?: number;
    lessons: LessonWithContent[];
  }[];
};

interface TopicCardProps {
  topic: TopicWithHierarchy;
  isUnlocked: boolean;
  onSubtopicClick: (subtopic: SubtopicWithHierarchy, topic: TopicWithHierarchy) => void;
}

interface TopicWithHierarchy {
  id: string;
  title: string;
  description: string | null;
  grade_id: string;
  order_index: number | null;
  created_at: string;
  updated_at: string;
  subtopics: SubtopicWithHierarchy[];
  color?: string;
  completed?: boolean;
}

// Add with other type definitions at the top
type DbSubtopic = Tables['subtopics']['Row'];

// Then update the interface to use it
interface SubtopicWithHierarchy {
  id: string;
  title: string;
  description: string | null;
  topic_id: string;
  order_index: number | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
  lessons?: LessonWithContent[];
}

interface LessonWithContent {
  id: string;
  title: string;
  content: string | null;
  description: string | null;
  topic_id: string | null;
  subtopic_id: string;
  order_index: number | null;
  duration: number | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  contentheading: string | null;
  user_id: string | null;
  voice_id: string | null;
  questions: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    points: number;
    lesson_id: string;
    order_index: number | null;
    created_at: string;
    updated_at: string;
    status: 'draft' | 'published';
    data: {
      prompt?: string;
      teacherScript?: string;
      options?: string[];
      sampleAnswer?: string;
      followup_prompt?: string[];
      metadata?: {
        sampleAnswer?: string;
        correct?: string[];
        options?: string[];
        audioContent?: string;
        transcript?: string;
        keywords?: string[];
        hints?: string[];
        imageUrl?: string;
        videoUrl?: string;
      };
    };
  }>;
  activities: Array<{
    id: string;
    title: string;
    description: string | null;
    type: string;
    content: string | null;
    lesson_id: string;
    duration: number | null;
    created_at: string;
    updated_at: string;
    name: string;
    instructions: string | null;
    data: {
      prompt: string;
      teacherScript: string;
      media: string[];
    };
    media: Array<{
      url: string;
      type: 'image' | 'gif' | 'video';
    }>;
  }>;
  exercise_prompts: Array<{
    id: string;
    text: string;
    media: string | null;
    type: 'image' | 'gif' | 'video';
    narration: string | null;
    saytext: string | null;
    question_id: string | null;
    correct: boolean | null;
    created_at: string;
    updated_at: string;
    contentId: string;
    questionType: 'multiple-choice' | 'fill-blank' | 'matching' | 'drag-drop' | 'speaking' | 'listening' | 'writing' | 'translation';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    content: {
      question?: string;
      options?: string[];
      correctAnswer?: string;
      pairs?: Record<string, string>;
      correctOrder?: string[];
      imageUrl?: string;
      audioUrl?: string;
      instructions: string;
      hints: string[];
    };
    metadata: {
      targetSkills: string[];
      prerequisites: string[];
      learningObjectives: string[];
      estimatedTime: number;
    };
    adaptiveSettings: {
      progressionRules: {
        minScore: number;
        requiredAttempts: number;
      };
      difficultyAdjustment: {
        increase: number;
        decrease: number;
      };
    };
  }>;
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

// Add this color array at the top with your other constants
const TOPIC_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-rose-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-gray-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-fuchsia-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-zinc-500',
  'bg-slate-500'
];
// Add this helper function
const getRandomColor = (index: number): string => {
  return TOPIC_COLORS[index % TOPIC_COLORS.length];
};

const TopicCard = ({ topic, isUnlocked, onSubtopicClick }: TopicCardProps) => {
  return (
    <Card className={`${topic.color || 'bg-primary'} text-white rounded-xl mb-6`}>
      <CardHeader className="p-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          {!isUnlocked && <Lock className="h-5 w-5" />}
          {topic.title}
        </CardTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {topic.subtopics.map((subtopic) => (
            <Card 
              key={subtopic.id}
              className={cn(
                "bg-white/10 hover:bg-white/20 transition-colors cursor-pointer",
                !isUnlocked && "opacity-50 pointer-events-none"
              )}
              onClick={() => onSubtopicClick(subtopic, topic)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{subtopic.duration || 15} minutes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{subtopic.lessons?.length || 0} Lessons</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardHeader>
    </Card>
  );
};

// Add this interface for topic progress
interface TopicProgress {
  id: string;
  isCompleted: boolean;
  isUnlocked: boolean;
}

interface ActiveClassInfo {
  class: SchoolClass | null;
  schedule: string | null;
}

// Add this interface for lesson dialog state
interface LessonDialogState {
  isLoading: boolean;
  error: string | null;
  content: string | null;
}

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
  const [grades, setGrades] = useState<GradeWithHierarchy[]>([]);
  const [topics, setTopics] = useState<TopicWithHierarchy[]>([]);
  const [subtopics, setSubtopics] = useState<SubtopicWithHierarchy[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<GradeWithHierarchy | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<TopicWithHierarchy | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<SubtopicWithHierarchy | null>(null);
  const [processedTopics, setProcessedTopics] = useState<TopicWithHierarchy[]>([]);
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [selectedLessonInDialog, setSelectedLessonInDialog] = useState<LessonWithContent | null>(null);
  const [activeClassInfo, setActiveClassInfo] = useState<ActiveClassInfo>({ class: null, schedule: null });
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [dialogLoadingState, setDialogLoadingState] = useState<{
    isLoading: boolean;
    error: string | null;
  }>({
    isLoading: true,
    error: null
  });

  const { ref: scrollRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [lessonState, setLessonState] = useState<{
    content: any;
    isLoading: boolean;
    error: string | null;
  }>({
    content: null,
    isLoading: false,
    error: null
  });

  const [answerState, setAnswerState] = useState<Record<string, string>>({});
  const [successSound] = useSound('/sounds/success.mp3', { volume: 0.5 });
  const { toast: showToast } = useToast();

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
                color: getRandomColor(index),
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

  useEffect(() => {
    if (selectedGrade?.topics) {
      const processed: TopicWithHierarchy[] = selectedGrade.topics.map((topic: TopicWithHierarchy, index: number) => ({
        ...topic,
        color: getRandomColor(index),
        subtopics: topic.subtopics.map((subtopic: SubtopicWithHierarchy, subIndex: number) => ({
          ...subtopic,
          color: getRandomColor(subIndex + selectedGrade.topics.length)
        }))
      }));
      
      setProcessedTopics(processed);
      if (processed.length > 0 && !selectedTopic) {
        setSelectedTopic(processed[0]);
      }
    }
  }, [selectedGrade?.topics, selectedTopic]);

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
        color: getRandomColor(index),
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

  const handleStartLesson = async (lessonId: string) => {
    try {
      if (isLocked) return;
      
      // Create minimal state object for URL
      const urlState = {
        lessonId: lessonId,
        topicId: selectedTopic?.id,
        subtopicId: selectedSubtopic?.id
      };

      // Store full state data in localStorage
      const fullState = {
        lesson: selectedLessonInDialog,
        topic: selectedTopic,
        subtopic: selectedSubtopic,
        hierarchyInfo: {
          topicId: selectedTopic?.id,
          subtopicId: selectedSubtopic?.id
        }
      };
      
      localStorage.setItem(`lesson_state_${lessonId}`, JSON.stringify(fullState));
      
      // Construct the URL with minimal parameters
      const searchParams = new URLSearchParams();
      searchParams.set('state', JSON.stringify(urlState));
      
      // Get the base URL from Vite's env or window.location
      const baseUrl = import.meta.env.BASE_URL || '';
      const lessonUrl = `${window.location.origin}${baseUrl}/#/teacher/lessons/${lessonId}?${searchParams.toString()}`;

      // Close the dialog first
      setDialogOpen(false);

      // Use a small delay to ensure dialog is closed before opening new tab
      setTimeout(() => {
        const newWindow = window.open('about:blank', '_blank');
        if (newWindow) {
          newWindow.location.href = lessonUrl;
        }
      }, 100);

    } catch (error) {
      console.error('Error starting lesson:', error);
    }
  };

  const handleStartLessonFromDialog = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!selectedLessonInDialog?.id) {
      logger.warn('No lesson selected for dialog', {
        source: 'LearningPathTeacher',
        context: { action: 'startLesson' }
      });
      return;
    }

    try {
      // Get current auth session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error(sessionError?.message || 'No active session found');
      }

      logger.info('Starting lesson in dialog', {
        source: 'LearningPathTeacher',
        context: { 
          topicId: selectedTopic?.id,
          subtopicId: selectedSubtopic?.id,
          lessonId: selectedLessonInDialog.id,
          timestamp: new Date().toISOString()
        }
      });

      // Store lesson state with more context
      const lessonState = {
        lesson: selectedLessonInDialog,
        topic: selectedTopic,
        subtopic: selectedSubtopic,
        timestamp: new Date().toISOString(),
        user: session.user.id,
        context: {
          grade: selectedGrade?.name,
          topicName: selectedTopic?.title,
          subtopicTitle: selectedSubtopic?.title
        }
      };
      
      // Store in both sessionStorage and localStorage for redundancy
      sessionStorage.setItem(`lesson_state_${selectedLessonInDialog.id}`, JSON.stringify(lessonState));
      localStorage.setItem(`lesson_state_${selectedLessonInDialog.id}`, JSON.stringify(lessonState));
      
      // Close the selection dialog and open the lesson dialog
      setDialogOpen(false);
      setDialogLoadingState({ isLoading: true, error: null });

      // Set the current lesson ID and fetch its content
      setCurrentLessonId(selectedLessonInDialog.id);
      setIsLessonDialogOpen(true);
      
      // Fetch lesson content immediately
      setLessonState(prev => ({ ...prev, isLoading: true, error: null }));
      await fetchLessonContent(selectedLessonInDialog.id);
      
      logger.info('Lesson dialog opened', {
        source: 'LearningPathTeacher',
        context: { 
          lessonId: selectedLessonInDialog.id,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Failed to start lesson', {
        source: 'LearningPathTeacher',
        context: { 
          error,
          lessonId: selectedLessonInDialog.id
        }
      });
      setDialogLoadingState({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start lesson'
      });
      setLessonState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load lesson content'
      }));
    }
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

  const handleSubtopicClick = (subtopic: SubtopicWithHierarchy, topic: TopicWithHierarchy) => {
    setSelectedSubtopic(subtopic);
    setSelectedTopic(topic);
    setDialogOpen(true);
  };

  // Add this helper function to check if a topic should be unlocked
  const isTopicUnlocked = (topicIndex: number, topic: TopicWithHierarchy) => {
    // First two topics are always unlocked
    if (topicIndex <= 1) return true;
    
    // If topic has no lessons or content, it's unlocked
    if (!topic.subtopics?.some(sub => sub.lessons?.length && sub.lessons.length > 0)) return true;
    
    // Check if at least one of the first two topics is completed
    return topicProgress.slice(0, 2).some(p => p.isCompleted);
  };

  // Add this effect to initialize topic progress
  useEffect(() => {
    if (selectedGrade?.topics) {
      const initialProgress = selectedGrade.topics.map((topic, index) => ({
        id: topic.id,
        isCompleted: false,
        isUnlocked: index <= 1 // First two topics start unlocked
      }));
      setTopicProgress(initialProgress);
    }
  }, [selectedGrade?.topics]);

  // Add this effect to handle messages from the lesson iframe
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      switch (event.data.type) {
        case 'LESSON_LOADED':
          setDialogLoadingState({ isLoading: false, error: null });
          logger.info('Lesson loaded in iframe', {
            source: 'LearningPathTeacher',
            context: { 
              lessonId: event.data.lessonId,
              timestamp: event.data.timestamp
            }
          });
          break;

        case 'LESSON_ERROR':
          setDialogLoadingState({
            isLoading: false,
            error: event.data.error || 'Failed to load lesson'
          });
          logger.error('Lesson error in iframe', {
            source: 'LearningPathTeacher',
            context: { error: event.data.error }
          });
          break;

        case 'NAVIGATION_ATTEMPT':
          // Prevent navigation and keep the iframe state
          event.preventDefault();
          logger.warn('Navigation attempt prevented', {
            source: 'LearningPathTeacher',
            context: { timestamp: event.data.timestamp }
          });
          break;

        case 'LESSON_CONTEXT_RECEIVED':
          logger.info('Lesson context received confirmation', {
            source: 'LearningPathTeacher',
            context: { lessonId: event.data.lessonId }
          });
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const handleQuestionComplete = () => {
      const questions = lessonState.content?.questions || [];
      const answeredQuestions = Object.keys(answerState).length;

      if (questions.length > 0 && answeredQuestions === questions.length) {
        successSound();

        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }

          const particleCount = 50 * (timeLeft / duration);

          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
          });
        }, 250);

        showToast({
          title: "🎉 Congratulations!",
          description: "You've completed all questions in this lesson!",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const element = document.getElementById('activities-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <PartyPopper className="h-4 w-4 mr-2" />
              Continue to Activities
            </Button>
          )
        });

        return () => clearInterval(interval);
      }
    };

    handleQuestionComplete();
  }, [answerState, lessonState.content?.questions, successSound, showToast]);

  // Add fetchLessonContent function
  const fetchLessonContent = async (lessonId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      // Fetch lesson content with all related data
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select(`
          *,
          questions (
            *,
            exercise_prompts (*)
          ),
          activities (*)
        `)
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;
      if (!lessonData) throw new Error('No lesson data found');

      setLessonState({
        content: lessonData,
        isLoading: false,
        error: null
      });

      logger.info('Lesson content loaded', {
        source: 'LearningPathTeacher',
        context: { 
          lessonId,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      logger.error('Failed to load lesson content', {
        source: 'LearningPathTeacher',
        context: { error }
      });
      
      setLessonState({
        content: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load lesson content'
      });
    }
  };

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
    <>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header with Date and Time */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Learning Path</h1>
            <p className="text-gray-600">
              {selectedGrade?.name} • {format(new Date(), "EEEE, h:mm a, dd/MM/yyyy")}
            </p>
          </div>
          {activeClassInfo.class && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Active Class: {activeClassInfo.class.name}
              {activeClassInfo.schedule && <span className="ml-2 text-xs">({activeClassInfo.schedule})</span>}
            </Badge>
          )}
        </div>

        {/* Grade Selection */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            {grades
              .sort((a, b) => a.level - b.level)
              .map(grade => (
                <Card
                  key={grade.id}
                  className={cn(
                    "flex-shrink-0 cursor-pointer transition-all duration-200 min-w-[150px] sm:min-w-0",
                    selectedGrade?.id === grade.id && "border-primary border-l-4 border-l-primary hover:border-primary/50 bg-accent/55"
                  )}
                  onClick={() => setSelectedGrade(grade)}
                >
                  <CardHeader className="p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span className="font-medium">{grade.name}</span>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLock}
            className={cn(
              "transition-colors whitespace-nowrap ml-4",
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

        {/* Overview Section */}
        <Card className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <CardHeader className="p-4">
            <CardTitle className="text-xl sm:text-2xl mb-4">{selectedGrade?.classes[0]?.name}</CardTitle>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-blue-300 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {classStudents.length} Students
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen size={16} className="text-green-300 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {lessons.length} Lessons
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} className="text-purple-300 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {selectedGrade?.topics.length || 0} Topics
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 size={16} className="text-green-300 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {Math.round((topicProgress.filter(p => p.isCompleted).length / (topicProgress.length || 1)) * 100)}% Complete
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Topics Section with Scroll Effects */}
        <div 
          ref={scrollRef}
          className="space-y-6"
        >
          <AnimatePresence>
            {processedTopics.map((topic, topicIndex) => {
              const isUnlocked = isTopicUnlocked(topicIndex, topic);
              
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: topicIndex * 0.1 }}
                  className="w-full"
                >
                  <Card 
                    className={cn(
                      "transition-all duration-300",
                      "hover:shadow-lg",
                      !isUnlocked && "opacity-60"
                    )}
                  >
                    <CardHeader className={cn(
                      "p-6",
                      topic.color || "bg-primary",
                      "text-white rounded-t-xl"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {!isUnlocked ? (
                            <Lock className="h-6 w-6" />
                          ) : (
                            <BookOpen className="h-6 w-6" />
                          )}
                          <CardTitle className="text-2xl font-bold">
                            {topic.title}
                          </CardTitle>
                        </div>
                        <Badge 
                          variant="outline" 
                          className="bg-white/10 text-white border-white/20"
                        >
                          {topic.subtopics?.length || 0} Subtopics
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topic.subtopics?.map((subtopic) => (
                          <Card
                            key={subtopic.id}
                            className={cn(
                              "cursor-pointer transition-all duration-200",
                              "hover:shadow-md hover:border-primary/50",
                              !isUnlocked && "pointer-events-none"
                            )}
                            onClick={() => handleSubtopicClick(subtopic, topic)}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col gap-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-lg">
                                      {subtopic.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      Ready to start
                                    </p>
                                  </div>
                                  {!isUnlocked && (
                                    <Lock className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{subtopic.duration || 15} minutes</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-4 w-4" />
                                    <span>{subtopic.lessons?.length || 0} Lessons</span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Enhanced Lesson Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent 
            className="sm:max-w-[700px] max-h-[85vh] p-0"
            aria-labelledby="lesson-selection-title"
            aria-describedby="lesson-selection-description"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b">
                <DialogTitle id="lesson-selection-title" className="text-2xl flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  {selectedSubtopic?.title || 'Select a Lesson'}
                </DialogTitle>
                <DialogDescription id="lesson-selection-description" className="text-base font-medium text-foreground/90 mt-2">
                  {selectedTopic && selectedSubtopic ? (
                    <>
                      Select a lesson from <span className="font-bold">{selectedTopic.title}</span> ➡️ <span className="font-bold">{selectedSubtopic.title}</span> to begin learning. Each lesson includes interactive content, questions, and activities.
                    </>
                  ) : (
                    <>Select a lesson to begin learning.</>
                  )}
                </DialogDescription>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedSubtopic?.duration || 0} minutes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{selectedSubtopic?.lessons?.length || 0} Lessons</span>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-4">
                  {selectedSubtopic?.lessons?.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card 
                        className={cn(
                          "cursor-pointer transition-all duration-200 w-full",
                          "hover:shadow-md hover:border-primary/50",
                          selectedLessonInDialog?.id === lesson.id && "border-primary shadow-lg bg-accent/10"
                        )}
                        onClick={() => setSelectedLessonInDialog(lesson)}
                      >
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge variant="outline" className="bg-primary/5 px-3 py-1">
                                    Lesson {index + 1}
                                  </Badge>
                                  {selectedLessonInDialog?.id === lesson.id && (
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 px-3 py-1">
                                      Selected
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {lesson.description || "Start this lesson to begin learning"}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-muted-foreground border-t pt-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-primary/70" />
                                <span>{lesson.duration || 15} minutes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-primary/70" />
                                <span>{(lesson.questions || []).length} Questions</span>
                              </div>
                              {lesson.activities?.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-primary/70" />
                                  <span>{(lesson.activities || []).length} Activities</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              <DialogFooter className="p-6 border-t bg-accent/5 flex-shrink-0">
                <Button
                  onClick={handleStartLessonFromDialog}
                  className={cn(
                    "w-full sm:w-auto transition-all duration-300",
                    selectedLessonInDialog ? "bg-primary hover:bg-primary/90" : "",
                    "relative"
                  )}
                  disabled={!selectedLessonInDialog}
                >
                  <motion.div
                    className="flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {selectedLessonInDialog ? (
                      <>
                        Start Selected Lesson
                        <ArrowRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Select a Lesson
                        <BookOpen className="h-4 w-4" />
                      </>
                    )}
                  </motion.div>
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Full-screen Lesson Dialog */}
      <LessonDialog 
        isOpen={isLessonDialogOpen}
        onClose={() => {
          setIsLessonDialogOpen(false);
          setCurrentLessonId(null);
          setSelectedLessonInDialog(null);
          setLessonState({ content: null, isLoading: false, error: null });
        }}
        lessonContent={lessonState}
        currentLessonId={currentLessonId}
        onRetry={() => {
          if (currentLessonId) {
            setLessonState(prev => ({ ...prev, isLoading: true, error: null }));
            fetchLessonContent(currentLessonId);
          }
        }}
      />
    </>
  );
}