import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePermissions } from '../hooks/usePermissions';
import EventManager from '../components/events/EventManager';
import { Loader2 } from 'lucide-react';

const Events = () => {
  const { user, loading } = useAuth();
  const { can } = usePermissions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center space-y-2">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Authentication Required</h3>
        <p className="mt-2 text-sm text-red-600">
          Please log in to access events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all events across the organization
          </p>
        </div>
      </div>

      <EventManager 
        canCreate={can('create')}
        canEdit={can('edit')}
        canDelete={can('delete')}
        userRole={user.role}
      />
    </div>
  );
};

export default Events;