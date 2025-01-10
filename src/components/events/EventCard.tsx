import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  attendees: number;
  type: 'academic' | 'administrative' | 'training' | 'meeting' | 'other';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
  canEdit?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onDelete,
  canEdit = false 
}) => {
  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const typeColors = {
    academic: 'text-purple-600',
    administrative: 'text-blue-600',
    training: 'text-green-600',
    meeting: 'text-orange-600',
    other: 'text-gray-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
          <span className={`text-sm ${typeColors[event.type]}`}>
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
        </span>
      </div>
      
      <p className="mt-2 text-sm text-gray-600">{event.description}</p>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          <span>{new Date(event.startDate).toLocaleTimeString()} - {new Date(event.endDate).toLocaleTimeString()}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-2" />
          <span>{event.attendees} attendees</span>
        </div>
      </div>

      {canEdit && (
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => onEdit?.(event)}
            className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(event.id)}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;