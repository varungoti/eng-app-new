import { supabase } from '@/lib/supabase';
import type { Grade, Topic, Lesson } from '../types';

export const lessonService = {
  async getGrades(): Promise<Grade[]> {
    const { data, error } = await supabase
      .from('grades')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getTopics(gradeId: string): Promise<Topic[]> {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('grade_id', gradeId)
      .order('name');
    
    if (error) throw error;
    return data;
  },

  async getLessons(gradeId: string, topicId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('grade_id', gradeId)
      .eq('topic_id', topicId)
      .order('created_at');
    
    if (error) throw error;
    return data;
  }
}; 