'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/lib/content/ContentService';
import { CreateQuestionDialog } from './CreateQuestionDialog';
import type { Question } from '@/types';
import { Badge } from '@/components/ui/badge';

interface QuestionManagerProps {
  lessonId: string;
}

export function QuestionManager({ lessonId }: QuestionManagerProps) {
  const [isCreateQuestionOpen, setIsCreateQuestionOpen] = React.useState(false);

  const { data: questions } = useQuery({
    queryKey: ['questions', lessonId],
    queryFn: () => contentService.fetchQuestions(lessonId),
    enabled: !!lessonId
  });

  const handleEditQuestion = (questionId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit question:', questionId);
  };

  const handleDeleteQuestion = (questionId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete question:', questionId);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Questions</h2>
        <Button onClick={() => setIsCreateQuestionOpen(true)}>
          <Icon type="phosphor" name="PLUS" className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      <div className="grid gap-4">
        {questions?.map((question: Question) => (
          <Card key={question.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{question.type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {question.points} points
                  </span>
                </div>
                <p className="text-sm">{question.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleEditQuestion(question.id)}
                >
                  <Icon type="phosphor" name="PENCIL_SIMPLE" className="h-4 w-4" />
                  <span className="sr-only">Edit question</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm" 
                  className="h-8 w-8 p-0 text-destructive"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <Icon type="phosphor" name="TRASH_SIMPLE" className="h-4 w-4" />
                  <span className="sr-only">Delete question</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CreateQuestionDialog
        open={isCreateQuestionOpen}
        onOpenChange={setIsCreateQuestionOpen}
        lessonId={lessonId}
      />
    </div>
  );
} 