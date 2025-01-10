import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { logger } from '../lib/logger';
import { useToast } from './useToast';
import { useCache } from './useCache';

interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  type: 'meeting' | 'task' | 'reminder' | 'other';
  status: 'scheduled' | 'cancelled' | 'completed';
}

export const useCalendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { cache } = useCache();

  const fetchEvents = async () => {
    try {
      if (!user) {
        logger.info('No user found, skipping calendar fetch', {
          source: 'useCalendar'
        });
        return;
      }

      setLoading(true);
      setError(null);

      // Check cache first
      const cached = cache.get<CalendarEvent[]>('calendar_events');
      if (cached) {
        setEvents(cached);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .select('id, user_id, title, description, start_time, end_time, location, type, status')
        .order('start_time', { ascending: true });

      if (error) {
        logger.error('Failed to fetch calendar events', {
          context: { error },
          source: 'useCalendar'
        });
        throw error;
      }

      const mappedEvents = (data || []).map(event => ({
        id: event.id,
        userId: event.user_id,
        title: event.title,
        description: event.description,
        startTime: new Date(event.start_time),
        endTime: new Date(event.end_time),
        location: event.location,
        type: event.type,
        status: event.status
      }));

      setEvents(mappedEvents);
      if (mappedEvents.length > 0) {
        cache.set('calendar_events', mappedEvents, 5 * 60 * 1000);
      }

      logger.info('Calendar events fetched successfully', {
        context: { count: mappedEvents.length },
        source: 'useCalendar'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load calendar events';
      setError(message);
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'useCalendar'
      });
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<CalendarEvent, 'id' | 'userId'>) => {
    if (!user) {
      const message = 'User must be logged in to add events';
      showToast(message, { type: 'error' });
      logger.error(message, { source: 'useCalendar' });
      return;
    }

    try {
      const { data, error: createError } = await supabase
        .from('calendar_events')
        .insert({
          title: event.title,
          description: event.description,
          user_id: user?.id,
          start_time: event.startTime.toISOString(),
          end_time: event.endTime.toISOString(),
          location: event.location,
          type: event.type,
          status: event.status
        })
        .select()
        .single();

      if (createError) throw createError;

      // Invalidate cache and refetch
      cache.clear();
      await fetchEvents();

      showToast('Event added successfully', { type: 'success' });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add event';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'useCalendar'
      });
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    if (!user) {
      const message = 'User must be logged in to update events';
      showToast(message, { type: 'error' });
      logger.error(message, { source: 'useCalendar' });
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('calendar_events')
        .update({
          title: updates.title,
          description: updates.description,
          start_time: updates.startTime?.toISOString(),
          end_time: updates.endTime?.toISOString(),
          location: updates.location,
          type: updates.type,
          status: updates.status
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Invalidate cache and refetch
      cache.clear();
      await fetchEvents();

      showToast('Event updated successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'useCalendar'
      });
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    if (!user) {
      const message = 'User must be logged in to delete events';
      showToast(message, { type: 'error' });
      logger.error(message, { source: 'useCalendar' });
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Invalidate cache and refetch
      cache.clear();
      await fetchEvents();

      showToast('Event deleted successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'useCalendar'
      });
      throw err;
    }
  };

  // Fetch events on mount
  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  return {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    refresh: fetchEvents
  };
};