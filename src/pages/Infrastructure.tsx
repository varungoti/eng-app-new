//import React from 'react';
import { Server, Database, Cloud, Activity } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
//import { Permissions } from '../types/roles';

const Infrastructure = () => {
  const { can } = usePermissions();

  if (!can("staff")) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
        <p className="mt-2 text-sm text-red-600">
          You do not have permission to access infrastructure features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Infrastructure</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Server Status</p>
              <p className="text-2xl font-semibold text-gray-900">24/24</p>
              <p className="text-sm text-gray-500">All systems operational</p>
            </div>
            <Server className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Database Health</p>
              <p className="text-2xl font-semibold text-gray-900">Optimal</p>
              <p className="text-sm text-gray-500">45ms response time</p>
            </div>
            <Database className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cloud Services</p>
              <p className="text-2xl font-semibold text-gray-900">Active</p>
              <p className="text-sm text-gray-500">All regions up</p>
            </div>
            <Cloud className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">System Performance</h3>
          <div className="space-y-4">
            {[
              { label: 'CPU Usage', value: 45 },
              { label: 'Memory Usage', value: 62 },
              { label: 'Disk Usage', value: 58 },
              { label: 'Network Bandwidth', value: 35 },
            ].map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{metric.label}</span>
                  <span className="font-medium">{metric.value}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-indigo-600 rounded-full w-[${metric.value}%]`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              'Database backup completed',
              'Server maintenance performed',
              'SSL certificates renewed',
              'Security patches applied',
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Activity className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Infrastructure;