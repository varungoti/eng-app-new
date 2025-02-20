import { logger } from '../../logger';
import { monitors } from '../../monitoring';
import { WarningCache } from '../../monitoring/WarningCache';

const warningCache = new WarningCache(5000); // 5 seconds cache

export class LoadingStrategy {
  private loadingId?: string;
  private startTime: number = 0;
  private readonly SLOW_THRESHOLD = 1000; // 1 second threshold
  private warned = false;
  private isLoading = false;
  private progressCallbacks: ((progress: number) => void)[] = [];

  constructor(private component: string) {}

  public async start(): Promise<void> {
    if (this.isLoading) {
      logger.debug(`Loading already in progress for ${this.component}`, { source: this.component });
      return;
    }

    this.isLoading = true;
    this.startTime = performance.now();
    this.warned = false;
    this.loadingId = await monitors.loadingMonitor.startLoading(this.component);
    
    logger.debug(`Loading started for ${this.component}`, { source: this.component });
  }

  public updateProgress(percent: number): void {
    if (!this.isLoading) return;

    const duration = performance.now() - this.startTime;
    
    // Notify progress callbacks
    this.progressCallbacks.forEach(callback => callback(percent));
    
    if (!this.warned && duration > this.SLOW_THRESHOLD) {
      if (warningCache.shouldLog(`slow:${this.component}`)) {
        logger.debug(
          `Loading progress: ${percent}% - Duration: ${duration}ms (threshold: ${this.SLOW_THRESHOLD}ms)`,
          { source: this.component }
        );
      }
      this.warned = true;
    }
  }

  public onProgress(callback: (progress: number) => void): void {
    this.progressCallbacks.push(callback);
  }

  public removeProgressCallback(callback: (progress: number) => void): void {
    this.progressCallbacks = this.progressCallbacks.filter(cb => cb !== callback);
  }

  public end(error?: Error): void {
    if (!this.isLoading) return;

    if (this.loadingId) {
      monitors.loadingMonitor.endLoading(this.loadingId);
      this.loadingId = undefined;
    }

    const duration = performance.now() - this.startTime;
    
    if (error) {
      logger.error(
        `Loading failed for ${this.component} after ${duration}ms: ${error.message}`,
        { source: this.component }
      );
    } else {
      logger.debug(
        `Loading completed for ${this.component} in ${duration}ms`,
        { source: this.component }
      );
    }

    this.isLoading = false;
    this.progressCallbacks = [];
  }

  public isActive(): boolean {
    return this.isLoading;
  }

  public getDuration(): number {
    return this.isLoading ? performance.now() - this.startTime : 0;
  }
}