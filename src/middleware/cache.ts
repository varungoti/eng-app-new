import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCache, setCache, CACHE_KEYS, CACHE_TTL } from '@/lib/redis';

export async function withCache(
  request: NextRequest,
  handler: () => Promise<NextResponse>
) {
  // Only cache GET requests
  if (request.method !== 'GET') {
    return handler();
  }

  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const id = url.searchParams.get('id');

  if (!type || !id) {
    return handler();
  }

  // Determine cache key and TTL based on request type
  let cacheKey: string;
  let cacheTTL: number;

  switch (type) {
    case 'content':
      cacheKey = `${CACHE_KEYS.AI_CONTENT}${id}`;
      cacheTTL = CACHE_TTL.CONTENT;
      break;
    case 'conversation':
      cacheKey = `${CACHE_KEYS.AI_CONVERSATION}${id}`;
      cacheTTL = CACHE_TTL.CONVERSATION;
      break;
    case 'student-progress':
      cacheKey = `${CACHE_KEYS.STUDENT_PROGRESS}${id}`;
      cacheTTL = CACHE_TTL.PROGRESS;
      break;
    default:
      return handler();
  }

  try {
    // Try to get from cache first
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // If not in cache, get from handler
    const response = await handler();
    const data = await response.json();

    // Cache the response
    await setCache(cacheKey, data, cacheTTL);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Cache Middleware Error:', error);
    return handler();
  }
}

export function generateCacheKey(type: string, id: string): string {
  switch (type) {
    case 'content':
      return `${CACHE_KEYS.AI_CONTENT}${id}`;
    case 'conversation':
      return `${CACHE_KEYS.AI_CONVERSATION}${id}`;
    case 'student-progress':
      return `${CACHE_KEYS.STUDENT_PROGRESS}${id}`;
    case 'analytics':
      return `${CACHE_KEYS.CONTENT_ANALYTICS}${id}`;
    default:
      throw new Error(`Invalid cache type: ${type}`);
  }
} 