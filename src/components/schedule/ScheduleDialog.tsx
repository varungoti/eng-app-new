import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { Clock, Users, Video, MapPin, Bell } from 'lucide-react';

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function ScheduleDialog({ open, onOpenChange, onSubmit }: ScheduleDialogProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('meeting');
  const [notification, setNotification] = useState('30');
  const [guests, setGuests] = useState<string[]>([]);
  const [guestPermissions, setGuestPermissions] = useState({
    modify: false,
    invite: true,
    seeGuestList: true
  });
  const [videoConference, setVideoConference] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      title,
      startDate: startDate ? new Date(
        startDate.setHours(
          parseInt(startTime.split(':')[0]),
          parseInt(startTime.split(':')[1])
        )
      ) : null,
      endDate: endDate ? new Date(
        endDate.setHours(
          parseInt(endTime.split(':')[0]),
          parseInt(endTime.split(':')[1])
        )
      ) : null,
      location,
      description,
      type: eventType,
      notification: parseInt(notification),
      guests,
      guestPermissions,
      videoConference
    };

    onSubmit(eventData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <Input
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start</label>
              <div className="flex gap-2">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  className="rounded-md border"
                />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-24"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End</label>
              <div className="flex gap-2">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  className="rounded-md border"
                />
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-24"
                />
              </div>
            </div>
          </div>

          {/* Event Type */}
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger>
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Location */}
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <Input
              placeholder="Add location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          {/* Video Conference */}
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-gray-500" />
            <Button
              type="button"
              variant={videoConference ? "default" : "outline"}
              onClick={() => setVideoConference(!videoConference)}
            >
              {videoConference ? 'Remove video call' : 'Add Google Meet video conferencing'}
            </Button>
          </div>

          {/* Description */}
          <Textarea
            placeholder="Add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px]"
          />

          {/* Notification */}
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-500" />
            <Select value={notification} onValueChange={setNotification}>
              <SelectTrigger>
                <SelectValue placeholder="Notification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">At time of event</SelectItem>
                <SelectItem value="5">5 minutes before</SelectItem>
                <SelectItem value="10">10 minutes before</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
                <SelectItem value="1440">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Guest Permissions */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Guest permissions</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={guestPermissions.modify}
                  onChange={(e) => setGuestPermissions(prev => ({
                    ...prev,
                    modify: e.target.checked
                  }))}
                />
                <span className="text-sm">Modify event</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={guestPermissions.invite}
                  onChange={(e) => setGuestPermissions(prev => ({
                    ...prev,
                    invite: e.target.checked
                  }))}
                />
                <span className="text-sm">Invite others</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={guestPermissions.seeGuestList}
                  onChange={(e) => setGuestPermissions(prev => ({
                    ...prev,
                    seeGuestList: e.target.checked
                  }))}
                />
                <span className="text-sm">See guest list</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}