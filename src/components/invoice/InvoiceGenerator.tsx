import React, { useState } from 'react';
import { useSchools } from '../../hooks/useSchools';
import { useToast } from '../../hooks/useToast';
import { formatCurrency } from '../../lib/utils/format';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  schoolId: string;
  items: InvoiceItem[];
  notes?: string;
}

export const InvoiceGenerator: React.FC = () => {
  const { schools } = useSchools();
  const { showToast } = useToast();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    schoolId: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    notes: ''
  });

  const calculateAmount = (quantity: number, rate: number) => {
    return quantity * rate;
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...invoiceData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      amount: field === 'quantity' || field === 'rate' 
        ? calculateAmount(
            field === 'quantity' ? Number(value) : newItems[index].quantity,
            field === 'rate' ? Number(value) : newItems[index].rate
          )
        : newItems[index].amount
    };
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, items: newItems });
  };

  const getTotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement invoice submission
      showToast('Invoice generated successfully', { type: 'success' });
    } catch (err) {
      showToast('Failed to generate invoice', { type: 'error' });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">School</label>
            <select
              title="Select School"
              value={invoiceData.schoolId}
              onChange={(e) => setInvoiceData({ ...invoiceData, schoolId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="">Select School</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
              <input
                title="Invoice Date"
                type="date"
                value={invoiceData.date}
                onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                title="Due Date"
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Invoice Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Items</h3>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Item
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <input
                        title="Description"
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        title="Quantity"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        title="Rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.rate}
                        onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </td>
                    <td className="px-6 py-4">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-900"
                        disabled={invoiceData.items.length === 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right font-medium">Total:</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(getTotal())}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            title="Notes"
            value={invoiceData.notes}
            onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </div>
  );
};