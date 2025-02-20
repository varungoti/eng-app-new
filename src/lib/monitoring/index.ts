import { DatabaseMonitor } from './DatabaseMonitor';
import { DataFlowMonitor } from './DataFlowMonitor';
import { DataLoadMonitor } from './DataLoadMonitor';
import { LoadingMonitor } from './LoadingMonitor';
import { supabase } from '../supabase';
import type { MonitoringConfig as Config } from './types';
import { logger } from '../logger';


export const config = {
  supabase,
  enableLogging: true,
  logLevel: 'info' as const,
  sampleRate: import.meta.env.DEV ? 1 : 0.1
};
const monitors = {
  databaseMonitor: new DatabaseMonitor(config),
  dataFlowMonitor: new DataFlowMonitor(supabase, config, logger), 
  dataLoadMonitor: new DataLoadMonitor(config),
  loadingMonitor: new LoadingMonitor(supabase, config)

} as const;

export { monitors };
export { DatabaseMonitor, DataFlowMonitor, DataLoadMonitor, LoadingMonitor };
export type { Config as MonitorConfig };