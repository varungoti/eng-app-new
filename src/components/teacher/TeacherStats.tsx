"use client";
import React from "react";
import { Flame, Trophy, Clock, BookOpen, ChevronRight } from "lucide-react";
import { teacherStats } from "@/data/mockData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "../ui/card";

import { Button } from "../ui/button";

// Helper function to convert minutes to hours and minutes
const formatTime = (minutes: number) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hr ${remainingMinutes} min`;
  } else {
    return `${minutes} min`;
  }
};

export default function TeacherStats() {
  const days = ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];

  // Prepare the data for the bar chart
  const classTimeData = Object.entries(teacherStats.callTime.weeklyData).map(
    ([day, minutes]) => ({
      day,
      minutes,
      formattedTime: formatTime(minutes),
    })
  );

  return (
    <div className="grid grid-cols-1 gap-2 mb-8">
      {/* <div className="w-full p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center">
         
        <div className="flex w-full mb-2">
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-800">
              AI Conversation
            </h3>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              AI-based language teaching tool designed to aid users in enhancing
              their fluency and confidence in speaking
            </p>
          </div>
          <img
            src={
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
            }
            alt={""}
            className="w-[150px] h-[120px] rounded-xl object-cover"
          />
        </div>
        <Button className="w-full  transition">TRY NOW</Button>
      </div> */}

      {/* Streak Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Your Streak
        </h3>
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="flex items-center gap-2 w-full justify-between  bg-orange-50 rounded-xl px-2">
            <span className="flex gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Daily Streak:
            </span>
            <span className="text-lg font-semibold">
              {" "}
              {teacherStats.streak.current}
            </span>
          </div>
          <div className="flex items-center gap-2 w-full justify-between  bg-green-50 rounded-xl px-2">
            <span className="flex gap-2">
              <Trophy className="h-5 w-5 text-green-500" />
              Best:
            </span>
            <span className="text-lg font-semibold">
              {" "}
              {teacherStats.streak.best}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center p-2">
          {days.map((day) => (
            <div key={day} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                ${
                  teacherStats.streak.dailyProgress[day]
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Flame className="h-4 w-4" />
              </div>
              <span className="text-xs text-gray-600">{day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Class Time Spent Card with Bar Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Spent time</h3>
        <div className="space-y-4">
          {/* <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <span className="text-gray-600">Total Spent</span>
            </div>
            <span className="font-semibold">{formatTime(teacherStats.callTime.totalSpent)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Daily Average</span>
            <span className="font-semibold">{formatTime(teacherStats.callTime.dailyAverage)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Daily Goal</span>
            <span className="font-semibold">{formatTime(teacherStats.callTime.dailyGoal)}</span>
          </div> */}

          {/* Bar Chart for Weekly Class Time */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => formatTime(value as number)} />
                <Legend />
                <Bar dataKey="minutes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Completed Lessons Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Completed Lessons
        </h3>
        <div className="space-y-3">
          {teacherStats.completedLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div>
                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.duration}min</span>
                  <span>•</span>
                  <BookOpen className="h-4 w-4" />
                  <span>{lesson.students} students</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
