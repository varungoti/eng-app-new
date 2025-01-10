import { type Question } from './types';
import { QUESTION_TYPES, type QuestionType } from './constants';

// Improve validation result interface
interface ValidationResult {
  isValid: boolean;
  isDraft: boolean;
  errors: string[];
  warnings?: string[];
}

// Improve question validation
export const validateQuestion = (question: Question): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const result: ValidationResult = {
    isValid: true,
    isDraft: false,
    errors: [],
    warnings: []
  };

  // Check if question type is valid
  if (!question.type || !(question.type in QUESTION_TYPES)) {
    errors.push('Invalid question type');
    result.isValid = false;
    result.isDraft = true;
  }

  // Validate required fields
  if (!question.data.prompt?.trim()) {
    errors.push('Question prompt is required');
    result.isValid = false;
    result.isDraft = true;
  }

  if (!question.data.teacherScript?.trim()) {
    errors.push('Teacher script is required');
    result.isValid = false;
    result.isDraft = true;
  }

  // Type-specific validation
  const questionType = question.type as QuestionType;
  if (questionType === 'speaking' && !question.data.sampleAnswer?.trim()) {
    errors.push('Sample answer is required for speaking questions');
    result.isValid = false;
    result.isDraft = true;
  }

  if (questionType === 'multipleChoice') {
    if (!Array.isArray(question.data.options) || question.data.options.length < 2) {
      errors.push('Multiple choice questions require at least 2 options');
      result.isValid = false;
      result.isDraft = true;
    }
    
    if (question.data.correctAnswer === null || question.data.correctAnswer === undefined) {
      errors.push('Multiple choice questions require a correct answer');
      result.isValid = false;
      result.isDraft = true;
    }
  }

  if (questionType === 'writing') {
    if (!Array.isArray(question.data.keywords) || question.data.keywords.length === 0) {
      errors.push('Writing questions require at least 1 keyword');
      result.isValid = false;
      result.isDraft = true;
    }
  }

  // Add warnings for potential issues
  if (question.data.prompt.length > 500) {
    warnings.push('Question prompt is very long (>500 characters)');
  }

  if (question.exercisePrompts.length === 0) {
    warnings.push('No exercise prompts added yet');
  }
  result.errors = errors;
  result.warnings = warnings;
  return result;
}; 