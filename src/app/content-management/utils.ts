import { type Question } from './types';
import { QUESTION_TYPES, type QuestionType } from './constants';

interface ValidationResult {
  isValid: boolean;
  isDraft: boolean;
  errors: string[];
}

export const validateQuestion = (question: Question): ValidationResult => {
  const errors: string[] = [];
  const result: ValidationResult = {
    isValid: true,
    isDraft: false,
    errors: []
  };

  // Check if question type is valid
  if (!question.type || !(question.type in QUESTION_TYPES)) {
    errors.push('Invalid question type');
    result.isValid = false;
    result.isDraft = true;
  }

  // Validate required fields
  if (!question.data?.prompt?.trim()) {
    errors.push('Question prompt is required');
    result.isValid = false;
    result.isDraft = true;
  }

  if (!question.data?.teacherScript?.trim()) {
    errors.push('Teacher script is required');
    result.isValid = false;
    result.isDraft = true;
  }

  // Type-specific validation
  const questionType = question.type as QuestionType;
  if (questionType === 'speaking' && !question.metadata?.sampleAnswer?.trim()) {
    errors.push('Sample answer is required for speaking questions');
    result.isValid = false;
    result.isDraft = true;
  }

  if (questionType === 'multipleChoice') {
    if (!Array.isArray(question.metadata?.options) || question.metadata?.options?.length < 2) {
      errors.push('Multiple choice questions require at least 2 options');
      result.isValid = false;
      result.isDraft = true;
    }
  }

  if (questionType === 'grammarSpeaking') {
    if (!Array.isArray(question.metadata?.keywords) || question.metadata?.keywords?.length === 0) {
      errors.push('Grammar speaking questions require at least 1 keyword');
      result.isValid = false;
      result.isDraft = true;
    }
  }

  if (questionType === 'fillInTheBlank') {
    if (!question.metadata?.answer?.trim()) {
      errors.push('Fill in the blank questions require an answer');
      result.isValid = false;
      result.isDraft = true;
    }
  }

  result.errors = errors;
  return result;
}; 