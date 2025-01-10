// Environment configuration
const ENV = {
  isDev: import.meta.env.DEV,
  debugEnabled: import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true',
  debugLevel: import.meta.env.VITE_DEBUG_LEVEL || 'error',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};

// Debug configuration
export const DEBUG_CONFIG = {
  enabled: true, // Temporarily enable debug mode
  level: ENV.debugLevel as 'error' | 'warn' | 'info' | 'debug',
  showErrors: true,
  showWarnings: true,
  showInfo: true, // Enable info logging
  showDebug: true, // Enable debug logging
  showLoadingStates: ENV.isDev,
  showConnectionAttempts: ENV.isDev,
  showAuthEvents: ENV.isDev,
  stackTraceLimit: 50,
  logDatabaseQueries: ENV.isDev,
  performance: {
    logSlowQueries: true,
    slowQueryThreshold: 1000, // ms
    logSlowPageLoads: true,
    slowPageLoadThreshold: 3000, // ms
    logAuthEvents: true, // Enable auth event logging
    logStateChanges: true // Enable state change logging
  }
} as const;

// Database configuration
export const DB_CONFIG = {
  maxRetries: 5,
  retryDelay: 2000,
  healthCheckInterval: 30000,
  connectionTimeout: 15000, // Initial timeout per attempt
  maxTotalTime: 120000, // 2 minutes max total time
  url: ENV.supabaseUrl,
  anonKey: ENV.supabaseAnonKey,
  healthCheck: {
    timeout: 5000,
    enabled: true,
    table: '_health',
    warningThreshold: 3000 // Warn if health check takes longer than 3s
  }
} as const;