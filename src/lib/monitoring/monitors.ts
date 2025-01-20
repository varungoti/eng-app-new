import { supabase } from '../supabase';
import { DataFlowMonitor } from './DataFlowMonitor';
import { DataLoadMonitor } from './DataLoadMonitor';
import { LoadingMonitor } from './LoadingMonitor';
import { DatabaseMonitor } from './DatabaseMonitor';

// Create a single config object
const config = {
  supabase,
  enableLogging: true,
  logLevel: 'info' as const,
  sampleRate: import.meta.env.DEV ? 1 : 0.1
};

// Create monitor instances
export const monitors = {
  databaseMonitor: new DatabaseMonitor(supabase, config),
  dataFlowMonitor: new DataFlowMonitor(supabase, config),
  dataLoadMonitor: new DataLoadMonitor(supabase, config),
  loadingMonitor: new LoadingMonitor(supabase)
} as const; 
export default monitors;