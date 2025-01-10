export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  type: 'meeting' | 'task' | 'reminder' | 'other';
  status: 'scheduled' | 'cancelled' | 'completed';
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    until?: Date;
  };
  attendees: Array<{
    userId: string;
    response: 'accepted' | 'declined' | 'maybe' | 'pending';
  }>;
}

export interface CalendarFilters {
  startDate?: Date;
  endDate?: Date;
  type?: string;
  status?: string;
}