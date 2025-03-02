import { supabase } from './supabase';
import { logger } from './logger';

// Re-export the singleton instance
export const supabaseClient = supabase;

// Export a function to get the auth instance
export const getSupabaseAuth = () => supabaseClient.auth;

// Log initialization
logger.info(`Supabase client initialized`, { source: "supabase" });

// Check session on initialization
supabaseClient.auth.getSession().then(({ data: { session }, error }) => {
  logger.info(`Session check: ${session ? 'authenticated' : 'unauthenticated'}${error ? `, error: ${error.message}` : ''}`, { source: "supabase" });
}).catch(error => {
  logger.error(`Failed to check initial session: ${error.message}`, { source: "supabase" });
}); 