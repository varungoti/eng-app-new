import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Icon } from '@/components/ui/icons';
import type { Lesson } from '../../lib/lessons/types';

interface LessonDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    status: Lesson['status'];
    duration: number;
    subjectId: string;
    teacherId: string;
    classId: string;
    subtopicId: string;
  }) => void;
  initialData?: Lesson | null;
}

const LessonDialog = ({ open, onClose, onSubmit, initialData }: LessonDialogProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    onSubmit({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as Lesson['status'],
      duration: parseInt(formData.get('duration') as string),
      subjectId: formData.get('subjectId') as string,
      teacherId: formData.get('teacherId') as string,
      classId: formData.get('classId') as string,
      subtopicId: formData.get('subtopicId') as string
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon 
              type="phosphor" 
              name={initialData ? "PENCIL_SIMPLE" : "PLUS"} 
              className="h-5 w-5" 
            />
            {initialData ? 'Edit Lesson' : 'Create New Lesson'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={initialData?.description}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="1"
                defaultValue={initialData?.duration}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={initialData?.status || 'scheduled'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Create'} Lesson
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonDialog; 