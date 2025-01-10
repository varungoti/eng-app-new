import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { logger } from './logger';
import { DEBUG_CONFIG } from './config';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
    flowType: 'pkce',
    debug: DEBUG_CONFIG.enabled,
    cookieOptions: {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'lax',
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
    schema: 'public',
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
const supabaseClient = createClient<Database>(
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
}, 4 * 60 * 1000); // Check every 4 minutes

// Export the Supabase client
export const supabase = supabaseClient;