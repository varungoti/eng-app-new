import { logger } from '../../logger';
import { loadingMonitor } from '../../monitoring/LoadingMonitor';

export class ProgressiveLoader {
  private static STAGES = ['init', 'session', 'profile', 'complete'];
  private currentStage = 0;
  private loadingId?: string;
  private isCancelled = false;

  constructor(private component: string) {}

  public start(): void {
    if (this.isCancelled) return;
    this.loadingId = loadingMonitor.startLoading(this.component);
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
      loadingMonitor.endLoading(this.loadingId);
      this.loadingId = undefined;
    }
  }

  public error(err: Error): void {
    if (this.isCancelled) return;
    if (this.loadingId) {
      loadingMonitor.endLoading(this.loadingId, err);
      this.loadingId = undefined;
    }
  }

  public cancel(): void {
    this.isCancelled = true;
    if (this.loadingId) {
      loadingMonitor.endLoading(this.loadingId);
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