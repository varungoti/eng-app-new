import { supabase } from '@/lib/supabase';

export async function isDuplicateGrade(name: string): Promise<boolean> {
  const { data } = await supabase
    .from('grades')
    .select('id')
    .ilike('name', name)
    .single();
  
  return !!data;
}

export async function isDuplicateTopic(title: string, gradeId: string): Promise<boolean> {
  const { data } = await supabase
    .from('topics')
    .select('id')
    .ilike('title', title)
    .eq('grade_id', gradeId)
    .single();
  
  return !!data;
}

export async function isDuplicateSubtopic(title: string, topicId: string): Promise<boolean> {
  const { data } = await supabase
    .from('subtopics')
    .select('id')
    .ilike('title', title)
    .eq('topic_id', topicId)
    .single();
  
  return !!data;
}

export async function isDuplicateLesson(title: string, subtopicId: string): Promise<boolean> {
  const { data } = await supabase
    .from('lessons')
    .select('id')
    .ilike('title', title)
    .eq('subtopic_id', subtopicId)
    .single();
  
  return !!data;
}

export async function isDuplicateQuestion(title: string, lessonId: string): Promise<boolean> {
  const { data } = await supabase
    .from('questions')
    .select('id')
    .ilike('title', title)
    .eq('lesson_id', lessonId)
    .single();
  
  return !!data;
} 