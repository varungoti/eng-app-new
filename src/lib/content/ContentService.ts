import { API_CONFIG, API_ENDPOINTS, ApiError } from '@/config/api';
import { supabase } from '@/lib/supabase';
import { Activity } from '@/app/content-management/types';
//import { Lesson } from '@/types/content';

interface CreateLessonInput {
  title: string;
  subtopicId: string;
  content?: string;
  order?: number;
  status?: 'draft' | 'published';
}

interface UpdateLessonInput {
  id: string;
  title?: string;
  content?: string;
  status?: 'draft' | 'published';
}

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface CreateQuestionInput {
  lessonId: string;
  content: string;
  type: 'multiple_choice' | 'true_false' | 'open_ended';
  options?: QuestionOption[];
  correctAnswer?: string;
}

interface CreateActivityInput {
  lessonId: string;
  title: string;
  description: string;
  type: 'exercise' | 'quiz' | 'project';
  content: string;
}

export class ContentService {
  private static instance: ContentService;

  private constructor() {}

  static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  async fetchGrades() {
    try {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('level');

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching grades:', error);
      throw error;
    }
  }
    
  async fetchTopics(gradeId: string) {
    try {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('grade_id', gradeId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw error;
    }
  }

  async fetchSubtopics(topicId: string) {
    try {
      const { data, error } = await supabase
        .from('subtopics')
        .select('*')
        .eq('topic_id', topicId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching subtopics:', error);
      throw error;
    }
  }

  async fetchLessons(subtopicId: string) {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('subtopic_id', subtopicId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }
  }

  async createTopic(data: { title: string; description?: string; gradeId: string }) {
    try {
      const response = await fetch(API_ENDPOINTS.TOPICS, {
        method: 'POST',
        headers: API_CONFIG.headers,
        body: JSON.stringify(data)
      });
      return this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to create topic');
    }
  }

  async createSubtopic(data: { title: string; topicId: string }) {
    try {
      const { data: newSubtopic, error } = await supabase
        .from('subtopics')
        .insert([{ 
          title: data.title, 
          topic_id: data.topicId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new ApiError(500, error.message);
      }

      return newSubtopic;
    } catch (error) {
      console.error('Error in createSubtopic:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to create subtopic');
    }
  }

  async createLesson(data: CreateLessonInput) {
    try {
      const { error, data: newLesson } = await supabase
        .from('lessons')
        .insert([{
          title: data.title,
          subtopic_id: data.subtopicId,
          content: data.content || '',
          order: data.order || 0,
          status: data.status || 'draft'
        }])
        .select('*')
        .single();

      if (error) throw error;
      return newLesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  }

  async deleteTopic(id: string) {
    try {
      const response = await fetch(`${API_ENDPOINTS.TOPICS}/${id}`, {
        method: 'DELETE',
        headers: API_CONFIG.headers
      });
      return this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to delete topic');
    }
  }

  async deleteSubtopic(id: string) {
    try {
      const response = await fetch(`${API_ENDPOINTS.SUBTOPICS}/${id}`, {
        method: 'DELETE',
        headers: API_CONFIG.headers
      });
      return this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to delete subtopic');
    }
  }

  async deleteLesson(id: string) {
    try {
      const response = await fetch(`${API_ENDPOINTS.LESSONS}/${id}`, {
        method: 'DELETE',
        headers: API_CONFIG.headers
      });
      return this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to delete lesson');
    }
  }

  async fetchLessonContent(lessonId: string) {
    try {
      // Get lesson data
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (lessonError) throw lessonError;

      // Get questions with exercise prompts using only existing columns
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select(`
          id,
          type,
          content,
          order_index,
          lesson_id,
          exercise_prompts (
            id,
            text,
            type,
            narration,
            saytext,
            media,
            question_id
          )
        `)
        .eq('lesson_id', lessonId)
        .order('order_index');

      if (questionsError) throw questionsError;

      // Transform the data to match frontend expectations
      const formattedQuestions = questions?.map((question: any) => ({
        id: question.id,
        type: question.type || 'multiple_choice',
        data: {
          prompt: question.content || '',
          teacherScript: '',
          options: [], // Default empty array for options
          correctAnswer: '' // Default empty string for correct answer
        },
        exercisePrompts: question.exercise_prompts?.map((prompt: any) => ({
          id: prompt.id,
          text: prompt.text || '',
          type: prompt.type || 'text',
          narration: prompt.narration || '',
          say_text: prompt.saytext || '',
          media: prompt.media || ''
        })) || []
      })) || [];

      return {
        ...lesson,
        questions: formattedQuestions
      };
    } catch (error) {
      console.error('Error in fetchLessonContent:', error);
      throw error;
    }
  }

  async fetchQuestions(lessonId: string) {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }

  async fetchActivities(lessonId: string) {
    console.log('Fetching activities for lessonId:', lessonId);
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  async createQuestion(data: CreateQuestionInput) {
    try {
      const { error, data: newQuestion } = await supabase
        .from('questions')
        .insert([{
          lesson_id: data.lessonId,
          content: data.content,
          type: data.type,
          options: data.options ? JSON.stringify(data.options) : null,
          correct_answer: data.correctAnswer || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return newQuestion;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  async deleteQuestion(id: string) {
    try {
      const response = await fetch(`${API_ENDPOINTS.QUESTIONS}/${id}`, {
        method: 'DELETE',
        headers: API_CONFIG.headers
      });
      return this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to delete question');
    }
  }

  async deleteActivity(id: string) {
    try {
      const response = await fetch(`${API_ENDPOINTS.ACTIVITIES}/${id}`, {
        method: 'DELETE',
        headers: API_CONFIG.headers
      });
      return this.handleResponse(response);
    } catch (error) {
      throw new Error('Failed to delete activity');
    }
  }

  async updateLesson(data: UpdateLessonInput) {
    try {
      const { error, data: updatedLesson } = await supabase
        .from('lessons')
        .update({
          title: data.title,
          content: data.content,
          status: data.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id)
        .select('*')
        .maybeSingle();

      if (error) throw error;
      if (!updatedLesson) throw new Error('Lesson not found');
      
      return updatedLesson;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  }

  async createActivity(data: CreateActivityInput) {
    try {
      const { error, data: newActivity } = await supabase
        .from('activities')
        .insert([{
          lesson_id: data.lessonId,
          title: data.title,
          description: data.description,
          type: data.type,
          content: data.content,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return newActivity;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  }

  async fetchQuestionsAndActivities(lessonId: string) {
    try {
      const [questions, activities] = await Promise.all([
        supabase
          .from('questions')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('created_at', { ascending: true }),
        supabase
          .from('activities')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('created_at', { ascending: true })
      ]);

      if (questions.error) throw questions.error;
      if (activities.error) throw activities.error;

      return {
        questions: questions.data || [],
        activities: activities.data || []
      };
    } catch (error) {
      console.error('Error fetching questions and activities:', error);
      return { questions: [], activities: [] };
    }
  }

  async saveActivity(activity: Activity): Promise<void> {
    const { error } = await supabase
      .from('activities')
      .upsert(activity, { onConflict: 'id' });
      
    if (error) throw error;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      throw new ApiError(response.status, 'API request failed');
    }
    return response.json();
  }
}

export const contentService = ContentService.getInstance();

