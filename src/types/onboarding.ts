export interface OnboardingTask {
  id: string;
  school_id: string;
  title: string;
  description: string;
  order: number;
  required: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingProgress {
  id: string;
  school_id: string;
  task_id: string;
  completed: boolean;
  completed_by: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export interface SchoolDocument {
  id: string;
  school_id: string;
  name: string;
  url: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface OnboardingStats {
  completedTasks: number;
  totalTasks: number;
  completionPercentage: number;
  pendingTasks?: number;
  blockedTasks?: number;
  remainingRequired?: number;
  nextTask?: OnboardingTask;
}