import type { Database } from '../../../lib/database.types';

export type Grade = Database['public']['Tables']['grades']['Row'];
export type Topic = Database['public']['Tables']['topics']['Row'];

// Define custom Lesson interface since it's not in Database type definition
export interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  subtopic_id: string;
  topic_id?: string;
  order_index?: number;
  created_at: string;
  updated_at?: string;
  status?: string;
}

export interface LessonManagementState {
  grades: Grade[];
  topics: Topic[];
  lessons: Lesson[];
  isLoading: boolean;
  error: Error | null;
}

export interface LessonManagementParams {
  gradeId: string | null;
  topicId: string | null;
} 