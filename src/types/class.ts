import type { User, Role } from './user';
import type { Grade, Topic, Subtopic, Lesson } from './content';

export interface Class {
  id: string;
  name: string;
  description?: string;
  grade: Grade;
  assignedTeachers: User[];
  students: User[];
  assignedContent: AssignedContent[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignedContent {
  id: string;
  classId: string;
  contentType: 'TOPIC' | 'SUBTOPIC' | 'LESSON';
  contentId: string;
  content: Topic | Subtopic | Lesson;
  validFrom: Date;
  validUntil: Date;
  assignedBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export type { Role }; 