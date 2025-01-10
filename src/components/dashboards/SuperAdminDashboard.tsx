import React from 'react';
import { 
  DollarSign, Users, Server, Activity, 
  Shield, Clock, Database, AlertTriangle,
  BarChart, LineChart, PieChart, TrendingUp
} from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';
import { formatNumber } from '../../lib/utils/format';

interface SuperAdminDashboardProps {
  settings: RoleSettings;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ settings }) => {
  // Use test data from settings
  const testData = settings?.testData || {};
  const systemMetrics = settings?.systemMetrics || {};

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat
          icon={BarChart}
          label="Monthly Revenue"
          value={`$${formatNumber(testData.monthlyRevenue || 0)}`}
          subtext={`+${testData.revenueGrowth || 0}% vs last month`}
          trend="up"
        />
        <QuickStat
          icon={Users}
          label="Total Employees"
          value={formatNumber(testData.totalEmployees || 0)}
          subtext={`${testData.newHires || 0} new this month`}
          trend="up"
        />
        <QuickStat
          icon={DollarSign}
          label="Operating Costs"
          value={`$${formatNumber(testData.operatingCosts || 0)}`}
          subtext="This month"
          trend="up"
        />
        <QuickStat
          icon={TrendingUp}
          label="Growth Rate"
          value={`${testData.growthRate || 0}%`}
          subtext="Year over year"
          trend="up"
        />
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">System Metrics</h3>
          <div className="space-y-4">
            <MetricBar label="CPU Usage" value={systemMetrics.cpuUsage || 0} />
            <MetricBar label="Memory Usage" value={systemMetrics.memoryUsage || 0} />
            <MetricBar label="Disk Usage" value={systemMetrics.diskUsage || 0} />
            <MetricBar label="Network Latency" value={systemMetrics.networkLatency || 0} suffix="ms" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {(testData.recentActivities || []).map((activity: string, index: number) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{activity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MetricsChart
          title="Revenue Growth"
          type="line"
          data={testData.revenueData || []}
          labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
        />
        <MetricsChart
          title="Employee Distribution"
          type="bar"
          data={testData.employeeDistribution || []}
          labels={['Tech', 'Sales', 'Content', 'Admin']}
        />
        <MetricsChart
          title="Cost Breakdown"
          type="pie"
          data={testData.costBreakdown || []}
          labels={['Salaries', 'Infrastructure', 'Marketing', 'Other']}
        />
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">System Alerts</h3>
          <span className="text-sm text-gray-500">Last 24 hours</span>
        </div>
        <div className="space-y-4">
          {(testData.systemAlerts || []).map((alert: string, index: number) => (
            <AlertItem key={index} message={alert} />
          ))}
        </div>
      </div>
    </div>
  );
};

const QuickStat: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  trend: 'up' | 'down';
}> = ({ icon: Icon, label, value, subtext, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{subtext}</p>
      </div>
      <Icon className={`h-8 w-8 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
    </div>
  </div>
);

const MetricBar: React.FC<{
  label: string;
  value: number;
  suffix?: string;
}> = ({ label, value, suffix = '%' }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}{suffix}</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-indigo-600 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const MetricsChart: React.FC<{
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: number[];
  labels?: string[];
}> = ({ title, type, data, labels }) => {
  const Icon = type === 'line' ? LineChart : type === 'bar' ? BarChart : PieChart;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="h-48 flex items-center justify-center">
        <span className="text-gray-500">Chart visualization goes here</span>
      </div>
      {labels && (
        <div className="mt-4 flex justify-around">
          {labels.map((label, index) => (
            <div key={label} className="text-xs text-gray-500">
              <span className="font-medium">{label}</span>
              <span className="ml-1">{data[index]}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AlertItem: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
    <AlertTriangle className="h-5 w-5 text-amber-500" />
    <span className="text-sm text-gray-700">{message}</span>
  </div>
);

export default SuperAdminDashboard;