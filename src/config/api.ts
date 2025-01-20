import { env } from './env';

export const API_ENDPOINTS = {
  LESSONS: `${env.API_URL}/lessons`,
  TOPICS: `${env.API_URL}/topics`,
  SUBTOPICS: `${env.API_URL}/subtopics`,
  GRADES: `${env.API_URL}/grades`,
  QUESTIONS: `${env.API_URL}/questions`,
  ACTIVITIES: `${env.API_URL}/activities`,
} as const;

export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_COUNT: 2,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      throw new ApiError(response.status, errorJson.message || 'API request failed');
    } catch {
      throw new ApiError(response.status, `API request failed: ${response.statusText}`);
    }
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  throw new ApiError(response.status, 'Invalid response format: Expected JSON');
} 