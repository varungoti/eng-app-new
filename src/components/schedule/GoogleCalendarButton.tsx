import React from 'react';
import { Button } from '../ui/button';
import { Calendar, Loader2 } from 'lucide-react';
import { useGoogleCalendar } from '../../hooks/useGoogleCalendar';

export function GoogleCalendarButton() {
  const { isConnected, loading, connect, disconnect } = useGoogleCalendar();

  if (loading) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Connecting...
      </Button>
    );
  }

  if (isConnected) {
    return (
      <Button variant="outline" onClick={disconnect}>
        <Calendar className="h-4 w-4 mr-2" />
        Disconnect Google Calendar
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={connect}>
      <Calendar className="h-4 w-4 mr-2" />
      Connect Google Calendar
    </Button>
  );
}