"use client"
import React from 'react';
import { Users, BookOpen, Trophy, Clock } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Total Students', value: '124' },
  { icon: BookOpen, label: 'Total Lessons Planned', value: '38' },
  { icon: Trophy, label: 'Avg. Performance', value: '87%' },
  { icon: Clock, label: 'Total Teaching Hours', value: '156' },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
      {stats.map((stat) => (
        <div key={stat.label} className=" bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border  border-gray-200 dark:border-gray-800 ">
          <div className="flex items-center justify-between mb-4">
            <stat.icon className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
          </div>
          <p className="text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// import React from 'react';
// import { Users, BookOpen, Trophy, Clock } from 'lucide-react';

// const dashboardData = {
//   topSummary: [
//     { icon: Users, label: 'Total Students', value: '124' },
//     { icon: BookOpen, label: 'Lessons Planned', value: '45' },
//     { icon: Trophy, label: 'Avg. Performance', value: '87%' },
//     { icon: Clock, label: 'Total Teaching Hours', value: '156' }
//   ],
//   classWiseProgress: [
//     { class: 'Grade 1', totalStudents: 30, lessons: { planned: 15, completed: 10 }, hoursCovered: '50', avgPerformance: '82%' },
//     { class: 'Grade 2', totalStudents: 25, lessons: { planned: 18, completed: 14 }, hoursCovered: '60', avgPerformance: '85%' },
//     { class: 'Grade 3', totalStudents: 20, lessons: { planned: 12, completed: 9 }, hoursCovered: '46', avgPerformance: '89%' }
//   ],
//   studentPerformance: [
//     { name: 'John Doe', class: 'Grade 1', performance: '88%', attendanceRate: '95%', lastCompletedLesson: 'Lesson 10', hoursSpent: '20' },
//     { name: 'Jane Smith', class: 'Grade 2', performance: '82%', attendanceRate: '90%', lastCompletedLesson: 'Lesson 14', hoursSpent: '25' },
//     { name: 'Emily Johnson', class: 'Grade 3', performance: '91%', attendanceRate: '92%', lastCompletedLesson: 'Lesson 9', hoursSpent: '22' }
//   ],
//   lessonProgress: [
//     { class: 'Grade 1', lessonsPlanned: 15, lessonsCompleted: 10, progressPercentage: '66%' },
//     { class: 'Grade 2', lessonsPlanned: 18, lessonsCompleted: 14, progressPercentage: '78%' },
//     { class: 'Grade 3', lessonsPlanned: 12, lessonsCompleted: 9, progressPercentage: '75%' }
//   ],
//   actionableSuggestions: [
//     { message: 'Review Lesson 10 completion for Grade 1.' },
//     { message: 'Plan more engaging activities for Grade 2 to boost performance.' },
//     { message: 'Follow up with students with attendance below 90%.' }
//   ]
// };

// export default function DashboardStats() {
//   return (
//     <div className="space-y-8">
//       {/* Top Summary */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {dashboardData.topSummary.map((stat) => {
//           const Icon = stat.icon;
//           return (
//             <div
//               key={stat.label}
//               className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800"
//               aria-label={`${stat.label}: ${stat.value}`}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <Icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
//                 <span className="text-2xl font-bold text-gray-900 dark:text-white">
//                   {stat.value}
//                 </span>
//               </div>
//               <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
//             </div>
//           );
//         })}
//       </div>

//       {/* Class-wise Progress */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Class-wise Progress</h2>
//         <div className="space-y-4">
//           {dashboardData.classWiseProgress.map((cls) => (
//             <div
//               key={cls.class}
//               className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800"
//             >
//               <h3 className="font-bold text-gray-900 dark:text-white">{cls.class}</h3>
//               <p>Total Students: {cls.totalStudents}</p>
//               <p>Lessons Planned: {cls.lessons.planned}, Completed: {cls.lessons.completed}</p>
//               <p>Total Hours Covered: {cls.hoursCovered}</p>
//               <p>Avg. Performance: {cls.avgPerformance}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Student Performance */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Student Performance</h2>
//         <div className="space-y-4">
//           {dashboardData.studentPerformance.map((student) => (
//             <div
//               key={student.name}
//               className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800"
//             >
//               <h3 className="font-bold text-gray-900 dark:text-white">{student.name} - {student.class}</h3>
//               <p>Performance: {student.performance}</p>
//               <p>Attendance Rate: {student.attendanceRate}</p>
//               <p>Last Completed Lesson: {student.lastCompletedLesson}</p>
//               <p>Hours Spent: {student.hoursSpent}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Lesson Progress */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Lesson Progress</h2>
//         <div className="space-y-4">
//           {dashboardData.lessonProgress.map((lesson) => (
//             <div
//               key={lesson.class}
//               className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800"
//             >
//               <h3 className="font-bold text-gray-900 dark:text-white">{lesson.class}</h3>
//               <p>Lessons Planned: {lesson.lessonsPlanned}</p>
//               <p>Lessons Completed: {lesson.lessonsCompleted}</p>
//               <p>Progress: {lesson.progressPercentage}</p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Actionable Suggestions */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Actionable Suggestions</h2>
//         <ul className="space-y-2">
//           {dashboardData.actionableSuggestions.map((suggestion, index) => (
//             <li
//               key={index}
//               className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800"
//             >
//               <p>{suggestion.message}</p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from 'react';
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { Users, BookOpen, Trophy, Clock } from 'lucide-react';

// // Sample data (you can expand this as needed)
// const dashboardData = {
//   grades: [
//     'Grade 1',
//     'Grade 2',
//     'Grade 3'
//   ],
//   stats: {
//     totalStudents: 124,
//     lessonsPlanned: 45,
//     avgPerformance: 87,
//     teachingHours: 156
//   },
//   classWiseData: {
//     'Grade 1': {
//       lessons: { planned: 15, completed: 10 },
//       studentsPerformance: [
//         { name: 'John Doe', performance: 88 },
//         { name: 'Jane Smith', performance: 82 },
//         { name: 'Emily Johnson', performance: 91 }
//       ]
//     },
//     'Grade 2': {
//       lessons: { planned: 18, completed: 14 },
//       studentsPerformance: [
//         { name: 'Chris Paul', performance: 79 },
//         { name: 'Katie Brown', performance: 84 },
//         { name: 'Sam Green', performance: 89 }
//       ]
//     },
//     'Grade 3': {
//       lessons: { planned: 12, completed: 9 },
//       studentsPerformance: [
//         { name: 'David Black', performance: 90 },
//         { name: 'Lucy White', performance: 85 },
//         { name: 'Michael Green', performance: 88 }
//       ]
//     }
//   }
// };

// export default function DashboardStats() {
//   const [selectedGrade, setSelectedGrade] = useState(dashboardData.grades[0]);

//   // Get data for the selected grade
//   const gradeData = dashboardData.classWiseData[selectedGrade];

//   const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

//   return (
//     <div className="space-y-8">
//       {/* Grade Selector */}
//       <div className="flex items-center mb-6">
//         <label className="mr-4 text-lg font-semibold">Select Grade:</label>
//         <select
//           value={selectedGrade}
//           onChange={(e) => setSelectedGrade(e.target.value)}
//           className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
//         >
//           {dashboardData.grades.map((grade) => (
//             <option key={grade} value={grade}>
//               {grade}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Summary Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[{ icon: Users, label: 'Total Students', value: dashboardData.stats.totalStudents },
//           { icon: BookOpen, label: 'Lessons Planned', value: dashboardData.stats.lessonsPlanned },
//           { icon: Trophy, label: 'Avg. Performance', value: `${dashboardData.stats.avgPerformance}%` },
//           { icon: Clock, label: 'Total Teaching Hours', value: dashboardData.stats.teachingHours }]
//           .map((stat) => {
//             const Icon = stat.icon;
//             return (
//               <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800">
//                 <div className="flex items-center justify-between mb-4">
//                   <Icon className="h-8 w-8 text-indigo-600" aria-hidden="true" />
//                   <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
//                 </div>
//                 <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
//               </div>
//             );
//           })}
//       </div>

//       {/* Lesson Progress - Pie Chart */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Lesson Progress</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={[
//                 { name: 'Completed', value: gradeData.lessons.completed },
//                 { name: 'Remaining', value: gradeData.lessons.planned - gradeData.lessons.completed }
//               ]}
//               dataKey="value"
//               cx="50%"
//               cy="50%"
//               outerRadius={100}
//               label
//             >
//               {COLORS.map((color, index) => (
//                 <Cell key={`cell-${index}`} fill={color} />
//               ))}
//             </Pie>
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Student Performance - Bar Chart */}
//       <div>
//         <h2 className="text-xl font-semibold mb-4">Student Performance</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={gradeData.studentsPerformance}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="performance" fill="#8884d8" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
