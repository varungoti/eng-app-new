import React from 'react';
import type { RoleSettings } from '../../types/dashboard';

interface DashboardProps {
  settings: RoleSettings;
}

export const ContentHeadDashboard: React.FC<DashboardProps> = ({ settings }) => {
  return (
    <div className="grid gap-6 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Content Overview</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Total Lessons</span>
              <span className="font-medium">{settings.stats?.totalLessons || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Reviews</span>
              <span className="font-medium">{settings.stats?.pendingReviews || 0}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Team Performance</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Active Editors</span>
              <span className="font-medium">{settings.stats?.activeEditors || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Tasks Completed</span>
              <span className="font-medium">{settings.stats?.completedTasks || 0}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Quality Metrics</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Avg Review Score</span>
              <span className="font-medium">{settings.stats?.avgReviewScore || '0%'}</span>
            </div>
            <div className="flex justify-between">
              <span>Content Accuracy</span>
              <span className="font-medium">{settings.stats?.contentAccuracy || '0%'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Timeline</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Due This Week</span>
              <span className="font-medium">{settings.stats?.dueThisWeek || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Overdue Tasks</span>
              <span className="font-medium text-red-600">{settings.stats?.overdueTasks || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {settings.recentActivities?.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Team Members</h3>
          <div className="space-y-4">
            {settings.teamMembers?.map((member, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {member.avatar || member.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.role}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  member.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContentEditorDashboard: React.FC<DashboardProps> = ({ settings }) => {
  return (
    // ... implementation
  );
};

export const AccountsDashboard: React.FC<DashboardProps> = ({ settings }) => {
  return (
    // ... implementation
  );
};

export const AccountsExecutiveDashboard: React.FC<DashboardProps> = ({ settings }) => {
  return (
    // ... implementation
  );
}; 