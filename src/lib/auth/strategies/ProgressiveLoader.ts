import { supabase } from '../../supabase';
import { LoadingMonitor, type MonitoringConfig } from '../../monitoring';
import { logger } from '../../logger';

export class ProgressiveLoader {
  private static STAGES = ['init', 'session', 'profile', 'complete'];
  private currentStage = 0;
  private loadingId?: string;
  private isCancelled = false;
  private loadingMonitor: LoadingMonitor;

  constructor(private component: string) {
    this.loadingMonitor = new LoadingMonitor(supabase, {
      maxTries: 3,
      intervalMs: 1000,
      timeoutMs: 5000
    } as MonitoringConfig);
  }

  public async start(): Promise<void> {
    if (this.isCancelled) return;
    this.loadingId = await this.loadingMonitor.startLoading(this.component);
    this.updateProgress(0);
  }

  public async nextStage(): Promise<void> {
    if (this.isCancelled) return;
    this.currentStage++;
    this.updateProgress(
      (this.currentStage / ProgressiveLoader.STAGES.length) * 100
    );
  }

  public complete(): void {
    if (this.isCancelled) return;
    if (this.loadingId) {
      this.loadingMonitor.endLoading(this.loadingId);
      this.loadingId = undefined;
    }
  }

  public error(err: Error): void {
    if (this.isCancelled) return;
    if (this.loadingId) {
      this.loadingMonitor.endLoading(this.loadingId);
      logger.error('Loading error', { 
        context: { error: err },
        source: 'ProgressiveLoader'
      });
      this.loadingId = undefined;
    }
  }

  public cancel(): void {
    this.isCancelled = true;
    if (this.loadingId) {
      this.loadingMonitor.endLoading(this.loadingId);
      this.loadingId = undefined;
    }
  }

  private updateProgress(percent: number): void {
    if (this.isCancelled) return;
    logger.debug(`Loading progress: ${percent}%`, {
      context: {
        component: this.component,
        stage: ProgressiveLoader.STAGES[this.currentStage],
        progress: percent
      },
      source: 'ProgressiveLoader'
    });
  }
}