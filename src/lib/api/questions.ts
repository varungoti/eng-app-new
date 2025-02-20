import { supabase } from '@/lib/supabase';
import { Question, ExercisePrompt } from '@/types';

export const questionApi = {
  // Create a new question
  async createQuestion(question: Omit<Question, 'id'>) {
    const { data, error } = await supabase
      .from('questions')
      .insert([question])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update an existing question
  async updateQuestion(id: string, updates: Partial<Question>) {
    const { data, error } = await supabase
      .from('questions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a question
  async deleteQuestion(id: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get questions for a lesson
  async getLessonQuestions(lessonId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        exercise_prompts (*)
      `)
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Add exercise prompt to a question
  async addExercisePrompt(questionId: string, prompt: Omit<ExercisePrompt, 'id' | 'question_id'>) {
    const { data, error } = await supabase
      .from('exercise_prompts')
      .insert([{ ...prompt, question_id: questionId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update exercise prompt
  async updateExercisePrompt(id: string, updates: Partial<ExercisePrompt>) {
    const { data, error } = await supabase
      .from('exercise_prompts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete exercise prompt
  async deleteExercisePrompt(id: string) {
    const { error } = await supabase
      .from('exercise_prompts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get student progress for a question
  async getQuestionProgress(questionId: string, studentId: string) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('lesson_id', questionId)
      .eq('student_id', studentId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update student progress for a question
  async updateQuestionProgress(questionId: string, studentId: string, progress: any) {
    const { data, error } = await supabase
      .from('lesson_progress')
      .upsert({
        lesson_id: questionId,
        student_id: studentId,
        progress_data: progress,
        status: progress.completed ? 'completed' : 'in_progress',
        completed_at: progress.completed ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}; 