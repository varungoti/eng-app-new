import { useState, useEffect } from 'react';
import { calendarManager } from '../lib/features/calendar/CalendarManager';
import type { CalendarEvent, CalendarFilters } from '../lib/features/calendar/types';
import { useToast } from './useToast';

export const useCalendarEvents = (filters?: CalendarFilters) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await calendarManager.fetchEvents(filters);
        setEvents(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch calendar events';
        setError(message);
        showToast(message, { type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    return calendarManager.subscribe(setEvents);
  }, [filters, showToast]);

  return {
    events,
    loading,
    error
  };
};