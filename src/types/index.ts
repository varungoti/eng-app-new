import type { UserRole } from './roles';
import { QUESTION_TYPES } from "@/app/content-management/constants";
import { RoleSettings } from '@/types/dashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: UserRole;
  schoolId?: string;
  permissions?: string[];
}

export interface Course {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  level?: string;
  progress?: number;
}

export interface ClassData {
  id: number;
  attributes: {
    name: string;
    courses: {
      data: Array<{
        id: number;
        attributes: {
          title: string;
          description?: string;
          documentId: string;
          level?: string;
          progress?: number;
          imageUrl?: string;
        };
      }>;
    };
  };
}

export interface School {
  id: string;
  name: string;
  type: 'main' | 'branch';
  parentId?: string;
  address: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  email: string;
  status: 'active' | 'inactive';
  capacity: {
    total: number;
    current: number;
  };
  principalName: string;
  schoolType: 'public' | 'private' | 'charter' | 'religious' | 'other';
  schoolLevel: 'elementary' | 'middle' | 'high' | 'other';
  schoolLeader: string;
  schoolLeaderTitle: string;
  schoolLeaderEmail: string;
  schoolLeaderPhone: string;
  website?: string;
  establishedYear?: number;
  accreditationStatus?: string;
  facilities: string[];
  operatingHours: {
    [day: string]: {
      open: string;
      close: string;
      isHoliday?: boolean;
    };
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  emergencyContact?: string;
  taxId?: string;
  licenseNumber?: string;
  lastInspectionDate?: string;
  studentCount: number;
  staffCount: number;
  classroomCount: number;
  isBoarding: boolean;
  transportationProvided: boolean;
  curriculumType: string[];
  languagesOffered: string[];
  extracurricularActivities: string[];
  grades: string[];
  classes: Array<{
    gradeId: string;
    gradeName: string;
    sections: Array<{
      id: string;
      name: string; // e.g. "A", "B", "C"
      roomNumber: string;
      teacherId: string;
      capacity: number;
      schedule: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
      }[];
    }>;
  }>;
  branches?: School[];
  created_at: string;
  updated_at: string;
}

