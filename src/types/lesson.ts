export interface LessonContent {
  id: string
  title: string
  content: string
  lessonId: string
  createdAt: string
  updatedAt: string
}

export interface CreateLessonContentInput {
  title: string
  content: string
  lessonId: string
} 