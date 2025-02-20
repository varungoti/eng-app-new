import { supabase } from '../../supabase';
import { LoadingMonitor } from './LoadingMonitor';
import { DataFlowMonitor } from '../DataFlowMonitor';
import { DataLoadMonitor } from '../DataLoadMonitor';
import { logger } from '@/lib/logger';

// Create singleton instances
const monitors = {
  loadingMonitor: new LoadingMonitor(supabase, {
    enableLogging: true,
    logLevel: 'info',
    sampleRate: 1,
    supabase
  }),

  dataFlowMonitor: new DataFlowMonitor(supabase, {
    enableLogging: true,
    logLevel: 'info',
    sampleRate: 1
  }, logger),

  dataLoadMonitor: new DataLoadMonitor({
    supabase,
    enableLogging: true,
    logLevel: 'info',
    sampleRate: 1
  })
};

export default monitors; 