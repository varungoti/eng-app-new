import { logger } from '../../logger';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class CacheStrategy<T> {
  private cache = new Map<string, CacheEntry<T>>();
  
  constructor(private ttl: number = 5 * 60 * 1000) { // 5 minutes default TTL
    setInterval(() => this.cleanup(), 60000); // Cleanup every minute
  }

  get(key: string, ignoreTTL: boolean = false): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (!ignoreTTL && Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const authCache = new CacheStrategy<any>();