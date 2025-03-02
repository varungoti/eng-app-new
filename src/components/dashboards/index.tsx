import React from 'react';
import type { RoleSettings } from '../../types/dashboard';
import { FileText, CheckCircle, Clock, Edit, Badge, Trophy } from 'lucide-react';
import { Badge as ShadcnBadge } from "../../components/ui/badge";


// Define DashboardProps locally with a more flexible settings type
interface DashboardProps {
  settings: RoleSettings & {
    stats?: Record<string, any>;
    recentActivity?: any[];
    accountTypes?: any[];
    recentChanges?: any[];
    accountTiers?: any[];
  };
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
    <div className="p-6">
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <div className="p-3 mr-4 bg-blue-100 rounded-full">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">
              Content Pieces
            </p>
            <p className="text-lg font-semibold text-gray-700">
              {settings.stats?.totalContent || 0}
            </p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <div className="p-3 mr-4 bg-green-100 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">
              Approved Content
            </p>
            <p className="text-lg font-semibold text-gray-700">
              {settings.stats?.approvedContent || 0}
            </p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <div className="p-3 mr-4 bg-yellow-100 rounded-full">
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">
              Pending Review
            </p>
            <p className="text-lg font-semibold text-gray-700">
              {settings.stats?.pendingReviews || 0}
            </p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow">
          <div className="p-3 mr-4 bg-purple-100 rounded-full">
            <Edit className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">
              Draft Content
            </p>
            <p className="text-lg font-semibold text-gray-700">
              {settings.stats?.draftContent || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <div className="min-w-0 p-4 bg-white rounded-lg shadow">
          <h4 className="mb-4 font-semibold text-gray-800">Recent Content</h4>
          <div className="w-full overflow-hidden">
            {settings.recentContent?.map((content, i) => (
              <div key={i} className="mb-4 p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-700">{content.title}</p>
                  <ShadcnBadge variant={content.status === 'approved' ? 'default' : 'secondary'}>
                    {content.status}
                  </ShadcnBadge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{content.lastModified}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="min-w-0 p-4 bg-white rounded-lg shadow">
          <h4 className="mb-4 font-semibold text-gray-800">Content Categories</h4>
          <div className="w-full">
            {settings.contentCategories?.map((category, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {category.count}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-blue-600 h-2 rounded-full w-[${category.percentage}%]`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccountsDashboard: React.FC<DashboardProps> = ({ settings }) => {
  return (
    <div className="grid gap-6 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Account Overview</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Total Users</span>
              <span className="font-medium">{settings.stats?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users</span>
              <span className="font-medium">{settings.stats?.activeUsers || 0}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Account Health</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Verified Accounts</span>
              <span className="font-medium">{settings.stats?.verifiedAccounts || '0%'}</span>
            </div>
            <div className="flex justify-between">
              <span>Account Activity</span>
              <span className="font-medium">{settings.stats?.accountActivity || '0%'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Support Metrics</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Open Tickets</span>
              <span className="font-medium">{settings.stats?.openTickets || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Avg Response Time</span>
              <span className="font-medium">{settings.stats?.avgResponseTime || '0h'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Security Status</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>2FA Enabled</span>
              <span className="font-medium">{settings.stats?.twoFactorEnabled || '0%'}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Score</span>
              <span className="font-medium">{settings.stats?.securityScore || '0%'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h4 className="mb-4 font-semibold">Recent Account Activity</h4>
          <div className="space-y-4">
            {settings.recentActivity?.map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <div className="p-2 bg-blue-100 rounded-full">
                  {activity.type === 'login' && <Badge className="h-5 w-5 text-blue-600" />}
                  {activity.type === 'update' && <Edit className="h-5 w-5 text-green-600" />}
                  {activity.type === 'security' && <FileText className="h-5 w-5 text-red-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-700">{activity.description}</p>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
                <ShadcnBadge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                  {activity.status}
                </ShadcnBadge>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h4 className="mb-4 font-semibold">Account Types Distribution</h4>
          <div className="space-y-4">
            {settings.accountTypes?.map((type, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{type.name}</span>
                  <span className="text-sm font-medium text-gray-700">{type.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full w-[${type.percentage}%] bg-blue-600`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccountsExecutiveDashboard: React.FC<DashboardProps> = ({ settings }) => {
  return (
    <div className="grid gap-6 p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Accounts Overview</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Total Accounts</span>
              <span className="font-medium">{settings.stats?.totalAccounts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>New Accounts</span>
              <span className="font-medium">{settings.stats?.newAccounts || 0}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Revenue Metrics</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Monthly Revenue</span>
              <span className="font-medium">${settings.stats?.monthlyRevenue?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Account Value</span>
              <span className="font-medium">${settings.stats?.avgAccountValue?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Retention</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Retention Rate</span>
              <span className="font-medium">{settings.stats?.retentionRate || '0%'}</span>
            </div>
            <div className="flex justify-between">
              <span>Churn Rate</span>
              <span className="font-medium">{settings.stats?.churnRate || '0%'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold">Account Health</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Active Accounts</span>
              <span className="font-medium">{settings.stats?.activeAccounts || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>At-Risk Accounts</span>
              <span className="font-medium">{settings.stats?.atRiskAccounts || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h4 className="mb-4 font-semibold">Recent Account Changes</h4>
          <div className="space-y-4">
            {settings.recentChanges?.map((change, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                <div className="p-2 bg-blue-100 rounded-full">
                  {change.type === 'upgrade' && <Trophy className="h-5 w-5 text-blue-600" />}
                  {change.type === 'downgrade' && <Clock className="h-5 w-5 text-orange-600" />}
                  {change.type === 'cancellation' && <FileText className="h-5 w-5 text-red-600" />}
                  {change.type === 'new' && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-700">{change.accountName}</p>
                  <p className="text-sm text-gray-500">{change.description}</p>
                </div>
                <ShadcnBadge variant={
                  change.type === 'upgrade' ? 'default' : 
                  change.type === 'new' ? 'secondary' : 
                  change.type === 'downgrade' ? 'outline' : 'destructive'
                }>
                  {change.type}
                </ShadcnBadge>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow">
          <h4 className="mb-4 font-semibold">Account Tier Distribution</h4>
          <div className="space-y-4">
            {settings.accountTiers?.map((tier, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{tier.name}</span>
                  <span className="text-sm font-medium text-gray-700">{tier.count} accounts</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full w-[${tier.percentage}%] ${
                      tier.name === 'Enterprise' ? 'bg-purple-600' :
                      tier.name === 'Business' ? 'bg-blue-600' :
                      tier.name === 'Pro' ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 