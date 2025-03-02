import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScheduleDialog } from './ScheduleDialog';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Lock,
  Plus,
  RotateCcw,
  Unlock,
  Users,
  Shield,
  ExternalLink,
  RefreshCw,
  Filter,
  FileText,
  X,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useCallback } from 'react';
import { toast } from "@/components/ui/use-toast";
import ClassHeader from "@/components/common/ClassHeader";
import { ExtendedLesson, SubLesson } from "@/types/index";
import { classesData } from "@/data/mockData";
import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleCalendarButton } from './GoogleCalendarButton';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Microsoft icon component since it's not in lucide-react
const MicrosoftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 23 23"
    width="24"
    height="24"
    {...props}
  >
    <path fill="#f25022" d="M1 1h10v10H1z" />
    <path fill="#00a4ef" d="M1 12h10v10H1z" />
    <path fill="#7fba00" d="M12 1h10v10H12z" />
    <path fill="#ffb900" d="M12 12h10v10H12z" />
  </svg>
);

// More specific type instead of empty interface
type IAppProps = Record<string, never>;

class App extends React.Component<IAppProps> {
  public render() {
    return (
      <div>
        <h1>Task Calendar</h1>
        
        
      </div>
    );
  }
}

// Interface for CalendarEvent
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  color?: string;
  isAllDay?: boolean;
  recurrence?: string;
  attendees?: string[];
  source?: 'local' | 'google' | 'microsoft';
}

// Interface for MicrosoftCalendarIntegration props
interface MicrosoftCalendarButtonProps {
  onConnect: () => Promise<void>;
  onSync: () => Promise<void>;
  isConnected: boolean;
  isLoading: boolean;
}

