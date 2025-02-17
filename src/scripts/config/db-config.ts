export const dbConfig = {
  tables: {
    grades: 'grades',
    topics: 'topics',
    subtopics: 'subtopics',
    lessons: 'lessons',
    questions: 'questions',
    exercise_prompts: 'exercise_prompts',
    activities: 'activities'
  },
  validation: {
    maxTitleLength: 255,
    maxDescriptionLength: 1000,
    allowedDifficulties: ['beginner', 'intermediate', 'advanced'],
    allowedContentTypes: ['speaking_practice', 'listening_practice', 'reading_practice'],
    minOrderIndex: 1,
    maxOrderIndex: 1000
  },
  batchSize: 50 // For batch inserts
}

export const logLevels = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING'
} as const 