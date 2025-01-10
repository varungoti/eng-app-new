import React, { useState } from 'react';
import EventList from './EventList';
import EventCalendar from './EventCalendar';
import EventFilters, { EventFilters as EventFiltersType } from './EventFilters';
import EventFormModal from './EventFormModal';
import type { Event } from './EventCard';
import { usePermissions } from '../../hooks/usePermissions';
import { useEvents } from '../../hooks/useEvents';
import { useToast } from '../../hooks/useToast';
import { Loader2, Calendar, List } from 'lucide-react';

interface EventManagerProps {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  userRole: string;
}

const EventManager: React.FC<EventManagerProps> = ({
  canCreate,
  canEdit,
  canDelete,
  userRole
}) => {
  const { can } = usePermissions();
  const { events, loading, error, addEvent, updateEvent, deleteEvent } = useEvents();
  const { showToast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filters, setFilters] = useState<EventFiltersType>({
    search: '',
    type: '',
    status: '',
    dateRange: 'all'
  });

  const canManageEvents = canCreate || canEdit || canDelete;

  const filteredEvents = events.filter(event => {
    if (filters.search && !event.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.type && event.type !== filters.type) {
      return false;
    }
    if (filters.status && event.status !== filters.status) {
      return false;
    }
    if (filters.dateRange !== 'all') {
      const eventDate = new Date(event.startDate);
      const now = new Date();
      switch (filters.dateRange) {
        case 'upcoming':
          return eventDate > now;
        case 'past':
          return eventDate < now;
        case 'today':
          return eventDate.toDateString() === now.toDateString();
        case 'week':
          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
          const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
          return eventDate >= weekStart && eventDate <= weekEnd;
        case 'month':
          return eventDate.getMonth() === now.getMonth() && 
                 eventDate.getFullYear() === now.getFullYear();
      }
    }
    return true;
  });
  const handleAddEvent = async (eventData: Omit<Event, 'id'>) => {
    try {
      await addEvent(eventData);
      showToast('Event added successfully', { type: 'success' });
      setIsAddModalOpen(false);
    } catch (err) {
      showToast('Failed to add event', { type: 'error' });
    }
  };

  const handleEditEvent = async (event: Event) => {
    try {
      await updateEvent(event.id, event);
      showToast('Event updated successfully', { type: 'success' });
      setEditingEvent(null);
    } catch (err) {
      showToast('Failed to update event', { type: 'error' });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      showToast('Event deleted successfully', { type: 'success' });
    } catch (err) {
      showToast('Failed to delete event', { type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setView('list')}
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
              view === 'list'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <List className="h-4 w-4 mr-2" />
            List View
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
              view === 'calendar'
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Calendar View
          </button>
        </div>
      </div>

      <EventFilters
        filters={filters}
        onFilterChange={setFilters}
      />

      <div className="mt-6">
        {view === 'list' ? (
          <EventList
            events={filteredEvents}
            onAddEvent={canCreate ? () => setIsAddModalOpen(true) : undefined}
            onEditEvent={canEdit ? setEditingEvent : undefined}
            onDeleteEvent={canDelete ? handleDeleteEvent : undefined}
            canManageEvents={canManageEvents}
            userRole={userRole}
          />
        ) : (
          <EventCalendar
            events={filteredEvents}
            onEventClick={(event) => canEdit ? setEditingEvent(event) : undefined}
          />
        )}
      </div>

      <EventList
        events={events}
        onAddEvent={canCreate ? () => setIsAddModalOpen(true) : undefined}
        onEditEvent={canEdit ? setEditingEvent : undefined}
        onDeleteEvent={canDelete ? handleDeleteEvent : undefined}
        canManageEvents={canManageEvents}
        userRole={userRole}
      />
      
      {/* Add Event Modal */}
      {isAddModalOpen && (
        <EventFormModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddEvent}
        />
      )}
      
      {/* Edit Event Modal */}
      {editingEvent && (
        <EventFormModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSubmit={handleEditEvent}
        />
      )}
    </>
  );
};

export default EventManager;