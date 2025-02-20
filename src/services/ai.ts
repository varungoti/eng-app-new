import { z } from 'zod';
import supabase from '@/lib/supabase/client';
import { CACHE_KEYS, CACHE_TTL, getCache, setCache } from '@/lib/cache';

// Validation schemas
const conversationSchema = z.object({
  studentId: z.string().uuid(),
  teacherId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  conversationType: z.enum(['assessment', 'practice', 'feedback']),
  message: z.string(),
});

const contentSchema = z.object({
  teacherId: z.string().uuid(),
  contentType: z.enum(['exercise', 'question', 'lesson', 'prompt']),
  title: z.string(),
  description: z.string().optional(),
  content: z.record(z.any()),
  metadata: z.object({
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    targetAge: z.array(z.number()),
    languageSkills: z.array(z.string()),
    estimatedDuration: z.number(),
  }),
});

export type Conversation = z.infer<typeof conversationSchema>;
export type Content = z.infer<typeof contentSchema>;

// API Functions
export async function createConversation(data: Conversation) {
  try {
    const validatedData = conversationSchema.parse(data);
    const { data: conversation, error } = await supabase
      .from('ai_conversations')
      .insert([{
        student_id: validatedData.studentId,
        teacher_id: validatedData.teacherId,
        class_id: validatedData.classId,
        conversation_type: validatedData.conversationType,
        messages: [{ role: 'user', content: validatedData.message }],
      }])
      .select()
      .single();

    if (error) throw error;
    return conversation;
  } catch (error) {
    console.error('Create Conversation Error:', error);
    throw error;
  }
}

export async function createContent(data: Content) {
  try {
    const validatedData = contentSchema.parse(data);
    const { data: content, error } = await supabase
      .from('ai_generated_content')
      .insert([{
        teacher_id: validatedData.teacherId,
        content_type: validatedData.contentType,
        title: validatedData.title,
        description: validatedData.description,
        content: validatedData.content,
        metadata: validatedData.metadata,
      }])
      .select()
      .single();

    if (error) throw error;
    return content;
  } catch (error) {
    console.error('Create Content Error:', error);
    throw error;
  }
}

export async function getConversation(id: string) {
  const cacheKey = `${CACHE_KEYS.AI_CONVERSATION}${id}`;

  try {
    // Try cache first
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    // If not in cache, get from database
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Cache the result
    setCache(cacheKey, data, CACHE_TTL.CONVERSATION);

    return data;
  } catch (error) {
    console.error('Get Conversation Error:', error);
    throw error;
  }
}

export async function getContent(id: string) {
  const cacheKey = `${CACHE_KEYS.AI_CONTENT}${id}`;

  try {
    // Try cache first
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    // If not in cache, get from database
    const { data, error } = await supabase
      .from('ai_generated_content')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Cache the result
    setCache(cacheKey, data, CACHE_TTL.CONTENT);

    return data;
  } catch (error) {
    console.error('Get Content Error:', error);
    throw error;
  }
}

export async function updateConversation(id: string, messages: any[], feedback: any) {
  try {
    const { data, error } = await supabase
      .from('ai_conversations')
      .update({
        messages,
        feedback,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update Conversation Error:', error);
    throw error;
  }
}

export async function updateContent(id: string, updates: Partial<Content> & { status?: string }) {
  try {
    const { data, error } = await supabase
      .from('ai_generated_content')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update Content Error:', error);
    throw error;
  }
}

export async function deleteConversation(id: string) {
  try {
    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete Conversation Error:', error);
    throw error;
  }
}

export async function deleteContent(id: string) {
  try {
    const { error } = await supabase
      .from('ai_generated_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete Content Error:', error);
    throw error;
  }
} 