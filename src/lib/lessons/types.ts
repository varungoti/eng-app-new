export interface Lesson {
  id: string;
  title: string;
  description: string;
  status: LessonStatus;
  duration: number;
  subjectId: string;
  teacherId: string;
  classId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LessonStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled'; 