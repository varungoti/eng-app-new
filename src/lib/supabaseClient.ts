import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from './logger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

// Create a single instance of the Supabase client
export const supabaseClient: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Log initialization
logger.info('Supabase client initialized', {
  context: {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey
  },
  source: 'supabase'
});

// Check session on initialization
supabaseClient.auth.getSession().then(({ data: { session }, error }) => {
  logger.info('Initial session check', {
    context: {
      hasSession: !!session,
      error: error?.message || null,
      user: session?.user ? {
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role
      } : null
    },
    source: 'supabase'
  });
}).catch(error => {
  logger.error('Failed to check initial session', {
    context: { error },
    source: 'supabase'
  });
}); 