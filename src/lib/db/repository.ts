import { supabase } from '../supabase';
//import type { Database } from '../database.types';
//import { Grade, Topic, SubTopic, Lesson, Question, ExercisePrompt } from '@/types/';

// Repository class methods updated to match the current database schema
export class Repository {
  // Grade methods
  static async getGrades({ page = 1, pageSize = 10, includeContent = false }) {
    const skip = (page - 1) * pageSize;
    
    const { data: grades, error, count } = await supabase
      .from('grades')
      .select(includeContent ? 'id, name, level, description, created_at, updated_at, topics(id, title, description, order_index, grade_id, subtopics(id, title, description, order_index, topic_id, lessons(*)))' : '*', 
        { count: 'exact' })
      .order('level', { ascending: true })
      .range(skip, skip + pageSize - 1);

    if (error) throw error;

    return {
      grades: grades || [],
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    };
  }

  static async findGradeByName(name: string) {
    const { data, error } = await supabase
      .from('grades')
      .select('*')
      .ilike('name', name)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async createGrade(data: {
    name: string;
    description?: string;
    level: number;
  }) {
    const { data: grade, error } = await supabase
      .from('grades')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return grade;
  }

  static async updateGrade(
    gradeId: string,
    data: {
      name?: string;
      description?: string;
      level?: number;
    }
  ) {
    const { data: grade, error } = await supabase
      .from('grades')
      .update(data)
      .eq('id', gradeId)
      .select()
      .single();
    
    if (error) throw error;
    return grade;
  }

  static async deleteGrade(gradeId: string) {
    const { data, error } = await supabase
      .from('grades')
      .delete()
      .eq('id', gradeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Topic methods
  static async getTopics(gradeId: string, options: {
    includeContent?: boolean;
    includeBasic?: boolean;
    includeDetails?: boolean;
    includeStats?: boolean;
  } = {}) {
    try {
      console.log('Repository.getTopics - Starting with gradeId:', gradeId);
      
      const query = supabase
        .from('topics')
        .select(options.includeContent ? 
          'id, title, description, grade_id, order_index, total_subtopics, subtopics(id, title, description, order_index, topic_id, total_lessons, lessons(*))' : 
          'id, title, description, grade_id, order_index, total_subtopics')
        .eq('grade_id', gradeId)
        .order('order_index', { ascending: true });
      
      console.log('Repository.getTopics - Query created');
      
      const { data: topics, error } = await query;
      
      if (error) throw error;
      
      console.log('Repository.getTopics - Success, found topics:', topics?.length || 0);
      return { topics: topics || [] };
    } catch (error) {
      console.error('Error in Repository.getTopics:', error);
      throw error;
    }
  }

  static async createTopic(data: {
    title: string;
    description?: string;
    grade_id: string;
    order_index?: number;
  }) {
    const { data: topic, error } = await supabase
      .from('topics')
      .insert({
        title: data.title,
        description: data.description,
        grade_id: data.grade_id,
        order_index: data.order_index
      })
      .select()
      .single();
    
    if (error) throw error;
    return topic;
  }

  // SubTopic methods
  static async getSubTopics(topicId: string, options: { includeContent?: boolean } = {}) {
    const { data: subtopics, error } = await supabase
      .from('subtopics')
      .select(options.includeContent ? 'id, title, description, topic_id, order_index, total_lessons, lessons(*)' : 'id, title, description, topic_id, order_index, total_lessons')
      .eq('topic_id', topicId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return { subtopics: subtopics || [] };
  }

  static async createSubTopic(data: {
    title: string;
    description?: string;
    topic_id: string;
    order_index?: number;
  }) {
    const { data: subtopic, error } = await supabase
      .from('subtopics')
      .insert({
        title: data.title,
        description: data.description,
        topic_id: data.topic_id,
        order_index: data.order_index
      })
      .select()
      .single();
    
    if (error) throw error;
    return subtopic;
  }

  // Lesson methods
  static async getLessons(subtopicId: string) {
    try {
      console.log('Repository.getLessons - Starting with subtopicId:', subtopicId);
      
      const { data: lessons, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('subtopic_id', subtopicId)
        .order('order_index', { ascending: true })
        .order('title', { ascending: true });
      
      if (error) throw error;
      
      console.log('Repository.getLessons - Success, found lessons:', lessons?.length || 0);
      return lessons || [];
    } catch (error) {
      console.error('Error in Repository.getLessons:', error);
      throw error;
    }
  }

  static async getLesson(lessonId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getSubtopic(subtopicId: string) {
    const { data, error } = await supabase
      .from('subtopics')
      .select('*')
      .eq('id', subtopicId)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async createLesson(data: {
    title: string;
    description?: string;
    subtopic_id: string;
    content?: string;
    order_index?: number;
    status?: string;
    duration?: number;
    difficulty?: string;
    media_type?: string;
    media_url?: string;
    prerequisites?: string[];
    metadata?: Record<string, any>;
  }) {
    const { data: lesson, error } = await supabase
      .from('lessons')
      .insert({
        title: data.title,
        description: data.description,
        subtopic_id: data.subtopic_id,
        content: data.content,
        order_index: data.order_index,
        status: data.status || 'draft',
        duration: data.duration || 30,
        difficulty: data.difficulty || 'beginner',
        media_type: data.media_type,
        media_url: data.media_url,
        prerequisites: data.prerequisites || [],
        metadata: data.metadata || {}
      })
      .select()
      .single();
    
    if (error) throw error;
    return lesson;
  }

  static async updateLesson(
    lessonId: string,
    data: {
      title?: string;
      description?: string;
      subtopic_id?: string;
      content?: string;
      order_index?: number;
      status?: string;
      duration?: number;
      difficulty?: string;
      media_type?: string;
      media_url?: string;
      prerequisites?: string[];
      metadata?: Record<string, any>;
    }
  ) {
    const { data: lesson, error } = await supabase
      .from('lessons')
      .update(data)
      .eq('id', lessonId)
      .select()
      .single();
    
    if (error) throw error;
    return lesson;
  }

  static async deleteLesson(lessonId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Questions methods
  static async getQuestions(lessonId: string) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
  
  static async createQuestion(data: {
    title: string;
    content?: string;
    type: string;
    lesson_id: string;
    points?: number;
    metadata?: Record<string, any>;
    order_index?: number;
    data?: Record<string, any>;
    correct_answer?: string;
    duration?: number;
    sub_type?: string;
  }) {
    const { data: question, error } = await supabase
      .from('questions')
      .insert({
        title: data.title,
        content: data.content,
        type: data.type,
        lesson_id: data.lesson_id,
        points: data.points || 0,
        metadata: data.metadata || {},
        order_index: data.order_index,
        data: data.data || {},
        correct_answer: data.correct_answer,
        duration: data.duration || 30,
        sub_type: data.sub_type
      })
      .select()
      .single();
    
    if (error) throw error;
    return question;
  }

  // Exercise Prompts methods
  static async getExercisePrompts(questionId: string) {
    const { data, error } = await supabase
      .from('exercise_prompts')
      .select('*')
      .eq('question_id', questionId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
  
  static async createExercisePrompt(data: {
    text: string;
    media?: string;
    type?: string;
    narration?: string;
    saytext?: string;
    question_id: string;
    order_index: number;
    voice_id?: string;
    metadata?: any[];
  }) {
    const { data: prompt, error } = await supabase
      .from('exercise_prompts')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return prompt;
  }

  // School methods
  static async getSchools() {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data || [];
  }
  
  static async getSchool(schoolId: string) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Class methods
  static async getClass(classId: string) {
    const { data: grade, error } = await supabase
      .from('classes')
      .select('*, grade:grade_id(*)')
      .eq('id', classId)
      .single();
    
    if (error) throw error;
    return grade;
  }

  static async getClassSchedule(classId: string) {
    try {
      const { data, error } = await supabase
        .from('assigned_content')
        .select('*, content:content_id(*)')
        .eq('class_id', classId)
        .order('valid_from', { ascending: true });
      
      if (error) throw error;
      return {
        upcomingClasses: data || []
      };
    } catch (error) {
      console.error('Error fetching class schedule:', error);
      // Return mock data for now
      return {
        upcomingClasses: [
          {
            id: 1,
            subject: "English Literature",
            time: "09:00 AM",
            students: 28,
            topic: "Shakespeare: Romeo & Juliet",
            room: "Room 101",
          },
          {
            id: 2,
            subject: "Creative Writing",
            time: "11:30 AM",
            students: 24,
            topic: "Character Development",
            room: "Room 203",
          },
        ]
      };
    }
  }

  static async getTopStudents(classId: string, limit: number = 5) {
    try {
      const { data: students, error } = await supabase
        .from('class_students')
        .select('student:student_id(*)')
        .eq('class_id', classId)
        .limit(limit);
      
      if (error) throw error;
      
      if (students && students.length > 0) {
        return {
          students: students.map(s => {
            // Use a type assertion to help TypeScript understand the structure
            const student = (s as any).student || {};
            return {
              id: student.id || 'unknown',
              name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unknown Student',
              progress: Math.floor(Math.random() * 100) // Mock progress for now
            };
          })
        };
      }
      
      // Return mock data if no students found
      return {
        students: [
          {
            id: 1,
            name: "Emma Thompson",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            progress: 92,
          },
          {
            id: 2,
            name: "Michael Chen",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            progress: 88,
          },
        ]
      };
    } catch (error) {
      console.error('Error fetching top students:', error);
      // Return mock data on error
      return {
        students: [
          {
            id: 1,
            name: "Emma Thompson",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            progress: 92,
          },
          {
            id: 2,
            name: "Michael Chen",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            progress: 88,
          },
        ]
      };
    }
  }
}