import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { InvoiceGenerator } from '../../components/invoice/InvoiceGenerator';

const Invoices = () => {
  const { can } = usePermissions();

  if (!can('finance')) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
        <p className="mt-2 text-sm text-red-600">
          You do not have permission to access invoice features.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">School Invoices</h1>
      </div>
      <InvoiceGenerator />
    </div>
  );
};

export default Invoices;