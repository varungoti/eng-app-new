
import { logger } from '../logger';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  size: number;
}

class CacheManager {
  private static instance: CacheManager;
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize = 50 * 1024 * 1024; // 50MB
  private currentSize = 0;

  private constructor() {
    this.startCleanup();
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  private startCleanup() {
    setInterval(() => this.cleanup(), 5 * 60 * 1000); // Cleanup every 5 minutes
  }

  private calculateSize(data: any): number {
    const str = JSON.stringify(data);
    return new Blob([str]).size;
  }

  private cleanup() {
    const now = Date.now();
    let freedSpace = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > 30 * 60 * 1000) { // 30 minutes TTL
        this.cache.delete(key);
        this.currentSize -= entry.size;
        freedSpace += entry.size;
      }
    }

    if (freedSpace > 0) {
      logger.info('Cache cleanup completed', {
        context: { freedSpace: `${(freedSpace / 1024 / 1024).toFixed(2)}MB` },
        source: 'CacheManager'
      });
    }
  }

  public set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    try {
      const size = this.calculateSize(data);

      // Check if adding this item would exceed max size
      if (size > this.maxSize) {
        throw new Error('Data too large to cache');
      }

      // Make room if needed
      while (this.currentSize + size > this.maxSize) {
        const oldestKey = Array.from(this.cache.entries())
          .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
        const oldEntry = this.cache.get(oldestKey);
        if (oldEntry) {
          this.currentSize -= oldEntry.size;
          this.cache.delete(oldestKey);
        }
      }

      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        size
      });
      this.currentSize += size;
    } catch (err) {
      logger.error('Failed to cache data', {
        context: { error: err, key },
        source: 'CacheManager'
      });
    }
  }

  public get<T>(key: string): T | null {
    try {
      const entry = this.cache.get(key);
      if (!entry) return null;

      const now = Date.now();
      if (now - entry.timestamp > 30 * 60 * 1000) { // 30 minutes TTL
        this.cache.delete(key);
        this.currentSize -= entry.size;
        return null;
      }

      return entry.data as T;
    } catch (err) {
      logger.error('Failed to retrieve cached data', {
        context: { error: err, key },
        source: 'CacheManager'
      });
      return null;
    }
  }

  public clear(): void {
    this.cache.clear();
    this.currentSize = 0;
  }

  public getStats() {
    return {
      entries: this.cache.size,
      currentSize: `${(this.currentSize / 1024 / 1024).toFixed(2)}MB`,
      maxSize: `${(this.maxSize / 1024 / 1024).toFixed(2)}MB`,
      utilization: `${((this.currentSize / this.maxSize) * 100).toFixed(1)}%`
    };
  }
}

export const cacheManager = CacheManager.getInstance();
