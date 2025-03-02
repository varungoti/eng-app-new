import { useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Upload } from 'lucide-react';
import type { Class } from '../types';
import { useAuth } from '../hooks/useAuth';
import ScheduleImport from '../components/schedule/ScheduleImport';
import TaskCalendar from '../components/calendar/TaskCalendar';

const Schedule = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Show class schedule for school roles, task calendar for others
  const showClassSchedule = ['school_leader', 'school_principal', 'teacher_head'].includes(user?.role || '');

  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const handleAddClass = (classData: Omit<Class, 'id'>) => {
    setClasses([...classes, { ...classData, id: Number(Date.now().toString()) }]);
    setIsAddModalOpen(false);
  };

  const handleImportSchedules = (schedules: Omit<Class, 'id'>[]) => {
    const newSchedules = schedules.map(schedule => ({
      ...schedule,
      id: Number(Date.now().toString())
    }));
    setClasses([...classes, ...newSchedules]);
    setIsImportModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {showClassSchedule ? 'Class Schedule' : 'Task Calendar'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {showClassSchedule 
              ? 'Manage and view class schedules' 
              : 'Manage your tasks and daily schedule'}
          </p>
        </div>
        <div className="flex space-x-4">
          {showClassSchedule ? (
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Schedules
            </button>
          ) : null}
          {showClassSchedule ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </button>
          ) : null}
        </div>
      </div>

      {showClassSchedule ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {classes.map((classItem) => (
              <li key={classItem.id}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center">
                        <Calendar className="h-6 w-6 text-indigo-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-indigo-600">
                            Grade {classItem.grade_id}
                          </div>
                          <div className="text-sm text-gray-500">
                            Teacher ID: {classItem.teacherId}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        {classItem.schedule.map((schedule, index) => (
                          <div
                            key={index}
                            className="text-sm text-gray-500"
                          >
                            {daysOfWeek[schedule.dayOfWeek]}: {schedule.startTime} -{' '}
                            {schedule.endTime}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0">
                      <div className="flex space-x-4">
                        <button 
                          className="text-gray-400 hover:text-gray-500"
                          aria-label="Edit class"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setClasses(classes.filter((c) => c.id !== classItem.id));
                          }}
                          className="text-red-400 hover:text-red-500"
                          aria-label="Delete class"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <TaskCalendar />
      )}

      {/* Add Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Add New Class</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleAddClass({
                  schoolId: formData.get('schoolId') as string,
                  grade_id: formData.get('gradeId') as string,
                  teacherId: formData.get('teacherId') as string,
                  name: "",
                  description: null,
                  section: null,
                  created_by: null,
                  created_at: new Date(),
                  updated_at: new Date(),
                  schedule: [
                    {
                      dayOfWeek: parseInt(formData.get('dayOfWeek') as string),
                      startTime: formData.get('startTime') as string,
                      endTime: formData.get('endTime') as string,
                    },
                  ],
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700" id="schoolId-label">
                    School ID
                  </label>
                  <input
                    type="text"
                    name="schoolId"
                    required
                    aria-labelledby="schoolId-label"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" id="gradeId-label">
                    Grade ID
                  </label>
                  <input
                    type="text"
                    name="gradeId"
                    required
                    aria-labelledby="gradeId-label"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" id="teacherId-label">
                    Teacher ID
                  </label>
                  <input
                    type="text"
                    name="teacherId"
                    required
                    aria-labelledby="teacherId-label"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" id="dayOfWeek-label">
                    Day of Week
                  </label>
                  <select
                    name="dayOfWeek"
                    required
                    aria-labelledby="dayOfWeek-label"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {daysOfWeek.map((day, index) => (
                      <option key={day} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" id="startTime-label">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    aria-labelledby="startTime-label"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700" id="endTime-label">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    aria-labelledby="endTime-label"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo -500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-5 sm:mt-6 flex space-x-3">
                <button
                  type="submit"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Add Class
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <ScheduleImport
          onImport={handleImportSchedules}
          onClose={() => setIsImportModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Schedule;