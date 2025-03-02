import React from 'react';
import { Send } from 'lucide-react';

interface DepartmentInputProps {
  department: string;
  onSubmit: (data: any) => void;
}

// Define a Record type for formData
interface FormData {
  [key: string]: string;
}

const DepartmentInput: React.FC<DepartmentInputProps> = ({ department, onSubmit }) => {
  const [formData, setFormData] = React.useState<FormData>({});

  const getInputFields = () => {
    switch (department) {
      case 'sales':
        return [
          { name: 'revenue', label: 'Revenue', type: 'number' },
          { name: 'leads', label: 'New Leads', type: 'number' },
          { name: 'conversionRate', label: 'Conversion Rate', type: 'number' },
          { name: 'forecast', label: 'Sales Forecast', type: 'number' }
        ];
      case 'marketing':
        return [
          { name: 'campaigns', label: 'Active Campaigns', type: 'number' },
          { name: 'leads', label: 'Marketing Leads', type: 'number' },
          { name: 'roi', label: 'Marketing ROI', type: 'number' },
          { name: 'budget', label: 'Budget Utilization', type: 'number' }
        ];
      case 'content':
        return [
          { name: 'newContent', label: 'New Content Created', type: 'number' },
          { name: 'engagement', label: 'User Engagement', type: 'number' },
          { name: 'quality', label: 'Content Quality Score', type: 'number' }
        ];
      case 'technical':
        return [
          { name: 'uptime', label: 'System Uptime', type: 'number' },
          { name: 'incidents', label: 'Active Incidents', type: 'number' },
          { name: 'performance', label: 'System Performance', type: 'number' }
        ];
      case 'accounts':
        return [
          { name: 'revenue', label: 'Total Revenue', type: 'number' },
          { name: 'expenses', label: 'Total Expenses', type: 'number' },
          { name: 'profit', label: 'Net Profit', type: 'number' },
          { name: 'cashFlow', label: 'Cash Flow', type: 'number' }
        ];
      default:
        return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      department,
      timestamp: new Date().toISOString(),
      data: formData
    });
    setFormData({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {department.charAt(0).toUpperCase() + department.slice(1)} Department Input
        </h3>
        <div className="space-y-4">
          {getInputFields().map((field) => (
            <div key={field.name}>
              <label htmlFor={`${department}-${field.name}`} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                id={`${department}-${field.name}`}
                type={field.type}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [field.name]: e.target.value
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Report
          </button>
        </div>
      </div>
    </form>
  );
};

export default DepartmentInput;