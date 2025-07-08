import type { User, Role } from './user';
import type { Topic, Subtopic, Lesson } from './content';
//import { Module } from 'node:vm';
//import { supabase } from '../lib/supabase';

export interface School
{
  id: string;
  name: string;
  type: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  capacity?: number;
  established_year?: Date;
  facilities?: string[];
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  phone?: string;
  website?: string;
  logo?: string;
  operating_hours?: string[];
  emergency_contact?: string;
  tax_id?: string;
  license_number?: string;
  last_inspection_date?: Date;
  accreditation_status?: string;
  schoolLeader: User;
  schoolPrincipal: User;
  branch?: string;
  noOfStudents?: number;
  noOfTeachers?: number;
  noOfClasses?: number;
  Classroom_count?: number;
  is_boarding?: boolean;
  transportation_provided?: boolean;
  curriculum_type?: string;
  languages_offered?: string[];
  noOfBranches?: number;
  extracurricular_activities?: string[];
  SchoolStartDate?: Date; 
  SchoolEndDate?: Date;
  students: User[];
  teachers: User[];
  classes: Class[];
  schoolAdmins: User[];
  subjects: Course[];
  subjectsTaught: Course[];
  modules: Topic[];
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  name: string;
  classId: string;
  students: User[];
  roomNo: number;
  roomLocation: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface Class {
  id: string;
  name: string;
  description?: string;
  gradeId: string;
  section?: string;
  students: ClassStudent[];
  assignedContent: AssignedContent[];
  assignedTeachers: {
    id: string;
    name: string;
    email?: string;
    role?: string;
  }[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassStudent {
  id: string;
  classId: string;
  studentId: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    email: string;
    gradeId: string;
  };
  assignedBy: string;
  assignedAt: Date;
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

export interface Course {
  id: number;
  documentId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  level?: string;
  progress?: number;
}

export interface ClassData {
  id: number;
  attributes: {
    name: string;
    courses: {
      data: Array<{
        id: number;
        attributes: {
          title: string;
          description?: string;
          documentId: string;
          level?: string;
          progress?: number;
          imageUrl?: string;
        };
      }>;
    };
  };
}

export interface schoolAdminsprofile {
  id: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string;
  branch?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  school: School;
  classes: Class[];
}

export interface schoolTeachersprofile {
  id: string;
  name: string;
  email: string;
  role: Role;
  subjectsTaught: Course[]
  schoolId?: string;
  branch?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  school: School;
  classes: Class[];
}

export interface schoolStudentsprofile {
  id: string;
  name: string;
  classid: string;
  rollno: number; 
  email: string;
  role: Role;
  schoolId?: string;
  branch?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  grade: number;
  section: string;
}

export interface LessonProgress {
  lessonId: string;
  studentId: string;
  progress: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  completed: boolean;
  startedAt: Date;
  completedAt: Date;
  updatedAt: Date;  
}

export interface LessonProgressData {
  lessonId: string;
  studentId: string;
  progress: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  completed: boolean;
  startedAt: Date;
  completedAt: Date;
  updatedAt: Date;
  student: User;
  lesson: Lesson;

}

export type { Role }; 