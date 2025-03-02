import { logger } from '../../logger';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  lastAccess: number;
  accessCount: number;
}

interface CacheOptions {
  ttl?: number;
  maxEntries?: number;
  cleanupInterval?: number;
}

const DEFAULT_OPTIONS: Required<CacheOptions> = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxEntries: 100,
  cleanupInterval: 60 * 1000 // 1 minute
};

export class CacheStrategy<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private options: Required<CacheOptions>;
  private cleanupTimer: NodeJS.Timeout;
  
  constructor(options: CacheOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.cleanupTimer = setInterval(() => this.cleanup(), this.options.cleanupInterval);
  }

  get(key: string, ignoreTTL: boolean = false): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      logger.debug(`Cache miss for key: ${key}`, { source: 'CacheStrategy' });
      return null;
    }

    const now = Date.now();
    
    if (!ignoreTTL && now - entry.timestamp > this.options.ttl) {
      logger.debug(`Cache entry expired for key: ${key}`, { source: 'CacheStrategy' });
      this.cache.delete(key);
      return null;
    }

    // Update access metadata
    entry.lastAccess = now;
    entry.accessCount++;
    
    logger.debug(`Cache hit for key: ${key}`, { source: 'CacheStrategy' });
    return entry.data;
  }

  set(key: string, data: T): void {
    // Ensure we don't exceed max entries
    if (this.cache.size >= this.options.maxEntries) {
      this.evictLeastRecentlyUsed();
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      lastAccess: now,
      accessCount: 0
    });
    
    logger.debug(`Cache set for key: ${key}`, { source: 'CacheStrategy' });
  }

  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestAccess = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccess < oldestAccess) {
        oldestAccess = entry.lastAccess;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      logger.debug(`Evicted least recently used cache entry: ${oldestKey}`, { source: 'CacheStrategy' });
    }
  }

  clear(): void {
    this.cache.clear();
    logger.debug('Cache cleared', { source: 'CacheStrategy' });
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  size(): number {
    return this.cache.size;
  }

  getStats(): { size: number; entries: { key: string; accessCount: number; age: number }[] } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      accessCount: entry.accessCount,
      age: now - entry.timestamp
    }));

    return {
      size: this.cache.size,
      entries
    };
  }

  private cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.options.ttl) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      logger.debug(`Cleaned up ${removedCount} expired cache entries`, { source: 'CacheStrategy' });
    }
  }

  dispose(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
  }
}

export const authCache = new CacheStrategy<unknown>();