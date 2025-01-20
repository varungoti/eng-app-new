import React, { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { useStaff } from '../hooks/useStaff';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingSpinner from '../components/LoadingSpinner';
import StaffList from '../components/staff/StaffList';
import AddStaffDialog from '../components/staff/AddStaffDialog';
import StaffFilters from '../components/staff/StaffFilters';
import BulkImportDialog from '../components/BulkImport/BulkImportDialog';
import { Button } from '../components/ui/button';
import { logger } from '../lib/logger';

const Staff = () => {
  const { can } = usePermissions();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    status: '',
    search: ''
  });

  const { 
    staff, 
    loading, 
    error,
    addStaff,
    updateStaff,
    deleteStaff,
    inviteStaff,
    refresh
  } = useStaff();

  if (!can('staff')) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
        <p className="mt-2 text-sm text-red-600">
          You do not have permission to access staff management.
        </p>
      </div>
    );
  }

  const handleAddStaff = async (data: any) => {
    try {
      await addStaff(data);
      setIsAddModalOpen(false);
      showToast('Staff member added successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add staff member';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'Staff'
      });
    }
  };

  const handleInviteStaff = async (email: string, role: string) => {
    try {
      await inviteStaff(email, role);
      showToast('Invitation sent successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send invitation';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'Staff'
      });
    }
  };

  const handleBulkImport = async (data: any[]) => {
    try {
      for (const staff of data) {
        await addStaff(staff);
      }
      setIsImportModalOpen(false);
      showToast('Staff imported successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to import staff';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'Staff'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading staff management..." />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button
          onClick={() => refresh()}
          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary source="Staff">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage staff members and their roles
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsImportModalOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Staff
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </div>
        </div>

        {/* Filters */}
        <StaffFilters
          filters={filters}
          onFilterChange={setFilters}
        />

        {/* Staff List */}
        <StaffList
          staff={staff}
          onUpdate={(id, updates) => updateStaff.mutate({ id, updates })}
          onDelete={(id) => deleteStaff.mutate(id)}
          filters={filters}
        />

        {/* Add Staff Modal */}
        {isAddModalOpen && (
          <AddStaffDialog
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleAddStaff}
            onInvite={handleInviteStaff}
          />
        )}

        {/* Import Modal */}
        {isImportModalOpen && (
          <BulkImportDialog
            title="Import Staff"
            onImport={handleBulkImport}
            onClose={() => setIsImportModalOpen(false)}
            template={{
              headers: [
                'name',
                'email',
                'role',
                'department',
                'school_id'
              ],
              sampleData: [{
                name: 'John Smith',
                email: 'john@example.com',
                role: 'teacher',
                department: 'English',
                school_id: 'school-123'
              }]
            }}
            validateRow={(row) => {
              const errors = [];
              if (!row.name) errors.push('Name is required');
              if (!row.email) errors.push('Email is required');
              if (!row.role) errors.push('Role is required');
              return {
                isValid: errors.length === 0,
                errors
              };
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Staff;