export interface Staff {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  role: StaffRole;
  school_id?: string;
  department?: Department;
  status: 'active' | 'pending' | 'inactive';
  created_at: string;
  updated_at: string;
  school?: {
    name: string;
  };
  user?: {
    email: string;
  };
}

export interface StaffFilters {
  role: string;
  department: string;
  status: string;
  search: string;
}

export type StaffRole = 
  // Company Roles
  | 'super_admin'
  | 'admin'
  | 'technical_head'
  | 'developer'
  | 'sales_head'
  | 'sales_lead'
  | 'sales_executive'
  | 'content_head'
  | 'content_editor'
  | 'accounts_head'
  | 'accounts_executive'
  // Client Roles
  | 'school_leader'
  | 'school_principal'
  | 'teacher_head'
  | 'teacher'
  | 'student';

export type Department =
  // Company Departments
  | 'administration'
  | 'technical'
  | 'sales'
  | 'content'
  | 'accounts'
  // Academic Departments
  | 'english'
  | 'mathematics'
  | 'science'
  | 'languages'
  | 'arts'
  | 'physical_education';