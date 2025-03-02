import React from 'react';
import { 
  DollarSign, TrendingUp, PieChart, 
  CreditCard, Activity, AlertTriangle 
} from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';
import { formatCurrency, formatNumber } from '../../lib/utils/format';

interface AccountsDashboardProps {
  settings: RoleSettings;
}

const AccountsDashboard: React.FC<AccountsDashboardProps> = ({ settings }) => {
  const testData = {
    revenue: 1250000,
    expenses: 850000,
    profit: 400000,
    cashFlow: 350000,
    pendingPayments: 75000,
    outstandingInvoices: 120000,
    recentTransactions: [
      { type: 'income', amount: 25000, description: 'School fee payment' },
      { type: 'expense', amount: 15000, description: 'Equipment purchase' },
      { type: 'income', amount: 30000, description: 'Course registration' }
    ],
    alerts: [
      'Monthly financial report due',
      'Tax filing deadline approaching',
      'Budget review meeting scheduled'
    ]
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat
          icon={DollarSign}
          label="Total Revenue"
          value={formatCurrency(testData.revenue)}
          trend="up"
        />
        <QuickStat
          icon={CreditCard}
          label="Total Expenses"
          value={formatCurrency(testData.expenses)}
          trend="down"
        />
        <QuickStat
          icon={TrendingUp}
          label="Net Profit"
          value={formatCurrency(testData.profit)}
          trend="up"
        />
        <QuickStat
          icon={PieChart}
          label="Cash Flow"
          value={formatCurrency(testData.cashFlow)}
          trend="up"
        />
      </div>

      {/* Financial Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {testData.recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Activity className={`h-5 w-5 ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                  } mr-3`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Financial Alerts</h3>
          <div className="space-y-4">
            {testData.alerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-gray-700">{alert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Outstanding Payments</h3>
          <div className="space-y-4">
            <MetricBar 
              label="Pending Payments" 
              value={testData.pendingPayments} 
              total={testData.revenue}
            />
            <MetricBar 
              label="Outstanding Invoices" 
              value={testData.outstandingInvoices} 
              total={testData.revenue}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Budget Overview</h3>
          <div className="space-y-4">
            <MetricBar 
              label="Budget Utilization" 
              value={testData.expenses} 
              total={testData.revenue}
            />
            <MetricBar 
              label="Profit Margin" 
              value={testData.profit} 
              total={testData.revenue}
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
  trend: 'up' | 'down';
}> = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <Icon className={`h-8 w-8 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
    </div>
  </div>
);

const MetricBar: React.FC<{
  label: string;
  value: number;
  total: number;
}> = ({ label, value, total }) => {
  const percentage = (value / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{formatCurrency(value)}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-indigo-600 rounded-full w-[${percentage}%]`}
        />
      </div>
      <div className="text-xs text-gray-500 text-right">
        {percentage.toFixed(1)}% of total
      </div>
    </div>
  );
};

export default AccountsDashboard;