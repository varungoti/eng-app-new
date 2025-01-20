"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '@/lib/content/ContentService';
import { useToast } from '@/hooks/use-toast';

interface CreateSubtopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string;
}

export function CreateSubtopicDialog({ open, onOpenChange, topicId }: CreateSubtopicDialogProps) {
  const [title, setTitle] = React.useState('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: createSubtopic, isLoading } = useMutation({
    mutationFn: async () => {
      return contentService.createSubtopic({
        title,
        topicId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtopics', topicId] });
      toast({
        title: 'Subtopic created successfully',
        description: 'The subtopic has been created and is now available in the content hierarchy.',
        variant: 'default'
      });
      onOpenChange(false);
      setTitle('');
    },
    onError: (error) => {
      toast({
        title: 'Failed to create subtopic',
        description: error instanceof Error ? error.message : 'Failed to create subtopic',
        variant: 'destructive'
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: 'Title is required',
        description: 'Please enter a title for the subtopic.',
        variant: 'destructive'
      });
      return;
    }
    createSubtopic();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon type="phosphor" name="FOLDERS_PLUS" className="h-5 w-5" />
            Create New Subtopic
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium mb-2 block">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter subtopic title"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Subtopic'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 