export interface Grade {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  gradeId: string;
}

export interface Lesson {
  id: string;
  title: string;
  gradeId: string;
  topicId: string;
}

export interface LessonManagementData {
  grades: Grade[];
  topics: Topic[];
  lessons: Lesson[];
} 