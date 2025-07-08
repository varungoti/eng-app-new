import { supabase } from '../supabase';
import type { Database } from '../database.types';

// Type definitions matching Supabase schema
export type Grade = Database['public']['Tables']['grades']['Row'];
export type GradeInsert = Database['public']['Tables']['grades']['Insert'];
export type GradeUpdate = Database['public']['Tables']['grades']['Update'];

export type Topic = Database['public']['Tables']['topics']['Row'];
export type TopicInsert = Database['public']['Tables']['topics']['Insert'];
export type TopicUpdate = Database['public']['Tables']['topics']['Update'];

export type Subtopic = {
  id: string;
  title: string;
  description: string | null;
  topic_id: string;
  order_index: number | null;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
};

export type SubtopicInsert = Omit<Subtopic, 'id' | 'created_at' | 'updated_at' | 'lessons'>;
export type SubtopicUpdate = Partial<SubtopicInsert>;

export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type LessonInsert = Database['public']['Tables']['lessons']['Insert'];
export type LessonUpdate = Database['public']['Tables']['lessons']['Update'];

export type Question = Database['public']['Tables']['questions']['Row'];
export type QuestionInsert = Database['public']['Tables']['questions']['Insert'];
export type QuestionUpdate = Database['public']['Tables']['questions']['Update'];

export type ExercisePrompt = Database['public']['Tables']['exercise_prompts']['Row'];
export type ExercisePromptInsert = Database['public']['Tables']['exercise_prompts']['Insert'];
export type ExercisePromptUpdate = Database['public']['Tables']['exercise_prompts']['Update'];

// Repository functions to interact with the database
export const GradeRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('grades')
      .select('*')
      .order('level');
      
    if (error) throw error;
    return data;
  },
  
  async findById(id: string) {
    const { data, error } = await supabase
      .from('grades')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async create(grade: GradeInsert) {
    const { data, error } = await supabase
      .from('grades')
      .insert(grade)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async update(id: string, grade: GradeUpdate) {
    const { data, error } = await supabase
      .from('grades')
      .update(grade)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('grades')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};

export const TopicRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .order('order_index');
      
    if (error) throw error;
    return data;
  },
  
  async findByGradeId(gradeId: string) {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('grade_id', gradeId)
      .order('order_index');
      
    if (error) throw error;
    return data;
  },
  
  async findById(id: string) {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async create(topic: TopicInsert) {
    const { data, error } = await supabase
      .from('topics')
      .insert(topic)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async update(id: string, topic: TopicUpdate) {
    const { data, error } = await supabase
      .from('topics')
      .update(topic)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};

export const SubtopicRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('subtopics')
      .select('*')
      .order('order_index');
      
    if (error) throw error;
    return data;
  },
  
  async findByTopicId(topicId: string) {
    const { data, error } = await supabase
      .from('subtopics')
      .select('*')
      .eq('topic_id', topicId)
      .order('order_index');
      
    if (error) throw error;
    return data;
  },
  
  async findById(id: string) {
    const { data, error } = await supabase
      .from('subtopics')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async create(subtopic: SubtopicInsert) {
    const { data, error } = await supabase
      .from('subtopics')
      .insert(subtopic)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async update(id: string, subtopic: SubtopicUpdate) {
    const { data, error } = await supabase
      .from('subtopics')
      .update(subtopic)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('subtopics')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};

export const LessonRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_index');
      
    if (error) throw error;
    return data;
  },
  
  async findBySubtopicId(subtopicId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('subtopic_id', subtopicId)
      .order('order_index');
      
    if (error) throw error;
    return data;
  },
  
  async findById(id: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*, questions(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async create(lesson: LessonInsert) {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async update(id: string, lesson: LessonUpdate) {
    const { data, error } = await supabase
      .from('lessons')
      .update(lesson)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};

export const QuestionRepository = {
  async findByLessonId(lessonId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*, exercise_prompts(*)')
      .eq('lesson_id', lessonId)
      .order('order_index');
      
    if (error) throw error;
    return data;
  },
  
  async findById(id: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*, exercise_prompts(*)')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async create(question: QuestionInsert) {
    const { data, error } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async update(id: string, question: QuestionUpdate) {
    const { data, error } = await supabase
      .from('questions')
      .update(question)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};

export const ExercisePromptRepository = {
  async findByQuestionId(questionId: string) {
    const { data, error } = await supabase
      .from('exercise_prompts')
      .select('*')
      .eq('question_id', questionId)
      .order('order_index');
      
    if (error) throw error;
    return data;
  },
  
  async findById(id: string) {
    const { data, error } = await supabase
      .from('exercise_prompts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async create(prompt: ExercisePromptInsert) {
    const { data, error } = await supabase
      .from('exercise_prompts')
      .insert(prompt)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async update(id: string, prompt: ExercisePromptUpdate) {
    const { data, error } = await supabase
      .from('exercise_prompts')
      .update(prompt)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async delete(id: string) {
    const { error } = await supabase
      .from('exercise_prompts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  }
};

// Export all repositories in a single object for easier imports
export const models = {
  Grade: GradeRepository,
  Topic: TopicRepository,
  Subtopic: SubtopicRepository,
  Lesson: LessonRepository,
  Question: QuestionRepository,
  ExercisePrompt: ExercisePromptRepository
}; 