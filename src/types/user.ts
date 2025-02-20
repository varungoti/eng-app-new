export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  schoolId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Role = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'SALES_HEAD' 
  | 'SCHOOL_LEADER' 
  | 'SCHOOL_PRINCIPAL' 
  | 'TEACHER_HEAD' 
  | 'TEACHER'
  | 'STUDENT'; 