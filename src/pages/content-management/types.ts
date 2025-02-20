export interface Grade {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Topic {
  id: string;
  name: string;
  gradeId: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContentManagementData {
  grades: Grade[];
  topics: Topic[];
} 