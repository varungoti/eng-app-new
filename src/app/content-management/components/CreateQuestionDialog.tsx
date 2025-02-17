"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { contentService } from '@/lib/content/ContentService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Icon } from '@/components/ui/icons';
import { QuestionFormats } from '@/components/formats/Formats';

// Create a type for available formats
type QuestionFormat = keyof typeof QuestionFormats;

// Format options for the select dropdown
const FORMAT_OPTIONS: { value: QuestionFormat; label: string }[] = [
  { value: "SpeakingFormat", label: "Speaking Practice" },
  { value: "DebateFormat", label: "Debate" },
  { value: "GrammarSpeakingFormat", label: "Grammar Speaking" },
  { value: "StorytellingFormat", label: "Storytelling" },
  { value: "ListeningFormat", label: "Listening" },
  { value: "ListenAndRepeatFormat", label: "Listen and Repeat" },
  { value: "MultipleChoiceFormat", label: "Multiple Choice" },
  { value: "PresentationFormat", label: "Presentation" },
  { value: "LookAndSpeakFormat", label: "Look and Speak" },
  { value: "WatchAndSpeakFormat", label: "Watch and Speak" },
  { value: "IdiomPracticeFormat", label: "Idiom Practice" },
];

interface CreateQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessonId: string;
}

export function CreateQuestionDialog({ open, onOpenChange, lessonId }: CreateQuestionDialogProps) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<'multiple_choice' | 'true_false' | 'open_ended'>('multiple_choice');
  const [selectedFormat, setSelectedFormat] = useState<QuestionFormat>("SpeakingFormat");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentService.createQuestion({
        lessonId,
        content,
        type,
      });
      toast({ title: "Success", description: "Question created successfully" });
      onOpenChange(false);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to create question",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Type</label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                <SelectItem value="true_false">True/False</SelectItem>
                <SelectItem value="open_ended">Open Ended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Content</label>
            <Input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter question content"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Question Format</label>
            <Select
              value={selectedFormat}
              onValueChange={(value: QuestionFormat) => setSelectedFormat(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit">Create Question</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 