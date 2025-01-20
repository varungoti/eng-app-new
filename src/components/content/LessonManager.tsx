"use client";

import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Icon } from '@/components/ui/icons';
import type { Lesson } from '../../lib/lessons/types';
import LessonDialog from './LessonDialog';
import { useToast } from '../../hooks/useToast';
import { useLessons } from '../../hooks/useLessons';
import { useMutation } from 'react-query';
import { contentService } from '@/lib/content/ContentService';

interface LessonManagerProps {
  lessonId: string;
}

interface LessonFormData {
  title: string;
  subtopicId: string;
}

export default function LessonManager({ lessonId }: LessonManagerProps) {
  const { data: lessons, isLoading, error } = useLessons();
  const { mutate: createLesson } = useMutation({
    mutationFn: (data: { title: string; subtopicId: string }) => 
      contentService.createLesson(data)
  });
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingLesson, setEditingLesson] = React.useState<Lesson | null>(null);
  const { showToast } = useToast();

  const handleCreateLesson = async (data: LessonFormData) => {
    try {
      await createLesson(data);
      setIsDialogOpen(false);
      showToast({
        title: 'Success',
        description: 'Lesson created successfully',
      });
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to create lesson',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading lessons</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Lesson Management</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Icon type="phosphor" name="PLUS" className="h-4 w-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons?.map((lesson: Partial<Lesson>) => (
          <Card key={lesson.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{lesson.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingLesson(lesson as Lesson)}
                >
                  <Icon type="phosphor" name="PENCIL_SIMPLE" className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => {
                    // TODO: Implement delete
                  }}
                >
                  <Icon type="phosphor" name="TRASH_SIMPLE" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm">{lesson.duration} mins</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                lesson.status === 'completed' ? 'bg-green-100 text-green-800' :
                lesson.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {lesson.status}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <LessonDialog
        open={isDialogOpen || !!editingLesson}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingLesson(null);
        }}
        onSubmit={handleCreateLesson}
        initialData={editingLesson}
      />
    </div>
  );
} 