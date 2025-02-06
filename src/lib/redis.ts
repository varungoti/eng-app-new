import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: import.meta.env.VITE_UPSTASH_REDIS_REST_URL,
  token: import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN,
});

// Cache keys
export const CACHE_KEYS = {
  AI_CONTENT: 'ai:content:',
  AI_CONVERSATION: 'ai:conversation:',
  STUDENT_PROGRESS: 'student:progress:',
  CONTENT_ANALYTICS: 'content:analytics:',
} as const;

// Cache durations (in seconds)
export const CACHE_TTL = {
  CONTENT: 3600, // 1 hour
  CONVERSATION: 1800, // 30 minutes
  PROGRESS: 300, // 5 minutes
  ANALYTICS: 900, // 15 minutes
} as const;

// Cache helper functions
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data as T;
  } catch (error) {
    console.error('Redis Get Error:', error);
    return null;
  }
}

export async function setCache(key: string, value: any, ttl: number = 3600): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttl });
  } catch (error) {
    console.error('Redis Set Error:', error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Redis Delete Error:', error);
  }
}

export async function invalidatePattern(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error('Redis Pattern Invalidation Error:', error);
  }
}

export default redis; 