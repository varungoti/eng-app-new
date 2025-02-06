import React from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { Permissions } from '../types/roles';

const Reports = () => {
  const { can } = usePermissions();

  if (!can('reports' as keyof Permissions)) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
        <p className="mt-2 text-sm text-red-600">
          You do not have permission to access reports.
        </p>
      </div>
    );
  }

  const reports = [
    { name: 'Financial Statement', type: 'finance', date: '2024-03-15', status: 'ready' },
    { name: 'Student Progress Report', type: 'academic', date: '2024-03-14', status: 'processing' },
    { name: 'Staff Performance Review', type: 'hr', date: '2024-03-13', status: 'ready' },
    { name: 'Enrollment Statistics', type: 'academic', date: '2024-03-12', status: 'ready' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
        <div className="flex space-x-4">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Available Reports</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {reports.map((report) => (
              <li key={report.name} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{report.name}</p>
                      <p className="text-sm text-gray-500">Generated on {report.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'ready' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                    {report.status === 'ready' && (
                      <button className="inline-flex items-center p-2 border border-transparent rounded-full text-indigo-600 hover:bg-indigo-50">
                        <Download className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;