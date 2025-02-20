import type { SupabaseClient } from '@supabase/supabase-js';
import type { MonitoringConfig } from './types';

export class BaseMonitor {
  constructor(
    protected supabase: SupabaseClient | null,
    protected config: MonitoringConfig = {
      enableLogging: true,
      logLevel: 'info',
      sampleRate: 1
    }
  ) {}

  protected log(level: 'info' | 'warn' | 'error', message: string, data?: any) {
    if (this.config.enableLogging) {
      console[level](message, data);
    }
  }
}

// Add a default export as well
export default BaseMonitor; 