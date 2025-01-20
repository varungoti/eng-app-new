"use client"

import { useContentStore } from '@/lib/content/store'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icons"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useQuery } from '@tanstack/react-query'
import { contentService } from '@/lib/content/ContentService'
import { LoadingIndicator } from '@/components/LoadingIndicator'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import type { Subtopic, Lesson, Question, Activity } from '../types'

export function ExistingContent() {
  const { toast } = useToast()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'subtopic' | 'lesson' | 'question' | 'activity' } | null>(null)
  
  const { 
    selectedTopic, 
    selectedSubtopic, 
    setSelectedSubtopic,
    selectedLesson,
    setSelectedLesson 
  } = useContentStore()

  const { data: subtopics, isLoading: subtopicsLoading } = useQuery<Subtopic[]>({
    queryKey: ['subtopics', selectedTopic],
    queryFn: () => selectedTopic ? contentService.fetchSubtopics(selectedTopic) : Promise.resolve([]),
    enabled: !!selectedTopic
  })

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ['lessons', selectedSubtopic],
    queryFn: () => selectedSubtopic ? contentService.fetchLessons(selectedSubtopic) : Promise.resolve([]),
    enabled: !!selectedSubtopic
  })

  const { data: questions = [], isLoading: questionsLoading } = useQuery<Question[]>({
    queryKey: ['questions', selectedLesson],
    queryFn: () => selectedLesson ? contentService.fetchQuestions(selectedLesson) : Promise.resolve([]),
    enabled: !!selectedLesson
  })

  const { data: activities = [], isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ['activities', selectedLesson],
    queryFn: () => selectedLesson ? contentService.fetchActivities(selectedLesson) : Promise.resolve([]),
    enabled: !!selectedLesson
  })

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      switch (itemToDelete.type) {
        case 'subtopic':
          await contentService.deleteSubtopic(itemToDelete.id);
          setSelectedSubtopic('');
          break;
        case 'lesson':
          await contentService.deleteLesson(itemToDelete.id);
          setSelectedLesson('');
          break;
        case 'question':
          await contentService.deleteQuestion(itemToDelete.id);
          break;
        case 'activity':
          await contentService.deleteActivity(itemToDelete.id);
          break;
      }
      toast({ 
        title: 'Success', 
        description: `${itemToDelete.type} deleted successfully` 
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete item',
        variant: 'destructive'
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const confirmDelete = (id: string, type: 'subtopic' | 'lesson' | 'question' | 'activity') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  if (!selectedTopic) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Icon type="phosphor" name="FOLDER_PLUS" className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Topic Selected</h3>
          <p className="mt-2 text-sm text-muted-foreground">Select a topic from the sidebar to view its content</p>
        </div>
      </div>
    )
  }

  if (subtopicsLoading) {
    return <LoadingIndicator />
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="p-6">
          <Tabs defaultValue="subtopics" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="subtopics">Subtopics</TabsTrigger>
              {selectedSubtopic && <TabsTrigger value="lessons">Lessons</TabsTrigger>}
              {selectedLesson && <TabsTrigger value="content">Content</TabsTrigger>}
            </TabsList>

            <TabsContent value="subtopics" className="mt-6">
              <div className="grid gap-4">
                {subtopics?.map((subtopic) => (
                  <Card key={subtopic.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{subtopic.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {subtopic.lessons?.length || 0} lessons
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedSubtopic(subtopic.id || '')}
                        >
                          <Icon type="phosphor" name="FOLDER_PLUS" className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => confirmDelete(subtopic.id || '', 'subtopic')}
                        >
                          <Icon type="phosphor" name="TRASH_SIMPLE" className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="lessons">
              {lessonsLoading ? (
                <LoadingIndicator />
              ) : (
                <div className="grid gap-4 mt-4">
                  {lessons?.map((lesson) => (
                    <Card key={lesson.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{lesson.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {lesson.questions?.length || 0} questions, {lesson.activities?.length || 0} activities
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedLesson(lesson.id || '')}
                          >
                            <Icon type="phosphor" name="PENCIL_SIMPLE" className="mr-2 h-3 w-3" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => confirmDelete(lesson.id || '', 'lesson')}
                          >
                            <Icon type="phosphor" name="TRASH_SIMPLE" className="mr-2 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="content">
              {(questionsLoading || activitiesLoading) ? (
                <LoadingIndicator />
              ) : (
                <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Questions</h3>
                    <div className="grid gap-4">
                      {questions?.map((question) => (
                        <Card key={question.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <p>{question.text}</p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Icon type="phosphor" name="PENCIL_SIMPLE" className="mr-2 h-3 w-3" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                <Icon type="phosphor" name="TRASH_SIMPLE" className="mr-2 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Activities</h3>
                    <div className="grid gap-4">
                      {activities?.map((activity) => (
                        <Card key={activity.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{activity.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{activity.type}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Icon type="phosphor" name="PENCIL_SIMPLE" className="mr-2 h-3 w-3" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                <Icon type="phosphor" name="TRASH_SIMPLE" className="mr-2 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the {itemToDelete?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 