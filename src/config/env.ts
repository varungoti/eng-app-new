// Environment variables with type safety
interface Env {
  API_URL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
  NEXT_PUBLIC_AUTH_URL: string;
  NEXT_PUBLIC_ENABLE_ANALYTICS: boolean;
  NEXT_PUBLIC_ENABLE_LOGGING: boolean;
  NODE_ENV: string;
  IS_PRODUCTION: boolean;
}

export const env: Env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5173/api',
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  // Authentication
  NEXT_PUBLIC_AUTH_URL: import.meta.env.VITE_NEXT_PUBLIC_AUTH_URL || 'http://localhost:5173/auth',
  
  // Feature flags
  NEXT_PUBLIC_ENABLE_ANALYTICS: import.meta.env.VITE_NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  NEXT_PUBLIC_ENABLE_LOGGING: import.meta.env.VITE_NEXT_PUBLIC_ENABLE_LOGGING === 'true',
  
   // Environment
   NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
   IS_PRODUCTION: import.meta.env.VITE_NODE_ENV === 'production'
}as const;

// Validate environment variables
const requiredEnvVars: (keyof Env)[] = ['API_URL', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];

requiredEnvVars.forEach((key) => {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}); 

console.log(env);

