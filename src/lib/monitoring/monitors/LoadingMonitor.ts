import { BaseMonitor } from '../BaseMonitor';
import type { LoadingState } from '../types';

export class LoadingMonitor extends BaseMonitor {
  private loadingStates: Map<string, LoadingState> = new Map();

  startLoading(component: string) {
    try {
      this.loadingStates.set(component, {
        isLoading: true,
        startTime: Date.now(),
        duration: 0
      });
      this.log('info', `Started loading: ${component}`);
    } catch (error) {
      this.log('error', `Error starting loading for ${component}`, error);
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