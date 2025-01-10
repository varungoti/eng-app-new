import React from 'react';
import { 
  DollarSign, Receipt, FileText, Clock,
  Activity, AlertTriangle 
} from 'lucide-react';
import type { RoleSettings } from '../../hooks/useRoleSettings';
import { formatCurrency } from '../../lib/utils/format';

interface AccountsExecutiveDashboardProps {
  settings: RoleSettings;
}

const AccountsExecutiveDashboard: React.FC<AccountsExecutiveDashboardProps> = ({ settings }) => {
  const testData = {
    pendingInvoices: 45,
    processedInvoices: 230,
    pendingPayments: 75000,
    recentTransactions: [
      { id: 1, type: 'invoice', amount: 5000, status: 'pending', date: '2024-03-15' },
      { id: 2, type: 'payment', amount: 3500, status: 'processed', date: '2024-03-14' },
      { id: 3, type: 'invoice', amount: 7500, status: 'pending', date: '2024-03-13' }
    ],
    tasks: [
      { id: 1, title: 'Process vendor payments', deadline: '2024-03-16', priority: 'high' },
      { id: 2, title: 'Reconcile accounts', deadline: '2024-03-17', priority: 'medium' },
      { id: 3, title: 'Generate monthly reports', deadline: '2024-03-20', priority: 'low' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat
          icon={Receipt}
          label="Pending Invoices"
          value={testData.pendingInvoices.toString()}
          subtext="Need processing"
        />
        <QuickStat
          icon={FileText}
          label="Processed Today"
          value={testData.processedInvoices.toString()}
          subtext="Completed"
        />
        <QuickStat
          icon={DollarSign}
          label="Pending Payments"
          value={formatCurrency(testData.pendingPayments)}
          subtext="To be processed"
        />
        <QuickStat
          icon={Clock}
          label="Processing Time"
          value="24min"
          subtext="Average"
        />
      </div>

      {/* Recent Transactions & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {testData.recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Pending Tasks</h3>
          <div className="space-y-4">
            {testData.tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
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
}> = ({ icon: Icon, label, value, subtext }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{subtext}</p>
      </div>
      <Icon className="h-8 w-8 text-indigo-500" />
    </div>
  </div>
);

const TransactionItem: React.FC<{
  transaction: {
    type: string;
    amount: number;
    status: string;
    date: string;
  };
}> = ({ transaction }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center">
      <Activity className="h-5 w-5 text-gray-400 mr-3" />
      <div>
        <p className="text-sm font-medium text-gray-900">
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </p>
        <p className="text-xs text-gray-500">{transaction.date}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium text-gray-900">
        {formatCurrency(transaction.amount)}
      </p>
      <span className={`text-xs px-2 py-1 rounded-full ${
        transaction.status === 'pending' 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-green-100 text-green-800'
      }`}>
        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
      </span>
    </div>
  </div>
);

const TaskItem: React.FC<{
  task: {
    title: string;
    deadline: string;
    priority: string;
  };
}> = ({ task }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center">
      <AlertTriangle className={`h-5 w-5 mr-3 ${
        task.priority === 'high' ? 'text-red-500' :
        task.priority === 'medium' ? 'text-yellow-500' :
        'text-green-500'
      }`} />
      <div>
        <p className="text-sm font-medium text-gray-900">{task.title}</p>
        <p className="text-xs text-gray-500">Due: {task.deadline}</p>
      </div>
    </div>
    <span className={`text-xs px-2 py-1 rounded-full ${
      task.priority === 'high' ? 'bg-red-100 text-red-800' :
      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
      'bg-green-100 text-green-800'
    }`}>
      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
    </span>
  </div>
);

export default AccountsExecutiveDashboard;