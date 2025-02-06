export interface RoleSettings {
  stats?: {
    totalLessons?: number;
    pendingReviews?: number;
    activeEditors?: number;
    completedTasks?: number;
    avgReviewScore?: string;
    contentAccuracy?: string;
    dueThisWeek?: number;
    overdueTasks?: number;
    totalContent?: number;
    approvedContent?: number;
    draftContent?: number;
  };
  recentActivities?: Array<{
    title: string;
    description: string;
    time: string;
  }>;
  recentContent?: Array<{
    title: string;
    status: string;
    lastModified: string;
  }>;
  teamMembers?: Array<{
    name: string;
    role: string;
    status: string;
    avatar?: string;
  }>;
  contentCategories?: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
} 