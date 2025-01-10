import { VALIDATION } from '../constants';

export const validateEmail = (email: string): string | null => {
  if (!email) return VALIDATION.REQUIRED_FIELD;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : VALIDATION.INVALID_EMAIL;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return VALIDATION.REQUIRED_FIELD;
  return password.length >= 8 ? null : VALIDATION.PASSWORD_MIN_LENGTH;
};

export const validateRequired = (value: any): string | null => {
  return value ? null : VALIDATION.REQUIRED_FIELD;
};