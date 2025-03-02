import React from 'react';
import { Plus } from 'lucide-react';
import EventCard, { Event } from './EventCard';
import { VirtualList } from '../../lib/utils/virtualList';

interface EventListProps {
  events: Event[];
  onAddEvent?: () => void;
  onEditEvent?: (event: Event) => void;
  onDeleteEvent?: (id: string) => void;
  canManageEvents?: boolean;
  userRole: string;
}

const EventList: React.FC<EventListProps> = ({
  events,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  canManageEvents = false
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Events</h2>
        {canManageEvents && (
          <button
            title="Add Event"
            type="button"
            onClick={onAddEvent}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </button>
        )}
      </div>

      <VirtualList
        items={events}
        height={600}
        itemHeight={200}
        renderItem={(event) => (
          <div className="p-3">
            <EventCard
              key={event.id}
              event={event}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
              canEdit={canManageEvents}
            />
          </div>
        )}
      />

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No events found</p>
        </div>
      )}
    </div>
  );
};

export default EventList;