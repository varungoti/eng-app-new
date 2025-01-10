'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Shield, Trophy } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function SidebarDashboard() {
  const [achievements, setAchievements] = useState([
    { title: "Vocabulary Master", description: "Learn 1000 new words", progress: 65, total: 1000 },
    { title: "Grammar Guru", description: "Complete all grammar lessons", progress: 40, total: 100 },
    { title: "Consistent Learner", description: "Maintain a 30-day streak", progress: 22, total: 30 },
    { title: "Fluent Speaker", description: "Practice speaking for 50 hours", progress: 15, total: 50 },
    { title: "Challenge Champion", description: "Complete 100 daily challenges", progress: 45, total: 100 },
  ])

  const [xpData, setXpData] = useState([
    { name: 'M', xp: 0 },
    { name: 'Tu', xp: 0 },
    { name: 'W', xp: 0 },
    { name: 'Th', xp: 0 },
    { name: 'F', xp: 0 },
    { name: 'Sa', xp: 0 },
    { name: 'Su', xp: 13 },
  ])

  const [dailyGoal, setDailyGoal] = useState(13)
  const [dailyGoalTotal, setDailyGoalTotal] = useState(20)

  const handleTryNow = () => {
    console.log("Navigating to AI Conversation")
    // Add navigation logic here
  }

  const handleEditGoal = () => {
    console.log("Editing daily goal")
    // Add goal editing logic here
  }

  return (
    <div className=" w-full mx-auto space-y-4">
      <Card className='rounded-3xl bg-white dark:bg-gray-900 '>
        <CardHeader>
          <CardTitle>AI Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            AI-based language teaching tool designed to aid users in enhancing their fluency and confidence in speaking
          </p>
          <Button className="w-full" onClick={handleTryNow}>TRY NOW</Button>
        </CardContent>
      </Card>

      <Card className='rounded-3xl bg-white dark:bg-gray-900 '>
        <CardHeader>
          <CardTitle>Your Achievements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{achievement.title}</span>
                <span className="text-sm text-gray-600">{achievement.progress}/{achievement.total}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
              <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className='rounded-3xl bg-white dark:bg-gray-900 '>
        <CardContent className="flex items-center space-x-4 py-4">
          <Shield className="w-12 h-12 text-gray-400" />
          <div>
            <h3 className="font-bold">Unlock Leaderboards!</h3>
            <p className="text-sm text-gray-600">Complete 9 more lessons to start competing</p>
          </div>
        </CardContent>
      </Card>

      <Card className='rounded-3xl bg-white dark:bg-gray-900 '>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">XP Progress</CardTitle>
          <Button variant="ghost" className="h-8 text-xs" onClick={handleEditGoal}>
            EDIT GOAL
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Daily Goal</span>
                <span className="text-sm text-gray-600">{dailyGoal}/{dailyGoalTotal} XP</span>
              </div>
              <Progress value={(dailyGoal / dailyGoalTotal) * 100} className="h-2" />
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={xpData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="xp" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}