import { logger } from '../logger';
import { WarningCache } from './WarningCache';

export interface LoadingState {
  id: string;
  component: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'pending' | 'complete' | 'error';
  error?: Error;
}

export class LoadingMonitor {
  private static instance: LoadingMonitor;
  private loadingStates: Map<string, LoadingState> = new Map();
  private warningCache = new WarningCache(30000); // 30 second cooldown
  private readonly SLOW_THRESHOLD = 3000; // 3 seconds

  private constructor() {
    setInterval(() => this.cleanup(), 60000);
  }

  public static getInstance(): LoadingMonitor {
    if (!LoadingMonitor.instance) {
      LoadingMonitor.instance = new LoadingMonitor();
    }
    return LoadingMonitor.instance;
  }

  public startLoading(component: string): string {
    const id = crypto.randomUUID();
    
    const existingState = Array.from(this.loadingStates.values())
      .find(state => state.component === component && state.status === 'pending');

    if (existingState) {
      if (this.warningCache.shouldLog(`supersede:${component}`)) {
        logger.warn(`Superseding existing loading state for ${component}`, {
          context: {
            oldId: existingState.id,
            newId: id,
            duration: performance.now() - existingState.startTime
          },
          source: 'LoadingMonitor'
        });
      }
      this.endLoading(existingState.id);
    }

    const state: LoadingState = {
      id,
      component,
      startTime: performance.now(),
      status: 'pending'
    };

    this.loadingStates.set(id, state);
    return id;
  }

  public endLoading(id: string, error?: Error): void {
    const state = this.loadingStates.get(id);
    if (!state || state.status !== 'pending') return;

    state.endTime = performance.now();
    state.duration = state.endTime - state.startTime;
    state.status = error ? 'error' : 'complete';
    if (error) state.error = error;

    if (!error && state.duration > this.SLOW_THRESHOLD) {
      if (this.warningCache.shouldLog(`slow:${state.component}`)) {
        logger.warn(`Slow loading detected: ${state.component}`, {
          context: {
            duration: state.duration,
            threshold: this.SLOW_THRESHOLD
          },
          source: 'LoadingMonitor'
        });
      }
    }

    setTimeout(() => {
      this.loadingStates.delete(id);
    }, 5000);
  }

  public getActiveLoadingStates(): LoadingState[] {
    return Array.from(this.loadingStates.values())
      .filter(state => state.status === 'pending')
      .sort((a, b) => a.startTime - b.startTime);
  }

  private cleanup(): void {
    const now = performance.now();
    for (const [id, state] of this.loadingStates.entries()) {
      if (state.status !== 'pending' && state.endTime && now - state.endTime > 300000) {
        this.loadingStates.delete(id);
      }
      if (state.status === 'pending' && now - state.startTime > 300000) {
        this.endLoading(id, new Error('Loading timeout'));
      }
    }
  }
}

export const loadingMonitor = LoadingMonitor.getInstance();