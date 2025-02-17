"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { useContentStore } from '@/lib/content/store';
import { useContentHierarchy } from './content-hierarchy';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { contentService } from '@/lib/content/ContentService';
import { useToast } from '@/hooks/use-toast';
import type { Topic, Subtopic, Lesson } from '@/types/content';
import { CreateQuestionDialog } from './CreateQuestionDialog';
import { CreateActivityDialog } from '@/app/content-management/components/CreateActivityDialog';
import { useQueryClient } from '@tanstack/react-query';

interface ContentItem {
  id: string;
  title: string;
  description?: string;
}

export function ContentDisplay() {
  const { 
    selectedTopic,
    selectedSubtopic,
    selectedLesson,
  } = useContentStore();
  
  const { topics = [], subtopics = [], lessons = [], isLoading } = useContentHierarchy() as { 
    topics: Topic[]; 
    subtopics: Subtopic[]; 
    lessons: Lesson[]; 
    isLoading: boolean 
  };
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = React.useState(false);
  const [lessonContent, setLessonContent] = React.useState('');
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = React.useState(false);
  const [isActivityDialogOpen, setIsActivityDialogOpen] = React.useState(false);
  
  // Get current lesson
  const currentLesson = React.useMemo(() => 
    lessons.find((l: Lesson) => l.id === selectedLesson),
    [lessons, selectedLesson]
  );

  // Initialize lesson content when lesson changes
  React.useEffect(() => {
    if (currentLesson?.content) {
      setLessonContent(currentLesson.content);
    }
  }, [currentLesson]);

  // Handle saving lesson content
  const handleSaveContent = async () => {
    if (!selectedLesson) return;

    try {
      await contentService.updateLesson({
        id: selectedLesson,
        content: lessonContent,
      });

      toast({
        title: "Success",
        description: "Lesson content saved successfully",
      });

      setIsEditing(false);
      // Refetch lessons
      await contentService.fetchLessons(selectedSubtopic || '');
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save lesson content",
      });
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setLessonContent(currentLesson?.content || '');
    setIsEditing(false);
  };

  // Render different content based on selection
  if (selectedLesson) {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          {/* Lesson Title Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{currentLesson?.title || 'Untitled Lesson'}</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Icon type="phosphor" name="PENCIL_SIMPLE" className="mr-2 h-4 w-4" />
              Edit Lesson Content
            </Button>
          </div>

          {/* Lesson Content Section */}
          {isEditing ? (
            <RichTextEditor
              value={lessonContent}
              onChange={setLessonContent}
              onSave={handleSaveContent}
              onCancel={handleCancelEdit}
            />
          ) : currentLesson?.content ? (
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: currentLesson.content }} 
            />
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Icon type="phosphor" name="PLUS" className="mr-2 h-4 w-4" />
              Add Lesson Content
            </Button>
          )}

          {/* Questions and Activities Tabs */}
          <Tabs defaultValue="questions" className="w-full">
            <TabsList>
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="questions" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Questions</h3>
                <Button onClick={() => setIsQuestionDialogOpen(true)}>
                  <Icon type="phosphor" name="PLUS" className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
              {/* Questions list */}
              <CreateQuestionDialog 
                open={isQuestionDialogOpen}
                onOpenChange={setIsQuestionDialogOpen}
                lessonId={selectedLesson || ''}
              />
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Activities</h3>
                <Button onClick={() => setIsActivityDialogOpen(true)}>
                  <Icon type="phosphor" name="PLUS" className="mr-2 h-4 w-4" />
                  Add Activity
                </Button>
              </div>
              {/* Activities list */}
              <CreateActivityDialog 
                open={isActivityDialogOpen}
                onOpenChange={setIsActivityDialogOpen}
                lessonId={selectedLesson || ''}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    );
  }

  if (selectedSubtopic) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Lessons</h2>
            <Button>
              <Icon type="phosphor" name="PLUS" className="mr-2 h-4 w-4" />
              Add Lesson
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <AnimatePresence mode="wait">
              {lessons?.map((lesson: Lesson) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 border rounded-lg mb-4 hover:bg-accent/50 transition-colors"
                >
                  <h3 className="font-medium">{lesson.title}</h3>
                  {lesson.description && (
                    <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </Card>
    );
  }

  if (selectedTopic) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Subtopics</h2>
            <Button>
              <Icon type="phosphor" name="PLUS" className="mr-2 h-4 w-4" />
              Add Subtopic
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <AnimatePresence mode="wait">
              {subtopics?.map((subtopic: Subtopic) => (
                <motion.div
                  key={subtopic.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 border rounded-lg mb-4 hover:bg-accent/50 transition-colors"
                >
                  <h3 className="font-medium">{subtopic.title}</h3>
                  {subtopic.description && (
                    <p className="text-sm text-muted-foreground mt-1">{subtopic.description}</p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Topics</h2>
          <Button>
            <Icon type="phosphor" name="PLUS" className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-16rem)]">
          <AnimatePresence mode="wait">
            {topics?.map((topic: Topic) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 border rounded-lg mb-4 hover:bg-accent/50 transition-colors"
              >
                <h3 className="font-medium">{topic.title}</h3>
                {topic.description && (
                  <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </Card>
  );
} 