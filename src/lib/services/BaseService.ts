import { logger } from '../logger';
import { RetryStrategy } from '../db/retryStrategy';
import { LoadingStrategy } from '../auth/strategies/LoadingStrategy';
import { CacheStrategy } from '../auth/strategies/CacheStrategy';

export interface ServiceConfig {
  name: string;
  retryConfig?: {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
  };
  cacheConfig?: {
    ttl: number;
  };
}

export abstract class BaseService {
  protected retryStrategy: RetryStrategy;
  protected loadingStrategy: LoadingStrategy;
  protected cacheStrategy: CacheStrategy<any>;

  constructor(protected config: ServiceConfig) {
    this.retryStrategy = new RetryStrategy(config.retryConfig || {
      maxRetries: 2,
      baseDelay: 300,
      maxDelay: 1000
    });
    this.loadingStrategy = new LoadingStrategy(config.name);
    this.cacheStrategy = new CacheStrategy<any>({ ttl: config.cacheConfig?.ttl });
  }

  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    cacheKey?: string
  ): Promise<T> {
    try {
      // Check cache first if cacheKey provided
      if (cacheKey) {
        const cached = this.cacheStrategy.get(cacheKey);
        if (cached) return cached;
      }

      this.loadingStrategy.start();
      const result = await this.retryStrategy.execute(operation);

      // Cache result if cacheKey provided
      if (cacheKey) {
        this.cacheStrategy.set(cacheKey, result);
      }

      return result;
    } catch (err) {
      logger.error(`Service operation failed: ${this.config.name}`, {
        context: { error: err },
        source: this.config.name
      });
      throw err;
    } finally {
      this.loadingStrategy.end();
    }
  }
}