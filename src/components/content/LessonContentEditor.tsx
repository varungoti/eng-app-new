"use client"

import React from 'react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "@/components/editor/RichTextEditor"
import { Plus } from "@phosphor-icons/react"
import { useToast } from "@/hooks/use-toast"

interface LessonContentEditorProps {
  lessonId: string
  initialData?: {
    title: string
    content?: string
  }
}

export function LessonContentEditor({ lessonId, initialData }: LessonContentEditorProps) {
  const [title, setTitle] = React.useState(initialData?.title || '')
  const [content, setContent] = React.useState(initialData?.content || '')
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Lesson Content</h2>
        <p className="text-sm text-muted-foreground">
          Edit lesson content
        </p>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Lesson Title</label>
        <Input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter lesson title"
          className="max-w-xl"
        />
      </div>

      {/* Content Editor */}
      <Card className="p-4">
        <Tabs defaultValue="content" className="w-full">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Lesson Content</label>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content Block
                </Button>
              </div>
              <RichTextEditor 
                value={content}
                onChange={setContent}
              />
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Questions</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>
            {/* Question list will go here */}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Activities</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>
            {/* Activity list will go here */}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
} 