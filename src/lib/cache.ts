import { logger } from './logger';

class DataCache {
  private static instance: DataCache;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): DataCache {
    if (!DataCache.instance) {
      DataCache.instance = new DataCache();
    }
    return DataCache.instance;
  }

  public set(key: string, data: any): void {
    try {
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
    } catch (err) {
      logger.error('Failed to cache data', {
        context: { error: err, key },
        source: 'DataCache'
      });
    }
  }

  public get(key: string): any | null {
    try {
      const cached = this.cache.get(key);
      if (!cached) return null;

      if (Date.now() - cached.timestamp > this.TTL) {
        this.cache.delete(key);
        return null;
      }

      return cached.data;
    } catch (err) {
      logger.error('Failed to retrieve cached data', {
        context: { error: err, key },
        source: 'DataCache'
      });
      return null;
    }
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public prune(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.TTL) {
        this.cache.delete(key);
      }
    }
  }
}

export { DataCache };