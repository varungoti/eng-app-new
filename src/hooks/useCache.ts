import { useState } from 'react';
import { measurePerformance } from '../lib/utils/performance';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  size?: number;
}

class Cache {
  private static instance: Cache;
  private cache: Map<string, CacheItem<any>> = new Map();
  private maxSize: number = 50 * 1024 * 1024; // 50MB
  private currentSize: number = 0;

  private constructor() {}

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  public set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    const endMetric = measurePerformance('cache.set', { key });
    
    // Calculate size of data
    const size = this.calculateSize(data);
    
    // Check if adding this item would exceed max size
    if (size > this.maxSize) {
      throw new Error('Data too large to cache');
    }

    // Make room if needed
    while (this.currentSize + size > this.maxSize) {
      this.evictOldest();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      size
    });
    
    this.currentSize += size;
    endMetric();
  }

  public get<T>(key: string): T | null {
    const endMetric = measurePerformance('cache.get', { key });
    const item = this.cache.get(key);
    if (!item) {
      endMetric();
      return null;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      this.currentSize -= item.size || 0;
      endMetric();
      return null;
    }

    endMetric();
    return item.data as T;
  }

  public clear(): void {
    const endMetric = measurePerformance('cache.clear');
    this.cache.clear();
    this.currentSize = 0;
    endMetric();
  }

  private calculateSize(data: any): number {
    const str = JSON.stringify(data);
    return new Blob([str]).size;
  }

  private evictOldest(): void {
    let oldest: [string, CacheItem<any>] | null = null;
    
    for (const [key, item] of this.cache.entries()) {
      if (!oldest || item.timestamp < oldest[1].timestamp) {
        oldest = [key, item];
      }
    }

    if (oldest) {
      this.cache.delete(oldest[0]);
      this.currentSize -= oldest[1].size || 0;
    }
  }
}

export const useCache = () => {
  const cache = Cache.getInstance();
  const [version, setVersion] = useState(0);

  const invalidate = () => {
    cache.clear();
    setVersion(v => v + 1);
  };

  return {
    cache,
    version,
    invalidate
  };
};