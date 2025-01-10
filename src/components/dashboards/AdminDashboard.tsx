import React from 'react';
import { 
  DollarSign, Users, BarChart2, TrendingUp,
  Briefcase, Target, Activity, Clock
} from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/utils/format';

interface AdminDashboardProps {
  settings: RoleSettings;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ settings }) => {
  const testData = settings.testData || {};
  const companyMetrics = testData.companyMetrics || {};
  const departmentMetrics = testData.departmentMetrics || [];
  const keyProjects = testData.keyProjects || [];
  const financialMetrics = testData.financialMetrics || {};

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat
          icon={DollarSign}
          label="Quarterly Revenue"
          value={formatCurrency(financialMetrics.quarterlyRevenue)}
          subtext={`${financialMetrics.yearlyGrowth}% YoY Growth`}
          trend="up"
        />
        <QuickStat
          icon={Users}
          label="Total Employees"
          value={formatNumber(companyMetrics.employeeCount)}
          subtext={`${companyMetrics.departmentCount} Departments`}
          trend="up"
        />
        <QuickStat
          icon={Target}
          label="Operating Margin"
          value={`${companyMetrics.profitMargin}%`}
          subtext="Above Target"
          trend="up"
        />
        <QuickStat
          icon={Briefcase}
          label="Active Projects"
          value={formatNumber(companyMetrics.activeProjects)}
          subtext="On Track"
          trend="up"
        />
      </div>

      {/* Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Department Performance</h3>
          <div className="space-y-4">
            {departmentMetrics.map((dept, index) => (
              <DepartmentMetric
                key={index}
                name={dept.name}
                headcount={dept.headcount}
                performance={dept.performance}
                budget={dept.budget}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Key Projects</h3>
          <div className="space-y-4">
            {keyProjects.map((project, index) => (
              <ProjectCard
                key={index}
                name={project.name}
                progress={project.progress}
                status={project.status}
                budget={project.budget}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities & Financial Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {(testData.recentActivities || []).map((activity, index) => (
              <ActivityItem key={index} message={activity} />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Financial Overview</h3>
          <div className="space-y-4">
            <MetricBar 
              label="Revenue Target" 
              value={85} 
              format={(v) => formatCurrency(v * 10000)}
            />
            <MetricBar 
              label="Cost Optimization" 
              value={78} 
              format={(v) => `${v}%`}
            />
            <MetricBar 
              label="Budget Utilization" 
              value={92} 
              format={(v) => `${v}%`}
            />
            <MetricBar 
              label="Growth Rate" 
              value={financialMetrics.yearlyGrowth} 
              format={(v) => `${v}%`}
            />
          </div>
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

const DepartmentMetric: React.FC<{
  name: string;
  headcount: number;
  performance: number;
  budget: number;
}> = ({ name, headcount, performance, budget }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-medium text-gray-900">{name}</h4>
      <span className="text-sm text-gray-500">{headcount} employees</span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Performance</span>
        <span className="font-medium">{performance}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 rounded-full"
          style={{ width: `${performance}%` }}
        />
      </div>
      <div className="text-sm text-gray-500">
        Budget: {formatCurrency(budget)}
      </div>
    </div>
  </div>
);

const ProjectCard: React.FC<{
  name: string;
  progress: number;
  status: string;
  budget: number;
}> = ({ name, progress, status, budget }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-medium text-gray-900">{name}</h4>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'on_track' ? 'bg-green-100 text-green-800' :
        status === 'at_risk' ? 'bg-yellow-100 text-yellow-800' :
        'bg-blue-100 text-blue-800'
      }`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Progress</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-sm text-gray-500">
        Budget: {formatCurrency(budget)}
      </div>
    </div>
  </div>
);

const ActivityItem: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
    <Activity className="h-5 w-5 text-gray-400" />
    <span className="text-sm text-gray-700">{message}</span>
  </div>
);

const MetricBar: React.FC<{
  label: string;
  value: number;
  format: (value: number) => string;
}> = ({ label, value, format }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{format(value)}</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className="h-full bg-indigo-600 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default AdminDashboard;