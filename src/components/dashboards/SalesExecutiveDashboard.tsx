import React from 'react';
import { List, Phone, Mail, Calendar, Target, Activity } from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';
import { useSales } from '../../hooks/useSales';

interface SalesExecutiveDashboardProps {
  settings: RoleSettings;
}

const SalesExecutiveDashboard: React.FC<SalesExecutiveDashboardProps> = ({ settings }) => {
  const { leads, activities, opportunities, stats, loading } = useSales();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!leads || !activities || !stats) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">Failed to load sales data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Leads</p>
              <p className="text-2xl font-semibold text-gray-900">
                {leads.length}
              </p>
            </div>
            <List className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activities Today</p>
              <p className="text-2xl font-semibold text-gray-900">
                {activities.filter(a => 
                  new Date(a.createdAt).toDateString() === new Date().toDateString()
                ).length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.conversionRate.toFixed(1)}%
              </p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Deals Won</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats?.dealsWon}
              </p>
            </div>
            <Target className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Tasks</h3>
        <div className="space-y-4">
          {activities
            .filter(a => new Date(a.createdAt).toDateString() === new Date().toDateString())
            .map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  {activity.type === 'call' && <Phone className="h-5 w-5 text-blue-500 mr-3" />}
                  {activity.type === 'email' && <Mail className="h-5 w-5 text-green-500 mr-3" />}
                  {activity.type === 'meeting' && <Calendar className="h-5 w-5 text-purple-500 mr-3" />}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  activity.type === 'call' ? 'bg-blue-100 text-blue-800' :
                  activity.type === 'email' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {activity.type}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* My Pipeline */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">My Pipeline</h3>
        <div className="space-y-4">
          {leads.map((lead) => {
            const leadOpportunity = opportunities.find(opp => opp.leadId === lead.id);
            return (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{lead.company}</p>
                  <p className="text-sm text-gray-500">{lead.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${leadOpportunity?.value.toLocaleString() || '0'}
                  </p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    lead.status === 'closed' ? 'bg-green-100 text-green-800' :
                    lead.status === 'proposal' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    lead.status === 'qualified' ? 'bg-purple-100 text-purple-800' :
                    lead.status === 'new' ? 'bg-red-100 text-red-800' :
                    lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                    lead.status === 'in_progress' ? 'bg-violet-100 text-violet-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalesExecutiveDashboard;