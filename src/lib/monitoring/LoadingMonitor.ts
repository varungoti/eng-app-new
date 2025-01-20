import BaseMonitor from './BaseMonitor';
import type { LoadingState } from './types';
import { v4 as uuid } from 'uuid';
import type SupabaseClient from '@supabase/supabase-js/dist/module/SupabaseClient';

export interface MonitoringConfig {
  retryCount: number;
  retryInterval: number;
  timeoutMs: number;
  attempts: number;
  intervalMs: number;
  maxAttempts: number;
  retryDelay: number;
  timeoutDuration: number;
  maxTries: number;
  maxRetries: number;
  } 

class LoadingMonitor extends BaseMonitor {
  private loadingStates: Map<string, LoadingState> = new Map();

  async startLoading(component: string): Promise<string> {
    try {
      if (!component) {
        throw new Error('Component name is required');
      }

      const loadingId = uuid();
      const { error } = await (this.supabase as SupabaseClient)
        .from('loading_states')
        .insert({
          id: loadingId,
          component: component.toString(),
          status: 'started',
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Failed to start loading:', error);
        throw error;
      }
      
      return loadingId;
    } catch (err) {
      console.error('Error in startLoading:', err);
      throw err;
    }
  }

  endLoading(component: string) {
    try {
      const state = this.loadingStates.get(component);
      if (state && state.startTime) {
        state.isLoading = false;
        state.duration = Date.now() - state.startTime;
        this.loadingStates.set(component, state);
        this.log('info', `Ended loading: ${component}`, { duration: state.duration });
      }
    } catch (error) {
      this.log('error', `Error ending loading for ${component}`, error);
    }
  }

  getLoadingState(component: string): LoadingState {
    return this.loadingStates.get(component) || {
      isLoading: false,
      duration: 0
    };
  }
}

// Export both as default and named export
export { LoadingMonitor };
export default LoadingMonitor;