import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/useToast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import ContentSelectionDropdowns from './content/ContentSelectionDropdowns';
import type { Grade, Topic, SubTopic, Lesson } from '../types';

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  grades?: Grade[];
  topics?: Topic[];
  subTopics?: SubTopic[];
  lessons?: Lesson[];
  selectedGrade?: string;
  selectedTopic?: string;
  selectedSubTopic?: string;
  selectedLesson?: string;
  onGradeSelect?: (gradeId: string) => void;
  onTopicSelect?: (topicId: string) => void;
  onSubTopicSelect?: (subTopicId: string) => void;
  onLessonSelect?: (lessonId: string) => void;
  onAddTopic?: () => void;
  onAddSubTopic?: () => void;
  onAddLesson?: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
}

const AddContentDialog: React.FC<AddContentDialogProps> = ({
  open,
  onOpenChange,
  title,
  grades,
  topics,
  subTopics,
  lessons,
  selectedGrade,
  selectedTopic,
  selectedSubTopic,
  selectedLesson,
  onGradeSelect,
  onTopicSelect,
  onSubTopicSelect,
  onLessonSelect,
  onAddTopic,
  onAddSubTopic,
  onAddLesson,
  onSubmit,
}) => {
  const { showToast } = useToast();
  const { data: gradesData = [] } = useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('level');
      
      if (error) throw error;
      return data || [];
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!selectedGrade) {
      showToast('Please select a grade first', { type: 'warning' });
      return;
    }
    
    onSubmit({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    });
  };

  const isGradeSelected = !!selectedGrade;
  const isTopicSelected = !!selectedTopic;
  const isSubTopicSelected = !!selectedSubTopic;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details below to create new content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Content Selection Dropdowns */}
          <ContentSelectionDropdowns
            grades={gradesData}
            topics={topics}
            subTopics={subTopics}
            lessons={lessons}
            selectedGrade={selectedGrade}
            selectedTopic={selectedTopic}
            selectedSubTopic={selectedSubTopic}
            selectedLesson={selectedLesson}
            onGradeSelect={onGradeSelect || (() => {})}
            onTopicSelect={onTopicSelect || (() => {})}
            onSubTopicSelect={onSubTopicSelect || (() => {})}
            onLessonSelect={onLessonSelect || (() => {})}
            onAddTopic={onAddTopic}
            onAddSubTopic={onAddSubTopic}
            onAddLesson={onAddLesson}
          />

          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className={`block text-sm font-medium ${!isGradeSelected ? 'text-gray-400' : 'text-gray-700'}`}
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${
                !isGradeSelected 
                  ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
              }`}
              placeholder="Enter title"
              disabled={!isGradeSelected}
            />
          </div>

          {/* Description Input */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter description"
            />
          </div>

          {/* Dialog Footer */}
          <DialogFooter>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContentDialog;