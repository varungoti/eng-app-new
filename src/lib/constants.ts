// Authentication
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_NOT_CONFIRMED: 'Please verify your email address',
  TOO_MANY_REQUESTS: 'Too many attempts. Please try again later',
  NO_SESSION: 'No session created',
  DEFAULT: 'An unexpected error occurred'
} as const;

// API
export const API_ERRORS = {
  FETCH_FAILED: 'Failed to fetch data',
  UPDATE_FAILED: 'Failed to update data',
  DELETE_FAILED: 'Failed to delete data',
  CREATE_FAILED: 'Failed to create data'
} as const;

// Validation
export const VALIDATION = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters'
} as const;