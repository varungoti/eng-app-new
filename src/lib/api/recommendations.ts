import { supabase } from "@/lib/supabase";

export async function getLearningPathRecommendations(userId: string) {
  // Fetch user's learning history and preferences
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('learning_style, interests, difficulty_preference')
    .eq('user_id', userId)
    .single();

  if (profileError) throw profileError;

  // Get available lessons filtered by user preferences
  const { data: recommendations, error: recommendationsError } = await supabase
    .from('lessons')
    .select(`
      *,
      topics (title),
      difficulty_level,
      tags
    `)
    .filter('difficulty_level', 'eq', userProfile.difficulty_preference)
    .filter('tags', 'cs-includes', userProfile.interests)
    .limit(5);

  if (recommendationsError) throw recommendationsError;

  return recommendations;
} 