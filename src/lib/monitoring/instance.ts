import { createClient } from '@supabase/supabase-js';
import { MonitoringSystem } from './MonitoringSystem';
import { supabase } from '../supabase';
import { env } from '@/config/env';

// Create a single monitoring system instance
const monitoringSystem = new MonitoringSystem({
  supabaseUrl: env.SUPABASE_URL,
  supabaseKey: env.SUPABASE_ANON_KEY,
  supabase,
  enableLogging: true,
  logLevel: 'info',
  sampleRate: import.meta.env.DEV ? 1 : 0.1
});

// Export monitor instances
export const dataFlowMonitor = monitoringSystem.getDataFlowMonitor();
export const dataLoadMonitor = monitoringSystem.getDataLoadMonitor();
export const databaseMonitor = monitoringSystem.getDatabaseMonitor();
export const loadingMonitor = monitoringSystem.getLoadingMonitor();

// Export a cleanup function if needed
export function cleanup() {
  databaseMonitor.cleanup();
} 

