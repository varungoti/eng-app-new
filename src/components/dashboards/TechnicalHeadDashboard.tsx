import React from 'react';
import { Server, Database, Cloud, AlertTriangle, Activity, Clock } from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';

interface TechnicalHeadDashboardProps {
  settings: RoleSettings;
}

const TechnicalHeadDashboard: React.FC<TechnicalHeadDashboardProps> = ({ settings }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Uptime</p>
              <p className="text-2xl font-semibold text-gray-900">99.99%</p>
              <p className="text-sm text-gray-500">Last 30 days</p>
            </div>
            <Server className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Servers</p>
              <p className="text-2xl font-semibold text-gray-900">24/24</p>
              <p className="text-sm text-gray-500">All systems operational</p>
            </div>
            <Cloud className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Database Health</p>
              <p className="text-2xl font-semibold text-gray-900">Good</p>
              <p className="text-sm text-gray-500">Response time: 45ms</p>
            </div>
            <Database className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Incidents</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
              <p className="text-sm text-gray-500">No critical issues</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">System Performance</h3>
          <div className="space-y-4">
            <MetricBar label="CPU Usage" value={45} />
            <MetricBar label="Memory Usage" value={62} />
            <MetricBar label="Disk Usage" value={58} />
            <MetricBar label="Network Bandwidth" value={35} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {[
              'Database backup completed successfully',
              'Server maintenance scheduled for next week',
              'SSL certificates renewed',
              'Security patches applied to all servers'
            ].map((alert, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Activity className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{alert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Server Response Times</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <span className="text-gray-500">Response time chart goes here</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Scheduled Maintenance</h3>
          <div className="space-y-4">
            {[
              { task: 'Database Optimization', time: 'Tomorrow, 2:00 AM' },
              { task: 'Server Updates', time: 'Next Week, Monday' },
              { task: 'Backup Verification', time: 'Daily, 1:00 AM' },
              { task: 'Security Scan', time: 'Every 6 hours' }
            ].map((task, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{task.task}</span>
                </div>
                <span className="text-sm text-gray-500">{task.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

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
        className="h-full bg-indigo-600 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default TechnicalHeadDashboard;