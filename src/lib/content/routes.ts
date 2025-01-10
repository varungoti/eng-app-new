export const CONTENT_ROUTES = {
  VIEW: '/content/view',
  EDIT: '/content/edit',
  LESSON_MANAGEMENT: '/content/lesson-management',
  BASE: '/content'
} as const;

export type ContentRoute = typeof CONTENT_ROUTES[keyof typeof CONTENT_ROUTES];