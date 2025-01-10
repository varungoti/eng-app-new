import { logger } from '../logger';

interface GoogleCalendarConfig {
  clientId: string;
  apiKey: string;
  scopes: string[];
}

class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private initialized: boolean = false;
  private gapi: any = null;

  private constructor() {
    // Initialize when window.gapi is available
    if (typeof window !== 'undefined') {
      this.loadGoogleAPI();
    }
  }

  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  private async loadGoogleAPI() {
    try {
      // Load the Google API client library
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', this.initClient.bind(this));
      };
      document.body.appendChild(script);
    } catch (error) {
      logger.error('Failed to load Google API', {
        context: { error },
        source: 'GoogleCalendarService'
      });
    }
  }

  private async initClient() {
    try {
      await window.gapi.client.init({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      });

      this.gapi = window.gapi;
      this.initialized = true;

      logger.info('Google Calendar API initialized', {
        source: 'GoogleCalendarService'
      });
    } catch (error) {
      logger.error('Error initializing Google Calendar API', {
        context: { error },
        source: 'GoogleCalendarService'
      });
    }
  }

  public async signIn(): Promise<void> {
    try {
      if (!this.initialized) {
        throw new Error('Google Calendar API not initialized');
      }
      await this.gapi.auth2.getAuthInstance().signIn();
    } catch (error) {
      logger.error('Failed to sign in to Google Calendar', {
        context: { error },
        source: 'GoogleCalendarService'
      });
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    try {
      if (!this.initialized) {
        throw new Error('Google Calendar API not initialized');
      }
      await this.gapi.auth2.getAuthInstance().signOut();
    } catch (error) {
      logger.error('Failed to sign out from Google Calendar', {
        context: { error },
        source: 'GoogleCalendarService'
      });
      throw error;
    }
  }

  public async listEvents(calendarId: string = 'primary'): Promise<any[]> {
    try {
      if (!this.initialized) {
        throw new Error('Google Calendar API not initialized');
      }

      const response = await this.gapi.client.calendar.events.list({
        calendarId,
        timeMin: (new Date()).toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: 'startTime'
      });

      return response.result.items;
    } catch (error) {
      logger.error('Failed to fetch Google Calendar events', {
        context: { error, calendarId },
        source: 'GoogleCalendarService'
      });
      throw error;
    }
  }

  public async createEvent(event: any): Promise<any> {
    try {
      if (!this.initialized) {
        throw new Error('Google Calendar API not initialized');
      }

      const response = await this.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return response.result;
    } catch (error) {
      logger.error('Failed to create Google Calendar event', {
        context: { error, event },
        source: 'GoogleCalendarService'
      });
      throw error;
    }
  }

  public async updateEvent(eventId: string, event: any): Promise<any> {
    try {
      if (!this.initialized) {
        throw new Error('Google Calendar API not initialized');
      }

      const response = await this.gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId,
        resource: event,
      });

      return response.result;
    } catch (error) {
      logger.error('Failed to update Google Calendar event', {
        context: { error, eventId, event },
        source: 'GoogleCalendarService'
      });
      throw error;
    }
  }

  public async deleteEvent(eventId: string): Promise<void> {
    try {
      if (!this.initialized) {
        throw new Error('Google Calendar API not initialized');
      }

      await this.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
    } catch (error) {
      logger.error('Failed to delete Google Calendar event', {
        context: { error, eventId },
        source: 'GoogleCalendarService'
      });
      throw error;
    }
  }
}

export const googleCalendarService = GoogleCalendarService.getInstance();