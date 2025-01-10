import React from 'react';
import { Edit, Trash2, Mail } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { Button } from '../ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import type { Staff } from '../../types/staff';

interface StaffListProps {
  staff: Staff[];
  onUpdate: (id: string, updates: Partial<Staff>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  filters: {
    role: string;
    department: string;
    status: string;
    search: string;
  };
}

const StaffList: React.FC<StaffListProps> = ({
  staff,
  onUpdate,
  onDelete,
  filters
}) => {
  const { can } = usePermissions();

  const filteredStaff = staff.filter(member => {
    const matchesRole = !filters.role || filters.role === 'all' || member.role === filters.role;
    const matchesDepartment = !filters.department || filters.department === 'all' || member.department === filters.department;
    const matchesStatus = !filters.status || filters.status === 'all' || member.status === filters.status;
    const matchesSearch = !filters.search || 
      member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      member.email.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesRole && matchesDepartment && matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>School</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStaff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {member.role}
                </span>
              </TableCell>
              <TableCell>{member.department}</TableCell>
              <TableCell>{member.school?.name}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  member.status === 'active' ? 'bg-green-100 text-green-800' :
                  member.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {member.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {can('edit') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onUpdate(member.id, { status: 'active' })}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {can('delete') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* Handle resend invite */}}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StaffList;