import { supabase } from "@/lib/supabase";

interface Achievement {
  id: string;
  title: string;
  description: string;
  criteria: {
    type: 'lesson_completion' | 'quiz_score' | 'streak' | 'time_spent';
    threshold: number;
  };
  icon: string;
}

export async function checkAchievements(userId: string) {
  const { data: userStats, error: statsError } = await supabase
    .from('user_learning_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (statsError) throw statsError;

  const { data: achievements, error: achievementsError } = await supabase
    .from('achievements')
    .select('*')
    .eq('is_active', true);

  if (achievementsError) throw achievementsError;

  return achievements.filter((achievement: Achievement) => {
    switch (achievement.criteria.type) {
      case 'lesson_completion':
        return userStats.completed_lessons >= achievement.criteria.threshold;
      case 'quiz_score':
        return userStats.average_quiz_score >= achievement.criteria.threshold;
      case 'streak':
        return userStats.current_streak >= achievement.criteria.threshold;
      case 'time_spent':
        return userStats.total_time_spent >= achievement.criteria.threshold;
      default:
        return false;
    }
  });
} 