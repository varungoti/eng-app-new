import { logger } from '../../logger';

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  timeout: number;
}

const DEFAULT_CONFIG: RetryConfig = {
  maxAttempts: 2, // Reduced from 3
  baseDelay: 300, // Reduced from 500
  maxDelay: 1000, // Reduced from 2000
  timeout: 2000 // Reduced from 3000
};

export class RetryStrategy {
  private config: RetryConfig;

  constructor(config: Partial<RetryConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.config.maxAttempts) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        try {
          const result = await Promise.race([
            operation(),
            new Promise<never>((_, reject) => {
              controller.signal.addEventListener('abort', () => {
                reject(new Error(`Operation timeout after ${this.config.timeout}ms`));
              });
            })
          ]);

          clearTimeout(timeoutId);
          return result;
        } catch (err) {
          clearTimeout(timeoutId);
          throw err;
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        attempt++;

        if (attempt < this.config.maxAttempts) {
          const delay = Math.min(
            this.config.baseDelay * Math.pow(1.5, attempt),
            this.config.maxDelay
          );

          logger.debug(`Retrying operation (attempt ${attempt + 1}/${this.config.maxAttempts})`, {
            context: { delay },
            source: 'RetryStrategy'
          });

          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
    }

    throw lastError;
  }
}