'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { contentService } from '@/lib/content/ContentService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Icon } from '@/components/ui/icons';

interface CreateLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subtopicId: string;
}

export function CreateLessonDialog({ open, onOpenChange, subtopicId }: CreateLessonDialogProps) {
  const [title, setTitle] = useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isLoading } = useMutation({
    mutationFn: async () => {
      return contentService.createLesson({ title, subtopicId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons', subtopicId] });
      toast({
        title: "Success",
        description: "Lesson created successfully"
      });
      setTitle('');
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create lesson",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }
    mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon type="phosphor" name="BOOK_OPEN" className="h-5 w-5" />
            Create New Lesson
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Lesson title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Lesson'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 