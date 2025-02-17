import { logger } from './logger';

// Cache keys
export const CACHE_KEYS = {
  AI_CONTENT: 'ai:content:',
  AI_CONVERSATION: 'ai:conversation:',
  STUDENT_PROGRESS: 'student:progress:',
  CONTENT_ANALYTICS: 'content:analytics:',
} as const;

// Cache durations (in milliseconds)
export const CACHE_TTL = {
  CONTENT: 3600000, // 1 hour
  CONVERSATION: 1800000, // 30 minutes
  PROGRESS: 300000, // 5 minutes
  ANALYTICS: 900000, // 15 minutes
} as const;

interface CacheItem<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

export class LocalCache {
  static set<T>(key: string, value: T, ttl: number): void {
    try {
      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Cache Set Error:', error);
    }
  }

  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsedItem: CacheItem<T> = JSON.parse(item);
      const now = Date.now();

      if (now - parsedItem.timestamp > parsedItem.ttl) {
        // Cache expired
        localStorage.removeItem(key);
        return null;
      }

      return parsedItem.value;
    } catch (error) {
      console.error('Cache Get Error:', error);
      return null;
    }
  }

  static delete(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Cache Delete Error:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Cache Clear Error:', error);
    }
  }

  static clearPattern(pattern: string): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Cache Clear Pattern Error:', error);
    }
  }
}

// Memory cache for server-side operations (optional)
const memoryCache = new Map<string, CacheItem<any>>();

export class MemoryCache {
  static set<T>(key: string, value: T, ttl: number): void {
    try {
      const item: CacheItem<T> = {
        value,
        timestamp: Date.now(),
        ttl,
      };
      memoryCache.set(key, item);
    } catch (error) {
      console.error('Memory Cache Set Error:', error);
    }
  }

  static get<T>(key: string): T | null {
    try {
      const item = memoryCache.get(key) as CacheItem<T> | undefined;
      if (!item) return null;

      const now = Date.now();
      if (now - item.timestamp > item.ttl) {
        // Cache expired
        memoryCache.delete(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Memory Cache Get Error:', error);
      return null;
    }
  }

  static delete(key: string): void {
    try {
      memoryCache.delete(key);
    } catch (error) {
      console.error('Memory Cache Delete Error:', error);
    }
  }

  static clear(): void {
    try {
      memoryCache.clear();
    } catch (error) {
      console.error('Memory Cache Clear Error:', error);
    }
  }

  static clearPattern(pattern: string): void {
    try {
      for (const key of memoryCache.keys()) {
        if (key.includes(pattern)) {
          memoryCache.delete(key);
        }
      }
    } catch (error) {
      console.error('Memory Cache Clear Pattern Error:', error);
    }
  }
}

// Helper function to determine which cache to use
export function getCache<T>(key: string): T | null {
  // Try localStorage first
  const localValue = LocalCache.get<T>(key);
  if (localValue) return localValue;

  // Try memory cache as fallback
  return MemoryCache.get<T>(key);
}

export function setCache<T>(key: string, value: T, ttl: number): void {
  // Set in both caches
  LocalCache.set(key, value, ttl);
  MemoryCache.set(key, value, ttl);
}

export function deleteCache(key: string): void {
  LocalCache.delete(key);
  MemoryCache.delete(key);
}

export function clearCache(): void {
  LocalCache.clear();
  MemoryCache.clear();
}

export function clearPattern(pattern: string): void {
  LocalCache.clearPattern(pattern);
  MemoryCache.clearPattern(pattern);
}

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
      logger.error(`Failed to cache data for key ${key}: ${err}`, 'DataCache');
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
      logger.error(`Failed to retrieve cached data for key ${key}: ${err}`, 'DataCache');
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