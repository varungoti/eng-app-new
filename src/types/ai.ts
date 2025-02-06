import type { Topic, Subtopic, Lesson, SubLesson, Question, ExercisePrompt, Activity, LessonProgress } from './index';


export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type GameMode = 'assessment' | 'game';


export interface BaseAIComponentProps {
  studentAge: number;
  skillLevel: SkillLevel;
  onLoading: (loading: boolean) => void;
}

export interface AIConversationProps extends BaseAIComponentProps {
  mode: GameMode;
}

export interface AIFeedback {
  pronunciation?: number;
  grammar?: number;
  vocabulary?: number;
  fluency?: number;
  comprehension?: number;
}

export interface AIResponse {
  message: string;
  feedback?: AIFeedback;
  score?: number;
}

export interface ExerciseResult {
  score: number;
  feedback: AIFeedback;
  completedAt: string;
  nextRecommendation?: string;
}

export interface ProgressUpdate {
  skillType: keyof AIFeedback;
  currentLevel: number;
  improvement: number;
  nextMilestone: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  type: 'skill' | 'progress' | 'streak' | 'completion';
  icon: string;
}

export interface GameProgress {
  level: number;
  score: number;
  streak: number;
  achievements: Achievement[];
  skillLevels: Record<keyof AIFeedback, number>;
}

export interface AIConversation {
  id: string;
  studentId: string;
  teacherId: string;
  classId: string;
  conversationType: 'assessment' | 'practice' | 'feedback';
  messages: {
    role: 'system' | 'assistant' | 'user';
    content: string;
    timestamp: Date;
  }[];
  metadata: {
    topic?: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    languageArea: 'grammar' | 'vocabulary' | 'pronunciation' | 'comprehension';
  };
  feedback: {
    score: number;
    strengths: string[];
    areasToImprove: string[];
    recommendations: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface AIGeneratedContent {
  id: string;
  teacherId: string;
  contentType: 'exercise' | 'question' | 'lesson' | 'prompt';
  title: string;
  description: string;
  content: {
    type: string;
    data: any; // Structured content based on type
    metadata: {
      difficulty: 'beginner' | 'intermediate' | 'advanced';
      targetAge: number[];
      languageSkills: string[];
      estimatedDuration: number;
    };
  };
  usage: {
    timesUsed: number;
    lastUsed: Date;
    averageScore: number;
    studentFeedback: {
      rating: number;
      comments: string[];
    };
  };
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
} 

export interface StudentProgress {
  id: string;
  studentId: string;
  contentId: string; // Reference to AIGeneratedContent
  progress: {

    status: 'not_started' | 'in_progress' | 'completed';
    score: number;
    attempts: number;
    timeSpent: number;
    completedAt?: Date;
  };
  performance: {
    accuracy: number;
    speed: number;
    consistency: number;
    strengths: string[];
    weaknesses: string[];
  };
  feedback: {
    aiSuggestions: string[];
    teacherNotes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentAnalytics {
  id: string;
  contentId: string; // Reference to AIGeneratedContent
  metrics: {

    totalAttempts: number;
    averageScore: number;
    completionRate: number;
    averageTimeSpent: number;
    difficultyRating: number;
  };
  demographics: {
    ageGroups: Record<string, number>;
    skillLevels: Record<string, number>;
    successRates: Record<string, number>;
  };
  feedback: {
    studentRatings: number[];
    teacherRatings: number[];
    comments: {
      text: string;
      role: 'student' | 'teacher';
      rating: number;
      timestamp: Date;
    }[];
  };
  updatedAt: Date;
}

export type { Topic, Subtopic, Lesson, SubLesson, Question, ExercisePrompt, Activity, LessonProgress };
