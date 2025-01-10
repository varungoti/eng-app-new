import { supabase } from '../supabase';
import { logger } from '../logger';
import { measurePerformance } from '../utils/performance';
import type { Grade, Topic, SubTopic, Lesson } from '../../types';

class ContentService {
  private static instance: ContentService;

  private constructor() {}

  public static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  public async fetchGrades(): Promise<Grade[]> {
    const endMetric = measurePerformance('fetchGrades');
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('level');

      if (error) throw error;
      endMetric();
      return data || [];
    } catch (err) {
      logger.error('Failed to fetch grades', {
        context: { error: err },
        source: 'ContentService'
      });
      throw err;
    }
  }

  public async fetchTopics(gradeId?: string): Promise<Topic[]> {
    const endMetric = measurePerformance('fetchTopics');
    try {
      let query = supabase.from('topics').select(`
        id,
        grade_id,
        title, 
        description,
        order
      `);
      
      if (gradeId) {
        query = query.eq('grade_id', gradeId);
      }
      
      const { data, error } = await query.order('order', { ascending: true });

      if (error) throw error;
      endMetric();
      
      logger.info('Topics fetched successfully', {
        context: { 
          count: data?.length || 0,
          gradeId
        },
        source: 'ContentService'
      });
      
      return data || [];
    } catch (err) {
      logger.error('Failed to fetch topics', {
        context: { error: err, gradeId },
        source: 'ContentService'
      });
      throw err;
    }
  }

  public async fetchSubTopics(topicId?: string): Promise<SubTopic[]> {
    const endMetric = measurePerformance('fetchSubTopics');
    try {
      let query = supabase.from('sub_topics').select('*');
      
      if (topicId) {
        query = query.eq('topic_id', topicId);
      }
      
      const { data, error } = await query.order('order');

      if (error) throw error;
      endMetric();
      return data || [];
    } catch (err) {
      logger.error('Failed to fetch sub-topics', {
        context: { error: err, topicId },
        source: 'ContentService'
      });
      throw err;
    }
  }

  public async fetchLessons(subTopicId?: string): Promise<Lesson[]> {
    const endMetric = measurePerformance('fetchLessons');
    try {
      let query = supabase
        .from('lessons')
        .select(`
          *,
          exercises (*)
        `);
      
      if (subTopicId) {
        query = query.eq('sub_topic_id', subTopicId);
      }
      
      const { data, error } = await query.order('order');

      if (error) throw error;
      endMetric();
      return data || [];
    } catch (err) {
      logger.error('Failed to fetch lessons', {
        context: { error: err, subTopicId },
        source: 'ContentService'
      });
      throw err;
    }
  }

  public async createContent(type: string, data: any) {
    const endMetric = measurePerformance('createContent');
    try {
      logger.info(`Creating new ${type}`, {
        context: { data },
        source: 'ContentService'
      });

      const { data: result, error } = await supabase
        .from(type)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      endMetric();
      
      logger.info(`Successfully created ${type}`, {
        context: { id: result.id },
        source: 'ContentService' 
      });
      
      return result;
    } catch (err) {
      logger.error(`Failed to create ${type}`, {
        context: { error: err, data },
        source: 'ContentService'
      });
      throw err;
    }
  }

  public async updateContent(type: string, id: string, data: any) {
    const endMetric = measurePerformance('updateContent');
    try {
      const { data: result, error } = await supabase
        .from(type)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      endMetric();
      return result;
    } catch (err) {
      logger.error(`Failed to update ${type}`, {
        context: { error: err, id, data },
        source: 'ContentService'
      });
      throw err;
    }
  }
}

export const contentService = ContentService.getInstance();