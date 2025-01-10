export interface OnboardingTask {
  id: string;
  title: string;
  description?: string;
  category: 'documentation' | 'setup' | 'training' | 'compliance';
  required: boolean;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingProgress {
  id: string;
  schoolId: string;
  taskId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  notes?: string;
  completedBy?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SchoolDocument {
  id: string;
  schoolId: string;
  type: 'license' | 'registration' | 'tax' | 'insurance' | 'curriculum' | 'other';
  name: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  uploadedBy: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  blockedTasks: number;
  progress: number;
  remainingRequired: number;
  nextTask?: OnboardingTask;
}