import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface StudySession {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  duration: number;
  topic: string;
}

export function StudyScheduler() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [showAddSession, setShowAddSession] = useState(false);
  const [newSession, setNewSession] = useState<Partial<StudySession>>({});

  const handleAddSession = () => {
    if (selectedDate && newSession.title && newSession.startTime && newSession.duration) {
      setSessions(prev => [...prev, {
        id: crypto.randomUUID(),
        date: selectedDate,
        ...newSession as Omit<StudySession, 'id' | 'date'>
      }]);
      setShowAddSession(false);
      setNewSession({});
    }
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={setSelectedDate}
        className="rounded-md border"
      />

      <div className="space-y-2">
        {sessions
          .filter(session => 
            selectedDate?.toDateString() === session.date.toDateString()
          )
          .map(session => (
            <div
              key={session.id}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <div>
                <h4 className="font-medium">{session.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {session.topic}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{session.startTime}</span>
                <span>({session.duration} min)</span>
              </div>
            </div>
          ))}
      </div>

      <Dialog open={showAddSession} onOpenChange={setShowAddSession}>
        <DialogTrigger asChild>
          <Button className="w-full">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Add Study Session
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Study Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newSession.title || ''}
                onChange={e => setNewSession(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input
                value={newSession.topic || ''}
                onChange={e => setNewSession(prev => ({
                  ...prev,
                  topic: e.target.value
                }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newSession.startTime || ''}
                  onChange={e => setNewSession(prev => ({
                    ...prev,
                    startTime: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={newSession.duration || ''}
                  onChange={e => setNewSession(prev => ({
                    ...prev,
                    duration: parseInt(e.target.value)
                  }))}
                />
              </div>
            </div>
            <Button onClick={handleAddSession} className="w-full">
              Add Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 