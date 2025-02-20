import type { Database } from '../../../lib/database.types';

export type Grade = Database['public']['Tables']['grades']['Row'];
export type Topic = Database['public']['Tables']['topics']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];

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