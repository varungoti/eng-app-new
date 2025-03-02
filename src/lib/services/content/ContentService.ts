import { supabase } from '../../supabase';
import { BaseService } from '../BaseService';
import type { Grade, Topic, SubTopic, Lesson, Question } from '../../../types';

export class ContentService extends BaseService {
  constructor() {
    super({
      name: 'ContentService',
      retryConfig: {
        maxRetries: 2,
        baseDelay: 300,
        maxDelay: 1000
      },
      cacheConfig: {
        ttl: 5 * 60 * 1000 // 5 minutes
      }
    });
  }

  async getGrades(): Promise<Grade[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('grades')
          .select('*')
          .order('level');

        if (error) throw error;
        return data;
      },
      'grades'
    );
  }

  async getTopics(): Promise<Topic[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('topics')
          .select('*')
          .order('order');

        if (error) throw error;
        return data;
      },
      'topics'
    );
  }

  async getSubTopics(): Promise<SubTopic[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('subtopics')
          .select('*')
          .order('order');

        if (error) throw error;
        return data;
      },
      'subtopics'
    );
  }

  async getLessons(): Promise<Lesson[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .order('order');

        if (error) throw error;
        return data;
      },
      'lessons'
    );
  }

  async getQuestions(): Promise<Question[]> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('order');

        if (error) throw error;
        return data;
      },
      'questions'
    );
  }

  async getQuestion(id: string): Promise<Question> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .eq('id', id)
          .single();  

        if (error) throw error;
        return data;
      },
      `question_${id}`
    );
  }

  async createQuestion(question: Omit<Question, 'id' | 'created_at'>): Promise<Question> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('questions')
          .insert(question)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    );
  }

  async updateQuestion(id: string, question: Partial<Question>): Promise<Question> {
    return this.executeWithRetry(
      async () => {
        const { data, error } = await supabase
          .from('questions')
          .update(question)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    );
  }



  // Add other content-related methods...
}