import { supabase } from "@/lib/supabase";

export async function trackLearningEvent(data: {
  userId: string;
  eventType: 'lesson_start' | 'lesson_complete' | 'quiz_attempt' | 'achievement_earned';
  metadata: Record<string, any>;
}) {
  const { error } = await supabase
    .from('learning_events')
    .insert({
      user_id: data.userId,
      event_type: data.eventType,
      metadata: data.metadata,
      created_at: new Date().toISOString()
    });

  if (error) throw error;
} 