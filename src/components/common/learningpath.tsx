'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Lock, Unlock } from 'lucide-react'
import Link from 'next/link'

export function LearningPath() {
  const [lessons, setLessons] = useState([
    { id: 1, title: "Lesson 1", color: "bg-blue-500", unlocked: true, completed: false, subLessons: [
      { id: 1, title: "Pratice lesson", unlocked: true, completed: true },
      { id: 2, title: "Vocabulary", unlocked: true, completed: false },
      { id: 3, title: "Exam", unlocked: false, completed: false },
    ]},
    { id: 2, title: "Lesson 2", color: "bg-green-500", unlocked: false, completed: false, subLessons: [
      { id: 4, title: "Colors", unlocked: false, completed: false },
      { id: 5, title: "Family Members", unlocked: false, completed: false },
    ]},
    { id: 3, title: "Lesson 3", color: "bg-purple-500", unlocked: false, completed: false, subLessons: [
      { id: 6, title: "Advanced Grammar", unlocked: false, completed: false },
      { id: 7, title: "Idiomatic Expressions", unlocked: false, completed: false },
    ]},
    { id: 1, title: "Lesson 1", color: "bg-blue-500", unlocked: true, completed: false, subLessons: [
      { id: 1, title: "Pratice lesson", unlocked: true, completed: true },
      { id: 2, title: "Vocabulary", unlocked: true, completed: false },
      { id: 3, title: "Exam", unlocked: false, completed: false },
    ]},
    { id: 2, title: "Lesson 2", color: "bg-green-500", unlocked: false, completed: false, subLessons: [
      { id: 4, title: "Colors", unlocked: false, completed: false },
      { id: 5, title: "Family Members", unlocked: false, completed: false },
    ]},
    { id: 3, title: "Lesson 3", color: "bg-purple-500", unlocked: false, completed: false, subLessons: [
      { id: 6, title: "Advanced Grammar", unlocked: false, completed: false },
      { id: 7, title: "Idiomatic Expressions", unlocked: false, completed: false },
    ]},
    { id: 1, title: "Lesson 1", color: "bg-blue-500", unlocked: true, completed: false, subLessons: [
      { id: 1, title: "Pratice lesson", unlocked: true, completed: true },
      { id: 2, title: "Vocabulary", unlocked: true, completed: false },
      { id: 3, title: "Exam", unlocked: false, completed: false },
    ]},
    { id: 2, title: "Lesson 2", color: "bg-green-500", unlocked: false, completed: false, subLessons: [
      { id: 4, title: "Colors", unlocked: false, completed: false },
      { id: 5, title: "Family Members", unlocked: false, completed: false },
    ]},
    { id: 3, title: "Lesson 3", color: "bg-purple-500", unlocked: false, completed: false, subLessons: [
      { id: 6, title: "Advanced Grammar", unlocked: false, completed: false },
      { id: 7, title: "Idiomatic Expressions", unlocked: false, completed: false },
    ]},
  ])

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Learning Path</h1>
      <div className="space-y-8">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="space-y-4 mb-8">
            <Card className={`${lesson.color} text-white rounded-3xl`}>
              <CardHeader>
                <CardTitle className='text-2xl'>{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={lesson.completed ? 100 : 0} className="w-full bg-white/30"  />
              </CardContent>
            </Card>
            <div className="flex flex-col gap-4">
              {lesson.subLessons.map((subLesson) => (
                <Link href={`/lesson/${subLesson.id}`} key={subLesson.id}>
                  <Card className={`mx-4 border border-gray-200 dark:border-gray-800  rounded-3xl bg-white dark:bg-gray-900 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${subLesson.unlocked ? '' : 'opacity-50'}`}>
                    <CardHeader className="pb-0">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <span className='text-xl'>{subLesson.title}</span>
                        {subLesson.unlocked ? <Unlock className="h-5 w-5 text-green-500" /> : <Lock className="h-5 w-5" />}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative">
                      <Progress value={subLesson.completed ? 100 : 0} className="w-full absolute bottom-0 -ml-6" />
                      <p className="mt-2 text-sm text-gray-600">
                        {subLesson.completed ? "Completed" : subLesson.unlocked ? "Ready to start" : "Locked"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">Estimated time: 15 minutes</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}