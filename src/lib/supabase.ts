import { DEBUG_CONFIG } from './config';
//import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { logger } from './logger';
import { createBrowserClient } from '@supabase/ssr'
//import type { SupabaseClient as Client } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

//type SupabaseClient = Client<Database>;

if (!supabaseUrl || !supabaseAnonKey) {
  const error = 'Missing Supabase environment variables';
  logger.error(error, {
    context: {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    },
    source: 'SupabaseClient'
  });
  throw new Error(error);
}

// Configure Supabase client
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'sb-auth-token',
    storage: window.localStorage,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
    debug: DEBUG_CONFIG.enabled,
    cookieOptions: {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'lax' as const,
      secure: true
    },
  },
  global: {
    headers: { 
      'x-client-info': 'supabase-js',
      'x-application-name': 'speakwell-admin'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public' as const,
    debug: DEBUG_CONFIG.enabled
  }
};

// Log configuration in debug mode
if (DEBUG_CONFIG.enabled) {
  console.debug('[Supabase] Initializing with options:', {
    url: supabaseUrl ? '✓' : '✗',
    key: supabaseAnonKey ? '✓' : '✗',
    options: supabaseOptions
  });
}

// Create Supabase client with enhanced error handling
const supabaseClient = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  supabaseOptions
);

// Set up auto-refresh interval
setInterval(async () => {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (session && !error) {
      await supabaseClient.auth.refreshSession();
      logger.debug('Session refreshed automatically', {
        source: 'SupabaseClient'
      });
    }
  } catch (err) {
    logger.error('Failed to refresh session', {
      context: { error: err },
      source: 'SupabaseClient' 
    });
  }
}, 15 * 60 * 1000); // Check every 15 minutes


const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
export const createClient = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
export { supabase };
// Export the Supabase client
export { supabaseClient };
