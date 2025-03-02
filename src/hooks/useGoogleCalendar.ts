import { useState, useEffect } from 'react';
import { googleCalendarService } from '../lib/calendar/GoogleCalendarService';
import { useToast } from './useToast';
import { logger } from '../lib/logger';

// Declare the global gapi object
declare global {
  interface Window {
    gapi: any;
  }
}

export const useGoogleCalendar = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Don't immediately check connection in case GAPI isn't loaded yet
    const gapiLoadCheck = setInterval(() => {
      if (window.gapi?.auth2) {
        clearInterval(gapiLoadCheck);
        checkConnection();
      }
    }, 500);
    
    // Clear interval on unmount to prevent memory leaks
    return () => clearInterval(gapiLoadCheck);
  }, []);

  const checkConnection = async () => {
    try {
      const auth = window.gapi?.auth2?.getAuthInstance();
      if (!auth) {
        logger.info('Google API not fully initialized', {
          source: 'useGoogleCalendar'
        });
        setIsConnected(false);
        return;
      }
      
      setIsConnected(auth.isSignedIn.get() || false);
    } catch (err) {
      logger.error('Failed to check Google Calendar connection', {
        context: { error: err },
        source: 'useGoogleCalendar'
      });
      setIsConnected(false);
    }
  };

  const connect = async () => {
    try {
      setLoading(true);
      await googleCalendarService.signIn();
      setIsConnected(true);
      showToast('Connected to Google Calendar', { type: 'success' });
      await fetchEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect to Google Calendar';
      setError(message);
      showToast(message, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    try {
      await googleCalendarService.signOut();
      setIsConnected(false);
      setEvents([]);
      showToast('Disconnected from Google Calendar', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disconnect from Google Calendar';
      showToast(message, { type: 'error' });
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const events = await googleCalendarService.listEvents();
      setEvents(events);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(message);
      showToast(message, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: any) => {
    try {
      const event = await googleCalendarService.createEvent(eventData);
      setEvents(prev => [...prev, event]);
      showToast('Event created successfully', { type: 'success' });
      return event;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create event';
      showToast(message, { type: 'error' });
      throw err;
    }
  };

  const updateEvent = async (eventId: string, eventData: any) => {
    try {
      const event = await googleCalendarService.updateEvent(eventId, eventData);
      setEvents(prev => prev.map(e => e.id === eventId ? event : e));
      showToast('Event updated successfully', { type: 'success' });
      return event;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event';
      showToast(message, { type: 'error' });
      throw err;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await googleCalendarService.deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      showToast('Event deleted successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      showToast(message, { type: 'error' });
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    isConnected,
    connect,
    disconnect,
    createEvent,
    updateEvent,
    deleteEvent,
    refresh: fetchEvents
  };
};