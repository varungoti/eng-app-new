export const CONTENT_ROUTES = {
  VIEW: '/content/view',
  EDIT: '/content/edit',
  LESSON_MANAGEMENT: '/content/lesson-management',
  BASE: '/content'
} as const;

export const TEACHER_ROUTES = {
  LESSONS: '/teacher/lessons',
  CLASSES: '/teacher/classes',
  STUDENTS: '/teacher/students',
  DASHBOARD: '/teacher/dashboard',
  BASE: '/teacher'
} as const;

export type ContentRoute = typeof CONTENT_ROUTES[keyof typeof CONTENT_ROUTES];
export type TeacherRoute = typeof TEACHER_ROUTES[keyof typeof TEACHER_ROUTES];