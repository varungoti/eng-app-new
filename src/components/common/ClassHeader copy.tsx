import React, { useState, useEffect } from 'react';
import { Class } from '../../types';

interface ClassHeaderProps {
  classes: Class[];
  selectedClass: Class;
  onClassChange: (classData: Class) => void;
}

// Utility function to convert 12-hour time format to 24-hour time
const convertTo24Hour = (time: string): number => {
  const [timeStr, modifier] = time.split(' ');
  let [hours, minutes] = timeStr.split(':').map(Number);
  
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes; // Return time in minutes
};

// Utility function to get the current day of the week
const getCurrentDay = (): string => {
  const today = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[today.getDay()];
};

export default function ClassHeader({ classes, selectedClass, onClassChange }: ClassHeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [activeClass, setActiveClass] = useState<Class | null>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const today = new Date();
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const date = today.toLocaleDateString('en-GB', options); // Format: DD/MM/YY
      setCurrentDateTime(`Today, ${time}, ${date}`);
    };

    // Update the date and time every minute
    const intervalId = setInterval(updateDateTime, 60000);

    // Set the initial date and time immediately
    updateDateTime();

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  useEffect(() => {
    // Get the current time in 24-hour format (in minutes)
    const currentTime = new Date();
    const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const currentDay = getCurrentDay(); // Get today's day

    // Find the class that matches the current time and day within the schedule range
    const matchingClass = classes.find((classData) => {
      // Split the schedule to get the days and times
      const [scheduleDays, timeRange] = classData.schedule.split(', ');
      const [startTime, endTime] = timeRange.split(' - ');

      // Convert the class schedule times to 24-hour time in minutes
      const startMinutes = convertTo24Hour(startTime);
      const endMinutes = convertTo24Hour(endTime);

      // Get the days of the class schedule (e.g., "Mon - Fri", "Mon - Sat")
      const [startDay, endDay] = scheduleDays.split(' - ');

      // Check if today is within the scheduled days
      const isTodayInSchedule = () => {
        if (startDay === 'Mon' && endDay === 'Sun') {
          return true; // All days are active (Mon - Sun)
        }

        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const startIdx = daysOfWeek.indexOf(startDay);
        const endIdx = daysOfWeek.indexOf(endDay);
        const currentIdx = daysOfWeek.indexOf(currentDay);

        // Check if current day is within the start and end days
        return currentIdx >= startIdx && currentIdx <= endIdx;
      };

      // Check if the current time is within the class's schedule time range
      return isTodayInSchedule() && currentTimeInMinutes >= startMinutes && currentTimeInMinutes <= endMinutes;
    });

    if (matchingClass) {
      setActiveClass(matchingClass); // Set active class based on schedule and time
      onClassChange(matchingClass);  // Pass active class to parent
    } else {
      setActiveClass(null); // If no class is active, set to null
      onClassChange(null);   // Pass null if no class is active
    }
  }, [currentDateTime, classes]); // Re-run when current time or class data changes

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600">Manage your active classes and schedules</p>
        </div>
        <p className="text-xl text-gray-700">{currentDateTime}</p>
      </div> 

      <div className="flex space-x-4 mb-6 border-b border-gray-200 overflow-y-auto w-full">
        {classes.length > 0 ? (
          classes.map((classData, index) => {
            // If no class is active, default to the first tab
            const isDefaultSelected = activeClass === null && index === 0;

            return (
              <button
              key={classData.id}
              onClick={() => onClassChange(classData)}
              className={`pb-2 text-lg w-32 rounded-lg ${
                  activeClass?.id === classData?.id || selectedClass?.id === classData?.id
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600'
                } ${activeClass?.id === classData.id ? 'text-white bg-green-500' : ''} 
                   
                `} 
              >
                <div>{classData.name}</div>
                {/* <div className="ml-2 text-xs px-2">{classData.schedule}</div> */}
              </button>
            );
          })
        ) : (
          <button
            className="pb-2 text-lg rounded-lg text-indigo-600 border-b-2 border-indigo-600"
            onClick={() => onClassChange(classes[0])} // Default to the first tab
          >
            Default Class (No classes found)
          </button>
        )}
      </div>
    </div>
  );
}
