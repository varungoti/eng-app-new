import React from 'react';
import { BarChart, DollarSign, Users, Target, Map, Activity } from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';
import { useSales } from '../../hooks/useSales';

interface SalesHeadDashboardProps {
  settings: RoleSettings;
}

const SalesHeadDashboard: React.FC<SalesHeadDashboardProps> = ({ settings }) => {
  const { stats, loading, error } = useSales();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats?.pipelineValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Performance</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.conversionRate.toFixed(1)}%
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deals Won</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.wonDeals}
              </p>
            </div>
            <Target className="h-8 w-8 text-indigo-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Territories</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
            <Map className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Pipeline Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Analysis</h3>
          <div className="h-64">
            {/* Add Chart Component Here */}
            <div className="flex items-center justify-center h-full text-gray-500">
              Pipeline Chart Placeholder
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Activity</h3>
          <div className="space-y-4">
            {/* Team Activity List */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">John closed a deal</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <span className="text-sm font-medium text-green-600">$50,000</span>
            </div>
            {/* Add more activity items */}
          </div>
        </div>
      </div>

      {/* Territory Map */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Territory Coverage</h3>
        <div className="h-96">
          {/* Add Map Component Here */}
          <div className="flex items-center justify-center h-full text-gray-500">
            Territory Map Placeholder
          </div>
        </div>
      </div>

      {/* Deals Requiring Approval */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Deals Requiring Approval</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sales Rep
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Add table rows here */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesHeadDashboard;