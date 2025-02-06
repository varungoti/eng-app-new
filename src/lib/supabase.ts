import { DEBUG_CONFIG } from './config';
import type { Database } from './database.types';
import { logger } from './logger';
import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient<Database> | null = null;

const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storageKey: 'sb-auth-token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
    debug: false,
    cookieOptions: {
      maxAge: 7 * 24 * 60 * 60,
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
    debug: false
  }
};

function validateEnvironment(): void {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
    );
  }
}

function createSupabaseClient(): SupabaseClient<Database> {
  validateEnvironment();

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (DEBUG_CONFIG.enabled) {
    logger.info('Creating Supabase client', {
      context: {
        url: supabaseUrl,
        hasKey: !!supabaseAnonKey
      },
      source: 'supabase'
    });
  }

  const client = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    supabaseOptions
  );

  if (DEBUG_CONFIG.enabled) {
    logger.info('Supabase client initialized', {
      source: 'supabase'
    });
  }

  return client;
}

function getSupabaseClient(): SupabaseClient<Database> {
  if (typeof window === 'undefined') {
    throw new Error('Supabase client can only be instantiated in browser environment');
  }

  if (!supabaseInstance) {
    supabaseInstance = createSupabaseClient();
  }

  return supabaseInstance;
}

// Initialize the client immediately but only once
if (typeof window !== 'undefined' && !supabaseInstance) {
  supabaseInstance = createSupabaseClient();
}

// Export both the instance and the getter
export const supabase = supabaseInstance!;
export const getSupabase = () => {
  if (!supabaseInstance) {
    supabaseInstance = getSupabaseClient();
  }
  return supabaseInstance;
};

// Export the type for use in other files
export type TypedSupabaseClient = SupabaseClient<Database>;

// Handle cleanup for HMR
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (DEBUG_CONFIG.enabled) {
      logger.info('Cleaning up Supabase client', {
        source: 'supabase'
      });
    }
    supabaseInstance = null;
  });
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
