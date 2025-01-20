import type { UserRole } from './roles';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: UserRole;
  schoolId?: string;
  permissions?: string[];
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
  capacity: number;
  principalName: string;
  website?: string;
  establishedYear?: number;
  accreditationStatus?: string;
  facilities?: Record<string, any>;
  operatingHours?: {
    [day: string]: {
      open: string;
      close: string;
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
  studentCount?: number;
  staffCount?: number;
  classroomCount?: number;
  isBoarding?: boolean;
  transportationProvided?: boolean;
  curriculumType?: string[];
  languagesOffered?: string[];
  extracurricularActivities?: string[];
  grades?: string[];
}

export interface Grade {
  id: string;
  name: string; // e.g., "PP1", "Grade 1"
  level: number; // 0 for PP1, 1 for PP2, etc.
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
  gradeId: string;
  title: string;
  description: string;
  order: number;
}

export interface SubTopic {
  id: string;
  topicId: string;
  title: string;
  description: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  subtopicId: string;
  createdAt: string;
  updatedAt: string;
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
  description?: string;
  type: string;
  points: number;
  lessonId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  id: string;
  title: string;
  type: 'Speaking' | 'Listening' | 'Reading' | 'Writing' | 'Grammar';
  description: string;
  duration: number; // in minutes
  instructions: string[];
  materials?: string[];
}

export interface Class {
  id: string;
  schoolId: string;
  gradeId: string;
  teacherId: string;
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

export interface Quiz {
  id: string;
  title: string;
  classId: string;
  moduleId: string;
  questions: Question[];
  dueDate: string;
  status: 'pending' | 'active' | 'completed';
}

export interface Student {
  id: number;
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

type QuestionType = 'sentenceRepetition' | 'imageDescription' | 'videoDescription' | 'multipleChoice' | 'fillInBlank' | 'repeat';

interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  correctAnswer: string;
}

interface SentenceRepetitionQuestion extends BaseQuestion {
  type: 'sentenceRepetition';
  sentence: string;
}

interface ImageDescriptionQuestion extends BaseQuestion {
  type: 'imageDescription';
  imageUrl: string;
}

interface VideoDescriptionQuestion extends BaseQuestion {
  type: 'videoDescription';
  videoUrl: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multipleChoice';
  options: string[];
}

interface FillInBlankQuestion extends BaseQuestion {
  type: 'fillInBlank';
  sentence: string;
}

interface RepeatQuestion extends BaseQuestion {
  type: 'repeat';
  content: string;
}
export type QuestionUnion = SentenceRepetitionQuestion | ImageDescriptionQuestion | VideoDescriptionQuestion | MultipleChoiceQuestion | FillInBlankQuestion | RepeatQuestion;

export interface Subtopic {
  id: string;
  title: string;
  description?: string;
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

