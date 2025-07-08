/**
 * Custom JSX runtime for TipTap
 * This file provides a workaround for the missing @tiptap/core/jsx-runtime module
 */

// Re-export React's JSX runtime
export { jsx, jsxs, Fragment } from 'react/jsx-runtime';
