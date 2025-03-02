import React from 'react';
import { X } from 'lucide-react';
import type { Event } from './EventCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';

interface EventFormModalProps {
  event?: Event;
  onClose: () => void;
  onSubmit: (event: Omit<Event, 'id'>) => void;
}

const EventFormModal: React.FC<EventFormModalProps> = ({
  event,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      location: formData.get('location') as string,
      attendees: parseInt(formData.get('attendees') as string),
      type: formData.get('type') as Event['type'],
      status: formData.get('status') as Event['status'],
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-4">
          <DialogTitle>
            {event ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to {event ? 'update the' : 'create a new'} event.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={event?.title}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              placeholder="Enter event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={event?.description}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              placeholder="Enter event description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="datetime-local"
                name="startDate"
                aria-label="Event start date and time"
                defaultValue={event?.startDate}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="datetime-local"
                name="endDate"
                aria-label="Event end date and time"
                defaultValue={event?.endDate}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"


              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              defaultValue={event?.location}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              placeholder="Enter event location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Expected Attendees
            </label>
            <input
              type="number"
              name="attendees"
              aria-label="Expected number of attendees"
              defaultValue={event?.attendees}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                name="type"
                aria-label="Event type"
                defaultValue={event?.type}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"

              >
                <option value="academic">Academic</option>
                <option value="administrative">Administrative</option>
                <option value="training">Training</option>
                <option value="meeting">Meeting</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                aria-label="Event status"
                defaultValue={event?.status}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"

              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
            <button
              title="Cancel"
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              title={event ? 'Update Event' : 'Add Event'}
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              {event ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventFormModal;