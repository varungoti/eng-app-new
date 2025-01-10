import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface StaffFiltersProps {
  filters: {
    role: string;
    department: string;
    status: string;
    search: string;
  };
  onFilterChange: (filters: any) => void;
}

const StaffFilters: React.FC<StaffFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search staff..."
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <Select
            value={filters.role}
            onValueChange={(value) => onFilterChange({ ...filters, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {/* Company Roles */}
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="technical_head">Technical Head</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="sales_head">Sales Head</SelectItem>
              <SelectItem value="sales_lead">Sales Lead</SelectItem>
              <SelectItem value="sales_executive">Sales Executive</SelectItem>
              <SelectItem value="content_head">Content Head</SelectItem>
              <SelectItem value="content_editor">Content Editor</SelectItem>
              <SelectItem value="accounts_head">Accounts Head</SelectItem>
              <SelectItem value="accounts_executive">Accounts Executive</SelectItem>
              
              {/* Client Roles */}
              <SelectItem value="school_leader">School Leader</SelectItem>
              <SelectItem value="school_principal">School Principal</SelectItem>
              <SelectItem value="teacher_head">Teacher Head</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="student">Student</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <Select
            value={filters.department}
            onValueChange={(value) => onFilterChange({ ...filters, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {/* Company Departments */}
              <SelectItem value="administration">Administration</SelectItem>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="accounts">Accounts</SelectItem>
              
              {/* Academic Departments */}
              <SelectItem value="english">English Department</SelectItem>
              <SelectItem value="mathematics">Mathematics Department</SelectItem>
              <SelectItem value="science">Science Department</SelectItem>
              <SelectItem value="languages">Languages Department</SelectItem>
              <SelectItem value="arts">Arts Department</SelectItem>
              <SelectItem value="physical_education">Physical Education</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default StaffFilters;