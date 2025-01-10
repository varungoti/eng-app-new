import { logger } from '../../logger';
import { loadingMonitor } from '../../monitoring/LoadingMonitor';
import { WarningCache } from '../../monitoring/WarningCache';

const warningCache = new WarningCache(5000); // Reduced to 5 seconds

export class LoadingStrategy {
  private loadingId?: string;
  private startTime: number = 0;
  private readonly SLOW_THRESHOLD = 1000; // Reduced to 1 second
  private warned = false;

  constructor(private component: string) {}

  public start(): void {
    this.startTime = performance.now();
    this.loadingId = loadingMonitor.startLoading(this.component);
  }

  public updateProgress(percent: number): void {
    const duration = performance.now() - this.startTime;
    
    if (!this.warned && duration > this.SLOW_THRESHOLD) {
      if (warningCache.shouldLog(`slow:${this.component}`)) {
        logger.debug(`Loading progress: ${percent}%`, {
          context: { 
            component: this.component,
            duration,
            threshold: this.SLOW_THRESHOLD
          },
          source: this.component
        });
      }
      this.warned = true;
    }
  }

  public end(error?: Error): void {
    if (this.loadingId) {
      loadingMonitor.endLoading(this.loadingId, error);
      this.loadingId = undefined;
    }
  }
}