import React from 'react';
import { Code, GitBranch, CheckCircle } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { Permissions } from '../types/roles';  // Import the type

const Development = () => {
  const { can } = usePermissions();

  if (!can('development' as keyof Permissions)) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
        <p className="mt-2 text-sm text-red-600">
          You do not have permission to access development features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Development</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
              <p className="text-sm text-gray-500">3 in review</p>
            </div>
            <Code className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pull Requests</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
              <p className="text-sm text-gray-500">5 pending review</p>
            </div>
            <GitBranch className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Build Status</p>
              <p className="text-2xl font-semibold text-gray-900">Passing</p>
              <p className="text-sm text-gray-500">All tests green</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Active Projects</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {[
              { name: 'User Authentication', status: 'In Progress', completion: 75 },
              { name: 'API Integration', status: 'Review', completion: 90 },
              { name: 'Dashboard UI', status: 'In Progress', completion: 60 },
            ].map((project) => (
              <li key={project.name} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">{project.name}</p>
                    <div className="mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-2">{project.status}</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${project.completion}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{project.completion}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Development;