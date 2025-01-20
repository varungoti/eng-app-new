import { supabase } from '../../supabase';
import { LoadingMonitor } from './LoadingMonitor';
import { DataFlowMonitor } from '../DataFlowMonitor';
import { DataLoadMonitor } from '../DataLoadMonitor';

// Create singleton instances
const monitors = {
  loadingMonitor: new LoadingMonitor(null, {
    enableLogging: true,
    logLevel: 'info',
    sampleRate: 1
  }),

  dataFlowMonitor: new DataFlowMonitor(supabase, {
    supabase,
    enableLogging: true,
    logLevel: 'info',
    sampleRate: 1
  }),

  dataLoadMonitor: new DataLoadMonitor(supabase, {
    supabase,
    enableLogging: true,
    logLevel: 'info',
    sampleRate: 1
  })
};

export default monitors; 