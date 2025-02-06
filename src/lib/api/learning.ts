import { supabase } from "@/lib/supabase";
import type { 
  Topic, 
  Lesson, 
  LessonProgress, 
  Activity,
  Question 
} from "@/types/learning";

export async function fetchLearningPath() {
  const { data, error } = await supabase
    .from('topics')
    .select(`
      *,
      subtopics (
        *,
        lessons (*)
      )
    `)
    .order('order');

  if (error) throw error;
  return data as Topic[];
}

export async function fetchLessonWithQuestions(lessonId: string) {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      *,
      questions!inner (
        *,
        exercise_prompts!inner (*)
      )
    `)
    .eq('id', lessonId)
    .single();

  if (error) throw error;
  return data as Lesson & { questions: Question[] };
}

export async function updateLessonProgress(
  progressId: string,
  updates: Partial<LessonProgress>
) {
  const { error } = await supabase
    .from('lesson_progress')
    .update(updates)
    .eq('id', progressId);

  if (error) throw error;
}

export async function fetchUserActivities(userId: string) {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Activity[];
}

export async function fetchAnalytics(userId: string) {
  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
} 