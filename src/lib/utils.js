/**
 * Utility functions for the application
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string
 * Uses clsx for conditional classes and twMerge for Tailwind CSS class merging
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a string
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Truncates a string to a specified length
 */
export function truncate(str, length) {
  if (!str) return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

/**
 * Generates a random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Debounces a function
 */
export function debounce(fn, ms = 300) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Throttles a function
 */
export function throttle(fn, ms = 300) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= ms) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
