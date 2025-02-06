import { QUESTION_TYPES } from "../app/content-management/constants";

export type QuestionData = {
  prompt?: string;
  teacherScript?: string;
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
  helpfulVocabulary?: string[];
  videoUrl?: string;
  discussionPoints?: string[];
  topic?: string;
  position?: string;
  keyPoints?: string[];
  duration?: string;
  structure?: Array<{
    title: string;
    points?: string[];
  }>;
  visualAids?: Array<{
    url: string;
    description: string;
  }>;
  [key: string]: any; // Allow for additional properties
};

export interface Question {
  type: keyof typeof QUESTION_TYPES;
  data: QuestionData;
  exercisePrompts: ExercisePrompt[];
  isDraft?: boolean;
}

export interface ExercisePrompt {
  text: string;
  media: string;
  type: 'image' | 'gif' | 'video';
  narration: string;
  sayText: string;
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
  onUpdate: (index: number, updatedQuestion: Question) => void;
  onRemove: (index: number) => void;
  onAddExercisePrompt: (questionIndex: number) => void;
  onRemoveExercisePrompt: (questionIndex: number, promptIndex: number) => void;
  onExercisePromptChange: (questionIndex: number, promptIndex: number, updatedPrompt: ExercisePrompt) => void;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  gradeId: string;
  grade?: Grade;
  subtopics?: Subtopic[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtopic {
  id: string;
  title: string;
  description: string;
  topicId: string;
  topic?: Topic;
  lessons?: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  description: string;
  subtopicId: string;
  subtopic?: Subtopic;
  questions?: Question[];
  activities?: Activity[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  type: keyof typeof QUESTION_TYPES;
  lessonId: string;
  lesson?: Lesson;
  points: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  content: string;
  lessonId: string;
  lesson?: Lesson;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type QuestionType = 
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blanks'
  | 'matching'
  | 'short_answer'
  | 'essay';

export type ActivityType = 
  | 'quiz'
  | 'exercise' 
  | 'practice'
  | 'game'
  | 'project'; 