import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useAuth } from './useAuth';
import { useCache } from './useCache';
import { useDebouncedCallback } from '../lib/utils/performance';
import { measurePerformance } from '../lib/utils/performance';
import type { Event } from '../components/events/EventCard';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { cache } = useCache();

  const fetchEvents = async () => {
    try {
      const endMetric = measurePerformance('fetchEvents');
      setLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = `events_${user?.id}`;
      const cachedEvents = cache.get<Event[]>(cacheKey);
      if (cachedEvents) {
        setEvents(cachedEvents);
        endMetric();
        setLoading(false);
        return;
      }
      // Build query based on user role
      let query = supabase
        .from('events')
        .select(`
          *,
          event_attendees (
            user_id,
            status
          )
        `);

      // Apply role-specific filters
      if (user?.role === 'school_principal') {
        query = query.eq('school_id', user.schoolId);
      } else if (user?.role === 'teacher') {
        query = query.eq('school_id', user.schoolId)
          .eq('type', 'academic');
      }

      query = query.order('start_date', { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        logger.error('Failed to fetch events', {
          context: { error: fetchError },
          source: 'useEvents'
        });
        throw fetchError;
      }

      setEvents(data?.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        startDate: event.start_date,
        endDate: event.end_date,
        location: event.location,
        attendees: event.event_attendees?.length || 0,
        type: event.type,
        status: event.status
      })) || []);
      // Cache the results
      cache.set(cacheKey, events, 5 * 60 * 1000); // 5 minutes TTL
      endMetric();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events';
      logger.error(message, { context: { error: err }, source: 'useEvents' });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event: Omit<Event, 'id'>) => {
    try {
      const { data, error: addError } = await supabase
        .from('events')
        .insert([{
          title: event.title,
          description: event.description,
          start_date: event.startDate,
          end_date: event.endDate,
          location: event.location,
          attendees: event.attendees,
          type: event.type,
          status: event.status,
          school_id: user?.schoolId,
          created_by: user?.id
        }])
        .select()
        .single();

      if (addError) throw addError;

      await fetchEvents();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add event';
      logger.error(message, { context: { error: err }, source: 'useEvents' });
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      const { error: updateError } = await supabase
        .from('events')
        .update({
          title: updates.title,
          description: updates.description,
          start_date: updates.startDate,
          end_date: updates.endDate,
          location: updates.location,
          attendees: updates.attendees,
          type: updates.type,
          status: updates.status
        })
        .eq('id', id);

      if (updateError) throw updateError;

      await fetchEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event';
      logger.error(message, { context: { error: err }, source: 'useEvents' });
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      logger.error(message, { context: { error: err }, source: 'useEvents' });
      throw err;
    }
  };

  // Debounce the fetch function
  const debouncedFetch = useDebouncedCallback(fetchEvents, 300);

  useEffect(() => {
    debouncedFetch();
  }, [user?.role, user?.schoolId, debouncedFetch]);

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