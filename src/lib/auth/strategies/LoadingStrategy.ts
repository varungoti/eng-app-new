import { logger } from '../../logger';
import { monitors } from '../../monitoring';
import { WarningCache } from '../../monitoring/WarningCache';

const warningCache = new WarningCache(5000); // Reduced to 5 seconds

export class LoadingStrategy {
  private loadingId?: string;
  private startTime: number = 0;
  private readonly SLOW_THRESHOLD = 1000; // Reduced to 1 second
  private warned = false;

  constructor(private component: string) {}

  public async start(): Promise<void> {
    this.startTime = performance.now();
    this.loadingId = await monitors.loadingMonitor.startLoading(this.component);
  }

  public updateProgress(percent: number): void {
    const duration = performance.now() - this.startTime;
    
    if (!this.warned && duration > this.SLOW_THRESHOLD) {
      if (warningCache.shouldLog(`slow:${this.component}`)) {
        logger.debug(`Loading progress: ${percent}% - Duration: ${duration}ms (threshold: ${this.SLOW_THRESHOLD}ms)`, this.component);
      }
      this.warned = true;
    }
  }

  public end(error?: Error): void {
    if (this.loadingId) {
      monitors.loadingMonitor.endLoading(this.loadingId);
      this.loadingId = undefined;

    }

  }
}