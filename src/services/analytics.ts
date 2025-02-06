import supabase from '@/lib/supabase/client';
import { CACHE_KEYS, CACHE_TTL, setCache } from '@/lib/cache';

export interface AnalyticsEvent {
  contentId: string;
  studentId: string;
  eventType: 'view' | 'complete' | 'attempt' | 'feedback';
  metadata: {
    score?: number;
    timeSpent?: number;
    rating?: number;
    comment?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

export async function trackEvent(event: AnalyticsEvent) {
  const cacheKey = `${CACHE_KEYS.CONTENT_ANALYTICS}${event.contentId}`;

  try {
    // Update analytics in database
    const { data: analytics, error: analyticsError } = await supabase
      .from('ai_content_analytics')
      .upsert([
        {
          content_id: event.contentId,
          metrics: {
            totalAttempts: event.eventType === 'attempt' ? 1 : 0,
            averageScore: event.metadata.score || 0,
            completionRate: event.eventType === 'complete' ? 1 : 0,
            averageTimeSpent: event.metadata.timeSpent || 0,
            difficultyRating: event.metadata.difficulty ? 1 : 0,
          },
          demographics: {},
          feedback: event.metadata.comment
            ? {
                studentRatings: event.metadata.rating ? [event.metadata.rating] : [],
                comments: [
                  {
                    text: event.metadata.comment,
                    role: 'student',
                    rating: event.metadata.rating || 0,
                    timestamp: new Date(),
                  },
                ],
              }
            : {},
        },
      ], {
        onConflict: 'content_id',
      })
      .select()
      .single();

    if (analyticsError) throw analyticsError;

    // Update student progress
    const { error: progressError } = await supabase
      .from('student_ai_progress')
      .upsert([
        {
          student_id: event.studentId,
          content_id: event.contentId,
          progress: {
            status: event.eventType === 'complete' ? 'completed' : 'in_progress',
            score: event.metadata.score || 0,
            attempts: event.eventType === 'attempt' ? 1 : 0,
            timeSpent: event.metadata.timeSpent || 0,
          },
        },
      ], {
        onConflict: 'student_id,content_id',
      });

    if (progressError) throw progressError;

    // Update cache
    setCache(cacheKey, analytics, CACHE_TTL.ANALYTICS);

    return analytics;
  } catch (error) {
    console.error('Analytics Tracking Error:', error);
    throw error;
  }
}

export async function getContentAnalytics(contentId: string) {
  const cacheKey = `${CACHE_KEYS.CONTENT_ANALYTICS}${contentId}`;

  try {
    const { data: analytics, error } = await supabase
      .from('ai_content_analytics')
      .select('*')
      .eq('content_id', contentId)
      .single();

    if (error) throw error;

    // Update cache
    setCache(cacheKey, analytics, CACHE_TTL.ANALYTICS);

    return analytics;
  } catch (error) {
    console.error('Get Analytics Error:', error);
    throw error;
  }
}

export async function getStudentProgress(studentId: string, contentId: string) {
  const cacheKey = `${CACHE_KEYS.STUDENT_PROGRESS}${studentId}:${contentId}`;

  try {
    const { data: progress, error } = await supabase
      .from('student_ai_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('content_id', contentId)
      .single();

    if (error) throw error;

    // Update cache
    setCache(cacheKey, progress, CACHE_TTL.PROGRESS);

    return progress;
  } catch (error) {
    console.error('Get Progress Error:', error);
    throw error;
  }
}

export async function generateAnalyticsReport(contentId: string) {
  try {
    const [analytics, progress] = await Promise.all([
      supabase
        .from('ai_content_analytics')
        .select('*')
        .eq('content_id', contentId)
        .single(),
      supabase
        .from('student_ai_progress')
        .select('*')
        .eq('content_id', contentId),
    ]);

    if (analytics.error) throw analytics.error;
    if (progress.error) throw progress.error;

    const report = {
      contentId,
      metrics: analytics.data.metrics,
      demographics: analytics.data.demographics,
      feedback: analytics.data.feedback,
      studentProgress: progress.data.map((p: any) => ({
        studentId: p.student_id,
        status: p.progress.status,
        score: p.progress.score,
        attempts: p.progress.attempts,
        timeSpent: p.progress.timeSpent,
      })),
      generatedAt: new Date(),
    };

    return report;
  } catch (error) {
    console.error('Generate Report Error:', error);
    throw error;
  }
} 