import { supabase } from '../../supabase';
import { logger } from '../../logger';
import type { CalendarEvent } from './types';

class CalendarManager {
  private static instance: CalendarManager;
  private subscribers: Set<(events: CalendarEvent[]) => void> = new Set();

  private constructor() {
    this.setupRealtimeSubscription();
  }

  public static getInstance(): CalendarManager {
    if (!CalendarManager.instance) {
      CalendarManager.instance = new CalendarManager();
    }
    return CalendarManager.instance;
  }

  private setupRealtimeSubscription() {
    supabase
      .channel('calendar_events')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'calendar_events' },
        this.handleEventChange.bind(this)
      )
      .subscribe();
  }

  private async handleEventChange() {
    await this.fetchEvents();
  }

  public async fetchEvents(filters?: {
    startDate?: Date;
    endDate?: Date;
    type?: string;
  }): Promise<CalendarEvent[]> {
    try {
      let query = supabase
        .from('calendar_events')
        .select(`
          *,
          calendar_attendees (
            user_id,
            response
          )
        `)
        .order('start_time', { ascending: true });

      if (filters?.startDate) {
        query = query.gte('start_time', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('end_time', filters.endDate.toISOString());
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }

      const { data, error } = await query;

      if (error) throw error;

      const events = data.map(this.mapEvent);
      this.notifySubscribers(events);
      return events;
    } catch (err) {
      logger.error('Failed to fetch calendar events', {
        context: { error: err },
        source: 'CalendarManager'
      });
      return [];
    }
  }

  private mapEvent(data: any): CalendarEvent {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      location: data.location,
      type: data.type,
      status: data.status,
      recurrence: data.recurrence,
      attendees: data.calendar_attendees?.map((a: any) => ({
        userId: a.user_id,
        response: a.response
      })) || []
    };
  }

  public subscribe(callback: (events: CalendarEvent[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(events: CalendarEvent[]) {
    this.subscribers.forEach(callback => callback(events));
  }
}

export const calendarManager = CalendarManager.getInstance();