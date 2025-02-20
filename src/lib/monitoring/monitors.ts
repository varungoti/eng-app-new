import { supabase } from '../supabase';
import { DataFlowMonitor } from './DataFlowMonitor';
import { DataLoadMonitor } from './DataLoadMonitor';
import { LoadingMonitor } from './LoadingMonitor';
import { DatabaseMonitor } from './DatabaseMonitor';
import { logger } from '@/lib/logger';

// Create a single config object
const config = {
  supabase,
  enableLogging: true,
  logLevel: 'info' as const,
  sampleRate: import.meta.env.DEV ? 1 : 0.1
};

// Create monitor instances
export const monitors = {
  databaseMonitor: new DatabaseMonitor(config),
  dataFlowMonitor: new DataFlowMonitor(supabase, config, logger),
  dataLoadMonitor: new DataLoadMonitor(config),
  loadingMonitor: new LoadingMonitor(supabase, config)
} as const; 
export default monitors;