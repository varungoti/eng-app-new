import React from 'react';
import { DollarSign, TrendingUp, PieChart, Activity } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { formatCurrency } from '../lib/utils/format';
import DepartmentInputs from '../components/inputs/DepartmentInputs';

const Finance = () => {
  const { can } = usePermissions();

  if (!can('finance')) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
        <p className="mt-2 text-sm text-red-600">
          You do not have permission to access finance features.
        </p>
      </div>
    );
  }

  const financialData = {
    revenue: 1250000,
    expenses: 850000,
    profit: 400000,
    recentTransactions: [
      { type: 'income', amount: 25000, description: 'School fee payment' },
      { type: 'expense', amount: 15000, description: 'Equipment purchase' },
      { type: 'income', amount: 30000, description: 'Course registration' },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Finance</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(financialData.revenue)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(financialData.expenses)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(financialData.profit)}
              </p>
            </div>
            <PieChart className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {financialData.recentTransactions.map((transaction, index) => (
              <li key={index} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className={`h-5 w-5 mr-3 ${
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">{transaction.type}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Department Reports */}
      <DepartmentInputs />
    </div>
  );
};

export default Finance;