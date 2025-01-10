import React from 'react';
import { Users, Book, Activity, Calendar } from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';

interface SchoolPrincipalDashboardProps {
  settings: RoleSettings;
}

const SchoolPrincipalDashboard: React.FC<SchoolPrincipalDashboardProps> = ({ settings }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold text-gray-900">450</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Classes</p>
              <p className="text-2xl font-semibold text-gray-900">18</p>
            </div>
            <Book className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Staff Attendance</p>
              <p className="text-2xl font-semibold text-gray-900">95%</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Student Progress</p>
              <p className="text-2xl font-semibold text-gray-900">82%</p>
            </div>
            <Activity className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Class Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Class Progress</h3>
          <div className="space-y-4">
            {/* Add class progress items */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm font-medium text-gray-900">Grade 5A</p>
                <p className="text-xs text-gray-500">Progress: 88%</p>
              </div>
              <span className="text-sm font-medium text-green-600">On Track</span>
            </div>
            {/* Add more classes */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Staff Overview</h3>
          <div className="space-y-4">
            {/* Add staff overview items */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm font-medium text-gray-900">Present Today</p>
                <p className="text-xs text-gray-500">28/30 Teachers</p>
              </div>
              <span className="text-sm font-medium text-blue-600">View Details</span>
            </div>
            {/* Add more staff metrics */}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-4">
          {/* Add event items */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">Parent-Teacher Meeting</p>
                <p className="text-xs text-gray-500">Tomorrow, 2:00 PM</p>
              </div>
            </div>
            <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Upcoming
            </span>
          </div>
          {/* Add more events */}
        </div>
      </div>
    </div>
  );
};

export default SchoolPrincipalDashboard;