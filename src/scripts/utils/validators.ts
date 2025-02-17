import { dbConfig } from '../config/db-config'
import type { Topic, Subtopic, Lesson, Question, ExercisePrompt, Activity } from '@/types/index';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const validators = {
  validateString(value: string, maxLength: number, field: string): void {
    if (!value || value.trim().length === 0) {
      throw new ValidationError(`${field} cannot be empty`)
    }
    if (value.length > maxLength) {
      throw new ValidationError(`${field} exceeds maximum length of ${maxLength}`)
    }
  },

  validateOrderIndex(value: number): void {
    if (value < dbConfig.validation.minOrderIndex || value > dbConfig.validation.maxOrderIndex) {
      throw new ValidationError(`Order index must be between ${dbConfig.validation.minOrderIndex} and ${dbConfig.validation.maxOrderIndex}`)
    }
  },

  validateContentType(type: string): void {
    if (!dbConfig.validation.allowedContentTypes.includes(type)) {
      throw new ValidationError(`Invalid content type: ${type}`)
    }
  },

  validateDifficulty(difficulty: string): void {
    if (!dbConfig.validation.allowedDifficulties.includes(difficulty)) {
      throw new ValidationError(`Invalid difficulty level: ${difficulty}`)
    }
  }
} 