export interface SchoolBranch {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  latitude: number;
  longitude: number;
  contactNumber: string;
  email: string;
  schoolId: string; // Reference to parent school
  status: 'active' | 'inactive';
  capacity: {
    total: number;
    current: number;
  };
  administration: {
    principalName: string;
    principalEmail: string;
    principalPhone: string;
    administrativeStaff: Array<{
      name: string;
      role: string;
      email: string;
      phone: string;
    }>;
  };
  website?: string;
  establishedYear?: number;
  accreditationStatus?: string;
  facilities: string[];
  operatingHours: {
    [day: string]: {
      open: string;
      close: string;
      isHoliday?: boolean;
    };
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  emergencyContact: string;
  taxId: string;
  licenseNumber: string;
  lastInspectionDate?: string;
  studentCount: number;
  staffCount: number;
  classroomCount: number;
  isBoarding: boolean;
  transportationProvided: boolean;
  curriculumType: string[];
  languagesOffered: string[];
  extracurricularActivities: string[];
  grades: string[];
  created_at: string;
  updated_at: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
  created_at?: string;
  updated_at?: string;
  topics?: Topic[];
  description?: string;
  students: number;
  schedule: string;
  progress?: number;
  nextLesson?: string;
  studentIds?: number[];
  maxStudents?: number;
  lessonIds?: number[];
  assignments?: number[];
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  grade_id: string;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  course_id: string | null; // uuid
  // subtopics?: Array<Subtopic & {
  //   lessons?: Array<Lesson>;
  // }>;
  subtopics?: Subtopic[];
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
  title: string;
  topicId: string;
  description: string | null;
  order: number | null;
  order_index: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content?: string | null;
  grade_id?: string | null;
  topic_id?: string | null;
  subtopic_id: string;
  questions?: Question[];
  activities?: Activity[];
  order_index?: number | null;
  duration?: number | null;
  subjectId?: string | null;
  status?: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
  description?: string | null;
  prerequisites?: string[];
  media_type?: 'image' | 'video' | 'document';
  media_url?: string | null;
  contentheading: string | null;
  user_id: string | null; // uuid
  student_id: string;
  lesson_status: 'not_started' | 'in_progress' | 'completed';
    progress_data: {
    lastQuestionIndex?: number;
    answers?: Record<string, any>;
    totalSteps?: number;
    completedSteps?: number;
    activities?: Record<string, any>;
  };
  completed_at?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  voice_id?: string;
  total_questions?: number;
}


export interface LessonProgress {
  id: string;
  lesson_id: string;
  student_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
    progress_data: {
    lastQuestionIndex?: number;
    answers?: Record<string, any>;
    totalSteps?: number;
    completedSteps?: number;
    activities?: Record<string, any>;
  };
  completed_at?: string;
  completed_questions: string[];
  progress: number;
}

export interface Exercise {
  id: string;
  prompt: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gif';
  sayText: string;
  questions: Question[];
}

export interface ContentModule {
  id: string;
  title: string;
  gradeId: string;
  description: string;
  learningObjectives: string[];
  type: 'vocabulary' | 'pronunciation' | 'conversation' | 'grammar';
  content: {
    questions: Question[];
    activities: Activity[];
  };
}

export interface Question {
  id: string;
  title: string;
  content?: string;
  type: string;
  sub_type?: string;
  points?: number;
  lesson_id: string;
  data?: {
    prompt: string;
    teacherScript: string;
    sampleAnswer?: string;
    metadata?: {
      prompt?: string;
      sampleAnswer?: string;
      storyPrompt?: string;
      keywords?: string[];
      hints?: string[];
      audioContent?: string;
      transcript?: string;
      questions?: string[];
      phrases?: string[];
      translations?: string[];
      options?: string[];
      correctAnswer?: number | null;
      grammarPoint?: string;
      example?: string;
      idiom?: string;
      meaning?: string;
      usageNotes?: string;
      imageUrl?: string;
      imageCaption?: string;
      speakingPrompt?: string;
      speakingPrompt2?: string;
      helpfulVocabulary?: string[];
      videoUrl?: string;
      discussionPoints?: string[];
      topic?: string;
      position?: string;
      keyPoints?: string[];
      duration?: string;
      structure?: Array<{ title: string; points: string[] }>;
      visualAids?: Array<{ url: string; description: string }>;
      visualAidsInstructions?: string;
      matching?: Array<{ text: string; correct: boolean }>;
      fillInTheBlank?: Array<{ sentence: string; blanks: string[] }>;
      fillInTheBlankWithMultipleChoices?: Array<{
        sentence: string;
        blanks: string[];
        options: string[];
        correctAnswer: number;
      }>;
      trueOrFalse?: Array<{ sentence: string; correctAnswer: boolean }>;
      readingComprehension?: Array<{ passage: string; questions: string[] }>;
      speakingAndWriting?: Array<{ speakingPrompt: string; writingPrompt: string }>;
      listeningAndSpeaking?: Array<{ listeningPrompt: string; speakingPrompt: string }>;
      readingAndSpeaking?: Array<{ readingPrompt: string; speakingPrompt: string }>;
      speakingWithAPartner?: Array<{ speakingPrompt: string; partnerPrompt: string }>;
      actionAndReaction?: Array<{ action: string; reaction: string }>;
      actionAndSpeaking?: Array<{ action: string; speakingPrompt: string }>;
      vocabularyPractice?: Array<{
        word: string;
        spelling: string;
        definition: string;
        sentences: string[];
      }>;
      spellingPractice?: Array<{
        word: string;
        spelling: string;
        sentences: string[];
      }>;
      items?: string[];
    };
  };
  exercisePrompts: ExercisePrompt[];
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  status?: 'draft' | 'published';
  isDraft?: boolean;
  interval?: number;
  easeFactor?: number;
  score?: number
  correct?: boolean;
}

export interface Activity {
  id: string;
  created_at?: string;
  lesson_id: string;
  title: string;
  duration?: number;
  description?: string;
  type: string;
  content?: string;
  updated_at?: string;
  name: string;
  instructions?: string;
  data?: {
    prompt: string;
    teacherScript: string;
    media: string[];
  };
  media?: Array<{
    url: string;
    type: 'image' | 'gif' | 'video';
  }>;
  score?: number;
}

export interface Class {
  id: number;
  name: string;
  description: string | null;
  schoolId: string;
  grade_id: string;
  teacherId: string;
  section: string | null;
  created_by: string | null; // uuid
  created_at: Date;
  updated_at: Date;
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

export interface Quiz {
  id: number;
  title: string;
  classId: string;
  moduleId: string;
  questions: Question[];
  dueDate: string;
  status: 'pending' | 'active' | 'completed';
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  roll_number: string;
  school_id: string | null; // uuid
  grade_id: string | null; // uuid
  gender: string | null;
  date_of_birth: Date | null;
  contact_number: string | null;
  email: string | null;
  address: string | null;
  guardian_name: string | null;
  guardian_contact: string | null;
  created_at: Date;
  updated_at: Date;
  name: string;
  avatar: string;
  level: string;
  progress: number;
  attendance: number;
  recentScores: number[];
  strengths: string[];
  areasToImprove: string[];
}

export interface Assignment {
  id: number;
  title: string;
  dueDate: string;
  class: string;
  type: string;
  status: 'Pending' | 'Submitted' | 'Graded';
  submissions: number;
  totalStudents: number;}

export interface LessonWithExercises {
  id: string;
  title: string;
  exercises: Exercise[];
}

type QuestionType = keyof typeof QUESTION_TYPES;

export interface BaseQuestionData {
  prompt: string;
  teacherScript: string;
}

export interface ExercisePromptCardProps {
  prompt: ExercisePrompt;
  promptIndex: number;
  onUpdate: (updatedPrompt: ExercisePrompt) => void;
  onRemove: () => void;
}

export interface QuestionFormProps {
  question: Question;
  index: number;
  onUpdate: (index: number, updatedQuestion: Question) => Promise<void>;
  onRemove: (index: number) => void;
  onAddExercisePrompt: (questionIndex: number) => void;
  onRemoveExercisePrompt: (questionIndex: number, promptIndex: number) => void;
  onExercisePromptChange: (questionIndex: number, promptIndex: number, updatedPrompt: ExercisePrompt) => void;
}

export interface Subtopic {
  id: string;
  title: string;
  description?: string;
  topic_id: string;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  name?: string;
  lessons?: Lesson[];
}

export interface QuestionTypeSelectProps {
  value: string;
  onChange: (type: string) => void;
}

export interface Prompt {
  _id?: string;
  id?: string;
  prompt: string;
  created_at?: string;
  updated_at?: string;
  lessonId: string;
  description: string;
}

export interface ContentManagementData {
  grades: Grade[];
  topics: Topic[];
  subtopics: Subtopic[];
  lessons: Lesson[];
}

export interface DashboardProps {
  settings: RoleSettings;
}

export interface ClassTeacher {
  class_id: string; // uuid
  teacher_id: string; // uuid
  assigned_by: string | null; // uuid
  assigned_at: Date;
}

export interface ClassStudent {
  class_id: string; // uuid
  student_id: string; // uuid
  assigned_by: string | null; // uuid
  assigned_at: Date;
}

// Component Types
export interface ExtendedLesson extends Lesson {
  color: string;
  unlocked: boolean;
  completed: boolean;
  lessonNumber: string;
  totalTopics: string;
  difficulty: string;
  subLessons: SubLesson[];
}

export interface SubLesson {
  id: string;
  title: string;
  unlocked: boolean;
  completed?: boolean;
  duration?: number;
  description?: string;
}

export interface QueryConfig {
  table?: string;
  select?: string;
  orderBy?: string;
  limit?: number;
  offset?: number;
  retry?: number;
  gcTime?: number;
  staleTime?: number;
}

export interface CustomSubLesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  unlocked: boolean;
  completed: boolean;
}

export interface CustomLesson {
  id: string;
  title: string;
  status?: 'draft' | 'published';
  color: string;
  unlocked: boolean;
  completed: boolean;
  lessonNumber: string;
  totalTopics: string;
  difficulty: string;
  duration: number;
  customSubLessons: CustomSubLesson[];
}

export type { School as SchoolType };

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  school_id: string;
  created_at?: string;
  updated_at?: string;
}

