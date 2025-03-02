//import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { formatCurrency } from '../../lib/utils/format';
import { Plus, FileText, Filter, CreditCard } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';
import { useState } from 'react';
import { useToast } from '../../hooks/useToast';

interface Payment {
  id: number;
  school: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

const Payments = () => {
  const { can } = usePermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  // Fetch payments from database
  const { data: payments = [], isError } = useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
      } finally {
        setIsLoading(false);
      }
    }
  });
  
  // Fallback data for development or when DB is empty
  const fallbackPayments: Payment[] = [
    { id: 1, school: 'Global International School', amount: 250_000, date: '2024-01-15', status: 'completed', method: 'bank_transfer' },
    { id: 2, school: 'New Age Academy', amount: 180_000, date: '2024-01-14', status: 'pending', method: 'check' },
    { id: 3, school: 'Future Kids School', amount: 320_000, date: '2024-01-13', status: 'completed', method: 'bank_transfer' },
  ];
  
  // Use fallback data if no payments or error
  const displayPayments = payments.length > 0 ? payments : fallbackPayments;

  // Create payment mutation
  const createPayment = useMutation({
    mutationFn: async (newPayment: Omit<Payment, 'id'>) => {
      const { data, error } = await supabase
        .from('payments')
        .insert(newPayment)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      showToast('Payment recorded successfully', { type: 'success' });
      setIsPaymentModalOpen(false);
    },
    onError: (error) => {
      console.error('Failed to create payment:', error);
      showToast('Failed to record payment', { type: 'error' });
    }
  });

  const handleCreatePayment = (formData: FormData) => {
    const newPayment = {
      school: formData.get('school') as string,
      amount: Number(formData.get('amount')),
      date: new Date().toISOString().split('T')[0],
      status: formData.get('status') as 'completed' | 'pending' | 'failed',
      method: formData.get('method') as string
    };

    createPayment.mutate(newPayment);
  };

  if (!can('staff')) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
        <p className="mt-2 text-sm text-red-600">
          You do not have permission to access payment records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Payment Records</h1>
        <div className="flex space-x-4">
          <button 
            title="Filter"
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button 
            title="Record Payment"
            type="button"
            onClick={() => setIsPaymentModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : isError ? (
          <div className="p-4 bg-red-50 text-center">
            <p className="text-red-600">Failed to load payment data. Please try again later.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No payment records found
                  </td>
                </tr>
              ) : (
                displayPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.school}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center">
                        <CreditCard className="h-4 w-4 mr-1" />
                        {payment.method.replace('_', ' ').charAt(0).toUpperCase() + payment.method.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        title="View Invoice"
                        type="button"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Record New Payment</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreatePayment(new FormData(e.currentTarget));
              }}
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                    School
                  </label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>
                  <select
                    id="method"
                    name="method"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="cash">Cash</option>
                    <option value="credit_card">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  disabled={createPayment.isPending}
                >
                  {createPayment.isPending ? 'Saving...' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;

