import React from 'react';
import { Code, GitBranch, Bug, CheckCircle, Clock, Activity } from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';

interface DeveloperDashboardProps {
  settings: RoleSettings;
}

const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ settings }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open PRs</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
              <p className="text-sm text-gray-500">4 need review</p>
            </div>
            <GitBranch className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Issues</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
              <p className="text-sm text-gray-500">3 high priority</p>
            </div>
            <Bug className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Code Coverage</p>
              <p className="text-2xl font-semibold text-gray-900">87%</p>
              <p className="text-sm text-gray-500">+2% this week</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Build Status</p>
              <p className="text-2xl font-semibold text-gray-900">Passing</p>
              <p className="text-sm text-gray-500">Last build: 5m ago</p>
            </div>
            <Code className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Current Sprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Current Sprint Progress</h3>
          <div className="space-y-4">
            <TaskProgress 
              label="Feature: User Authentication"
              progress={75}
              status="in_progress"
            />
            <TaskProgress 
              label="Bug Fix: Dashboard Loading"
              progress={90}
              status="review"
            />
            <TaskProgress 
              label="API Integration"
              progress={45}
              status="in_progress"
            />
            <TaskProgress 
              label="Unit Tests"
              progress={60}
              status="in_progress"
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              'Merged PR: Add user authentication',
              'Commented on Issue #123',
              'Created new branch: feature/dashboard',
              'Updated API documentation'
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Activity className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Code Quality Metrics</h3>
          <div className="space-y-4">
            <MetricBar label="Code Coverage" value={87} />
            <MetricBar label="Test Pass Rate" value={95} />
            <MetricBar label="Code Duplication" value={12} />
            <MetricBar label="Technical Debt" value={24} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Upcoming Deadlines</h3>
          <div className="space-y-4">
            {[
              { task: 'Sprint Review', time: 'Tomorrow, 2:00 PM' },
              { task: 'Code Freeze', time: 'Friday, 5:00 PM' },
              { task: 'Release v2.1.0', time: 'Next Monday' },
              { task: 'Technical Review', time: 'Next Wednesday' }
            ].map((deadline, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{deadline.task}</span>
                </div>
                <span className="text-sm text-gray-500">{deadline.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskProgress: React.FC<{
  label: string;
  progress: number;
  status: 'in_progress' | 'review' | 'done';
}> = ({ label, progress, status }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
        status === 'review' ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800'
      }`}>
        {status === 'in_progress' ? 'In Progress' :
         status === 'review' ? 'In Review' : 'Done'}
      </span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full w-[${progress}%] ${
          status === 'in_progress' ? 'bg-blue-600' :
          status === 'review' ? 'bg-yellow-600' :
          'bg-green-600'
        }`}
      />
    </div>
  </div>
);

const MetricBar: React.FC<{
  label: string;
  value: number;
}> = ({ label, value }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}%</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-indigo-600 rounded-full w-[${value}%]`}
      />
    </div>
  </div>
);

export default DeveloperDashboard;