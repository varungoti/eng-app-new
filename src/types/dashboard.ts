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
  };
  recentActivities?: Array<{
    title: string;
    description: string;
    time: string;
  }>;
  teamMembers?: Array<{
    name: string;
    role: string;
    status: string;
    avatar?: string;
  }>;
} 