/**
 * Environment configuration
 * This file provides environment variables with fallbacks
 */

// Helper function to get environment variables with fallbacks
const getEnv = (key, defaultValue = '') => {
  if (typeof window !== 'undefined') {
    return window.ENV?.[key] || import.meta.env[`VITE_${key}`] || defaultValue;
  }
  return import.meta.env[`VITE_${key}`] || defaultValue;
};

export const env = {
  // API URLs
  API_URL: getEnv('API_URL', 'http://localhost:3000/api'),
  
  // Supabase configuration
  SUPABASE_URL: getEnv('SUPABASE_URL', 'https://your-supabase-url.supabase.co'),
  SUPABASE_ANON_KEY: getEnv('SUPABASE_ANON_KEY', ''),
  
  // Application settings
  APP_NAME: getEnv('APP_NAME', 'SpeakWell Admin'),
  APP_VERSION: getEnv('APP_VERSION', '0.1.0'),
  
  // Feature flags
  ENABLE_ANALYTICS: getEnv('ENABLE_ANALYTICS', 'false') === 'true',
  ENABLE_MONITORING: getEnv('ENABLE_MONITORING', 'true') === 'true',
  
  // Environment
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  IS_PRODUCTION: getEnv('NODE_ENV', 'development') === 'production',
  IS_DEVELOPMENT: getEnv('NODE_ENV', 'development') === 'development',
  
  // Debug mode
  DEBUG: getEnv('DEBUG', 'false') === 'true',
};
