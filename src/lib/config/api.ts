const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5173/api';

export const API_ENDPOINTS = {
  GRADES: `${BASE_URL}/api/grades`,
  TOPICS: `${BASE_URL}/api/topics`,
  SUBTOPICS: `${BASE_URL}/api/subtopics`,
  LESSONS: `${BASE_URL}/api/lessons`,
  QUESTIONS: `${BASE_URL}/api/questions`,
  ACTIVITIES: `${BASE_URL}/api/activities`,
} as const;

export const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Add any auth headers if needed
    // 'Authorization': `Bearer ${getToken()}`
  }
} as const;