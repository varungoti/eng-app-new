import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Tag, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCalendar } from '../../hooks/useCalendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { cn } from '../../lib/utils';
import { ScheduleDialog } from '../schedule/ScheduleDialog';
import { GoogleCalendarButton } from '../schedule/GoogleCalendarButton';
import LoadingSpinner from '../LoadingSpinner';

const TaskCalendar: React.FC = () => {
  const { user } = useAuth();
  const { events, loading, error, addEvent } = useCalendar();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startingDay = firstDayOfMonth.getDay();
  const totalDays = daysInMonth(currentDate);

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDay }, (_, i) => i);

  const getTasksForDate = (date: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), date);
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === targetDate.toDateString();
    });
  };

  const handleAddTask = async (formData: FormData) => {
    if (!selectedDate) return;

    const startTime = new Date(selectedDate);
    startTime.setHours(parseInt(formData.get('startTime') as string));
    
    const endTime = new Date(selectedDate);
    endTime.setHours(parseInt(formData.get('endTime') as string));

    await addEvent({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startTime,
      endTime,
      type: 'task',
      status: 'scheduled',
      location: 'N/A'
    });

    setIsAddTaskOpen(false);
  };

  if (loading) {
    return <LoadingSpinner message="Loading calendar..." />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="mt-1 text-sm text-gray-500">Manage your tasks and schedule</p>
        </div>
        <div className="flex items-center space-x-4">
          <GoogleCalendarButton />
          <button
            onClick={() => {
              setSelectedDate(new Date());
              setIsAddTaskOpen(true);
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-px">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="bg-gray-50 h-32" />
          ))}
          {days.map((day) => {
            const tasks = getTasksForDate(day);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            return (
              <div
                key={day}
                onClick={() => {
                  setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                  setIsAddTaskOpen(true);
                }}
                className={cn(
                  "h-32 p-2 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors",
                  isToday && "bg-indigo-50"
                )}
              >
                <div className="flex justify-between items-start">
                  <span className={cn(
                    "text-sm font-medium",
                    isToday ? "text-indigo-600" : "text-gray-700"
                  )}>
                    {day}
                  </span>
                  {tasks.length > 0 && (
                    <span className="text-xs font-medium text-gray-500">
                      {tasks.length} tasks
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-1">
                  {tasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="text-xs p-1 rounded bg-indigo-50 text-indigo-700 truncate"
                    >
                      {task.title}
                    </div>
                  ))}
                  {tasks.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{tasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Dialog */}
      <ScheduleDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onSubmit={handleAddTask}
      />
    </div>
  );
};

export default TaskCalendar;