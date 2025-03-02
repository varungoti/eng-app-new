import { QuestionType } from '../utils/constants';

export interface Grade {
  _id?: string;
  id: string;
  name: string;
  level: number;
  orderIndex: number;
  topics: Topic[];
}

export interface Topic {
  _id?: string;
  id: string;
  name: string;
  title: string;
  grade_id: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  _id?: string;
  id: string;
  name: string;
  title: string;
  description?: string;
  topic_id: string;
  lessons: Lesson[];
  order_index: number;
}

export interface Lesson {
  _id?: string;
  id: string;
  title: string;
  content?: string;
  contentheading?: string;
  metadata?: LessonMetadata;
  subtopic_id: string;
  questions?: Question[];
  activities?: Activity[];
  status?: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface LessonMetadata {
  lastEdited?: string;
  version?: number;
  tags?: string[];
  status?: 'draft' | 'published';
  authorId?: string;
  duration?: number;
  transcript?: string;
}

export interface Question {
  id: string;
  type: QuestionType | string;
  lesson_id: string;
  title: string;
  metadata: Record<string, any>;
  data: QuestionData;
  exercisePrompts: ExercisePrompt[];
  isDraft?: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface QuestionData {
  prompt: string;
  teacher_script?: string;
  followup_prompt?: string[];
  sample_answer?: string;
  answer?: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  blanks?: string[];
  pairs?: { left: string; right: string }[];
  items?: string[];
  correctOrder?: string[];
  keywords?: string[];
  audioPrompt?: string;
  pronunciation?: string;
  audioContent?: string;
  transcript?: string;
  comprehensionQuestions?: Question[];
  targetPhrase?: string;
}

export interface ExercisePrompt {
  id: string;
  question_id: string;
  text: string;
  type: 'image' | 'gif' | 'video';
  narration: string;
  saytext: string;
  media: string | MediaItem[];
  created_at: string;
  updated_at: string;
  metadata?: {
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime?: number;
  };
}

export interface MediaItem {
  type: 'image' | 'gif' | 'video';
  url: string;
}

export interface Activity {
  id: string;
  lesson_id: string;
  type: 'practice' | 'exercise' | 'game';
  title: string;
  name: string;
  instructions: string;
  media: MediaItem[];
  data: {
    prompt: string;
    teacher_script: string;
    media: MediaItem[];
  };
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

export interface SaveStatus {
  id: string;
  status: 'draft' | 'saved' | 'saving' | 'error';
  lastSaved?: string;
} 