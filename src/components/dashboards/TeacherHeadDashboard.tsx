import React from 'react';
import { Users, Book, Activity, Award } from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';

interface TeacherHeadDashboardProps {
  settings: RoleSettings;
}

const TeacherHeadDashboard: React.FC<TeacherHeadDashboardProps> = ({ settings }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Teachers</p>
              <p className="text-2xl font-semibold text-gray-900">32</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Classes</p>
              <p className="text-2xl font-semibold text-gray-900">48</p>
            </div>
            <Book className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Performance</p>
              <p className="text-2xl font-semibold text-gray-900">87%</p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Top Performers</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
            <Award className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Teacher Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Teacher Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                <p className="text-xs text-gray-500">Performance Score: 95%</p>
              </div>
              <span className="text-sm font-medium text-green-600">Outstanding</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Class Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm font-medium text-gray-900">Grade 4 English</p>
                <p className="text-xs text-gray-500">Completion: 85%</p>
              </div>
              <span className="text-sm font-medium text-blue-600">View Details</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Effectiveness */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Content Effectiveness</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center">
              <Book className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Conversation Practice Module</p>
                <p className="text-xs text-gray-500">Student Success Rate: 92%</p>
              </div>
            </div>
            <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Highly Effective
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHeadDashboard;