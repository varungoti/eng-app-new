import React from 'react';
import { Users, Book, Activity, Clock } from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';

interface TeacherDashboardProps {
  settings: RoleSettings;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ settings }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Students</p>
              <p className="text-2xl font-semibold text-gray-900">25</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Classes Today</p>
              <p className="text-2xl font-semibold text-gray-900">4</p>
            </div>
            <Book className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Progress</p>
              <p className="text-2xl font-semibold text-gray-900">78%</p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Class</p>
              <p className="text-2xl font-semibold text-gray-900">10:30</p>
            </div>
            <Clock className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Grade 3 English</p>
                  <p className="text-xs text-gray-500">10:30 AM - 11:30 AM</p>
                </div>
              </div>
              <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Next Up
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Student Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm font-medium text-gray-900">Class Average</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">78%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Lessons */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Lessons</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center">
              <Book className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Basic Conversations</p>
                <p className="text-xs text-gray-500">Completed Yesterday</p>
              </div>
            </div>
            <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
              85% Success Rate
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;