// Microsoft Calendar Button Component
const MicrosoftCalendarButton = ({
  onConnect,
  onSync,
  isConnected,
  isLoading
}: MicrosoftCalendarButtonProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2 transition-all duration-300",
              isConnected ? "bg-blue-50 hover:bg-blue-100 border-blue-200" : ""
            )}
            onClick={isConnected ? onSync : onConnect}
            disabled={isLoading}
          >
            <MicrosoftIcon className={cn(
              "h-4 w-4 transition-transform",
              isLoading ? "animate-spin" : "group-hover:scale-110"
            )} />
            <span className="hidden sm:inline">
              {isConnected ? "Sync Microsoft Calendar" : "Connect Microsoft Calendar"}
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isConnected 
            ? "Sync your events with Microsoft Calendar" 
            : "Connect your Microsoft Calendar account"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function TaskCalendar() {
  const [selectedLesson, setSelectedLesson] = useState<ExtendedLesson | null>(null);
  const [selectedSubLesson, setSelectedSubLesson] = useState<SubLesson | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<ExtendedLesson | null>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [selectedClass, setSelectedClass] = useState(classesData[0] || null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isMicrosoftConnected, setIsMicrosoftConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [filterBy, setFilterBy] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle class change with animation
  const handleClassChange = useCallback((newClass: any) => {
    setSelectedClass(newClass);
    toast({
      title: "Class selected",
      description: `Switched to ${newClass.name}`,
      duration: 2000,
    });
  }, []);

  // Connect to Microsoft Calendar
  const handleMicrosoftConnect = useCallback(async () => {
    try {
      setIsSyncing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsMicrosoftConnected(true);
      toast({
        title: "Connected to Microsoft Calendar",
        description: "Your Microsoft Calendar has been connected successfully"
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Could not connect to Microsoft Calendar. Please try again."
      });
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Sync with Microsoft Calendar
  const handleMicrosoftSync = useCallback(async () => {
    try {
      setIsSyncing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add sample events from Microsoft
      const newEvents: CalendarEvent[] = [
        {
          id: `ms-${Date.now()}-1`,
          title: "Team Meeting",
          start: new Date(new Date().setHours(11, 0, 0, 0)),
          end: new Date(new Date().setHours(12, 0, 0, 0)),
          description: "Weekly team sync-up",
          source: "microsoft",
          color: "#0078d4"
        },
        {
          id: `ms-${Date.now()}-2`,
          title: "Project Review",
          start: new Date(new Date().setHours(14, 30, 0, 0)),
          end: new Date(new Date().setHours(15, 30, 0, 0)),
          description: "Review project progress",
          source: "microsoft",
          color: "#0078d4"
        }
      ];
      
      setEvents(prev => [...prev, ...newEvents]);
      
      toast({
        title: "Microsoft Calendar synced",
        description: "Your events have been synced with Microsoft Calendar"
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Could not sync with Microsoft Calendar. Please try again."
      });
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Connect to Google Calendar
  const handleGoogleConnect = useCallback(async () => {
    try {
      setIsSyncing(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsGoogleConnected(true);
      
      // Add sample events from Google
      const newEvents: CalendarEvent[] = [
        {
          id: `google-${Date.now()}-1`,
          title: "Doctor's Appointment",
          start: new Date(new Date().setHours(9, 0, 0, 0)),
          end: new Date(new Date().setHours(10, 0, 0, 0)),
          description: "Annual checkup",
          source: "google",
          color: "#4285F4"
        },
        {
          id: `google-${Date.now()}-2`,
          title: "Lunch with Client",
          start: new Date(new Date().setHours(12, 30, 0, 0)),
          end: new Date(new Date().setHours(13, 30, 0, 0)),
          description: "Discuss project requirements",
          source: "google",
          color: "#4285F4"
        }
      ];
      
      setEvents(prev => [...prev, ...newEvents]);
      
      toast({
        title: "Connected to Google Calendar",
        description: "Your Google Calendar has been connected successfully"
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Could not connect to Google Calendar. Please try again."
      });
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Add a new event to the calendar
  const handleAddEvent = useCallback(async (eventData: any) => {
    try {
      // Create a new event
      const newEvent: CalendarEvent = {
        id: `local-${Date.now()}`,
        title: eventData.title,
        start: new Date(eventData.startDate),
        end: new Date(eventData.endDate),
        description: eventData.description,
        location: eventData.location,
        color: "#34d399", // Green for local events
        source: "local",
      };
      
      // Add to local state
      setEvents(prev => [...prev, newEvent]);
      
      // Show success message
      toast({
        title: "Event created successfully",
        description: "Your event has been added to the calendar."
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Failed to create event",
        description: "There was an error creating your event. Please try again."
      });
      return false;
    }
  }, []);

  return (
    <motion.div 
      className="max-w-6xl w-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
        variants={{
          hidden: { opacity: 0, y: -20 },
          show: { opacity: 1, y: 0 }
        }}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <ClassHeader
            classes={classesData}
            selectedClass={selectedClass}
            onClassChange={handleClassChange}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setIsAddEventOpen(true)}
                    className="transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                Add a new event to your calendar
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* View selector */}
          <div className="bg-secondary rounded-lg p-0.5 flex items-center">
            {(['day', 'week', 'month'] as const).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(mode)}
                className={cn(
                  "capitalize text-xs py-1 px-3 h-7",
                  viewMode === mode ? "bg-white shadow-sm" : "hover:bg-secondary-foreground/10"
                )}
              >
                {mode}
              </Button>
            ))}
          </div>
          
          {/* Filter button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={cn(
                    "gap-2 transition-all duration-300",
                    isFilterOpen ? "bg-secondary" : ""
                  )}
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter events by source</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Google Calendar integration */}
          <GoogleCalendarButton 
            onConnect={handleGoogleConnect}
            onSync={handleGoogleConnect}
            isConnected={isGoogleConnected}
            isLoading={isSyncing}
          />
          
          {/* Microsoft Calendar integration */}
          <MicrosoftCalendarButton
            onConnect={handleMicrosoftConnect}
            onSync={handleMicrosoftSync}
            isConnected={isMicrosoftConnected}
            isLoading={isSyncing}
          />
          
          {/* Lock/Unlock button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLocked(!isLocked)}
                    className="transition-colors duration-300"
                  >
                    {isLocked ? (
                      <>
                        <Lock className="h-4 w-4 mr-2 transition-transform duration-300" />
                        <span className="hidden sm:inline">Locked</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-4 w-4 mr-2 transition-transform duration-300" />
                        <span className="hidden sm:inline">Unlocked</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                {isLocked ? "Unlock to edit events" : "Lock to prevent changes"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
      
      {/* Filter dropdown */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mb-4 overflow-hidden"
          >
            <Card className="border border-secondary p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Filter Events</h3>
                <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filterBy.includes('local') ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (filterBy.includes('local')) {
                      setFilterBy(filterBy.filter(f => f !== 'local'));
                    } else {
                      setFilterBy([...filterBy, 'local']);
                    }
                  }}
                  className="gap-2"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Local</span>
                </Button>
                <Button
                  variant={filterBy.includes('google') ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (filterBy.includes('google')) {
                      setFilterBy(filterBy.filter(f => f !== 'google'));
                    } else {
                      setFilterBy([...filterBy, 'google']);
                    }
                  }}
                  className="gap-2"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  <span>Google</span>
                </Button>
                <Button
                  variant={filterBy.includes('microsoft') ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (filterBy.includes('microsoft')) {
                      setFilterBy(filterBy.filter(f => f !== 'microsoft'));
                    } else {
                      setFilterBy([...filterBy, 'microsoft']);
                    }
                  }}
                  className="gap-2"
                >
                  <MicrosoftIcon className="h-3.5 w-3.5" />
                  <span>Microsoft</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Calendar placeholder - Would be replaced with actual calendar implementation */}
      <Card className="border overflow-hidden shadow-sm">
        <CardHeader className="bg-secondary/20 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ArrowRight className="h-4 w-4 -rotate-180" />
              </Button>
              <CardTitle className="text-xl font-medium">
                {new Intl.DateTimeFormat('en-US', { 
                  month: 'long', 
                  year: 'numeric',
                  day: viewMode === 'day' ? 'numeric' : undefined
                }).format(selectedDate)}
              </CardTitle>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDate(new Date())}>
                Today
              </Button>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Week view layout - Just a placeholder for demo */}
          {viewMode === 'week' && (
            <div className="grid grid-cols-7 border-b border-border">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={day} className={cn(
                  "p-2 text-center border-r border-border last:border-r-0",
                  i === new Date().getDay() && "bg-primary/5"
                )}>
                  <div className="text-xs text-muted-foreground mb-1">{day}</div>
                  <motion.div 
                    className={cn(
                      "mx-auto h-8 w-8 rounded-full flex items-center justify-center text-sm",
                      i === new Date().getDay() && "bg-primary text-primary-foreground"
                    )}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {new Date(new Date().setDate(new Date().getDate() - new Date().getDay() + i)).getDate()}
                  </motion.div>
                </div>
              ))}
            </div>
          )}
          
          {/* Events display - Just a placeholder for demo */}
          <div className="p-4 min-h-[600px]">
            <AnimatePresence>
              {events.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center h-[400px] text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-lg font-medium mb-2">No events scheduled</h3>
                  <p className="text-muted-foreground max-w-md">
                    Add events to your calendar or connect with Google or Microsoft Calendar to import your existing events.
                  </p>
                  <Button 
                    variant="default" 
                    onClick={() => setIsAddEventOpen(true)}
                    className="mt-6"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Event
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[...events]
                    .filter(event => filterBy.length === 0 || filterBy.includes(event.source || 'local'))
                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                    .map(event => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-lg border border-border p-3 hover:shadow-md transition-shadow cursor-pointer"
                        style={{ 
                          borderLeftColor: event.color || '#6366f1',
                          borderLeftWidth: '4px'
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center mt-1 text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              {event.start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                              {event.end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                          </div>
                          {event.source && (
                            <div className={cn(
                              "text-xs px-2 py-1 rounded-full",
                              event.source === 'google' ? "bg-blue-50 text-blue-600" :
                              event.source === 'microsoft' ? "bg-blue-50 text-blue-600" :
                              "bg-green-50 text-green-600"
                            )}>
                              {event.source === 'google' && "Google"}
                              {event.source === 'microsoft' && "Microsoft"}
                              {event.source === 'local' && "Local"}
                            </div>
                          )}
                        </div>
                        {event.description && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        )}
                      </motion.div>
                    ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Add Event Dialog */}
      <ScheduleDialog
        open={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        onSubmit={async (eventData) => {
          const success = await handleAddEvent(eventData);
          if (success) {
            setIsAddEventOpen(false);
          }
        }}
      />
    </motion.div>
  );
}