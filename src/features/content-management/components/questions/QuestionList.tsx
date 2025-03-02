import { ChevronDown, ChevronRight, Plus, Save, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuestionTypeSelect } from './QuestionTypeSelect';
import { QuestionForm } from './QuestionForm';
import { Question, SaveStatus } from '../../api/types';
import { QUESTION_TYPES } from '../../utils/constants';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

interface QuestionListProps {
  questions: Question[];
  selectedQuestionType: string;
  questionSaveStatuses: SaveStatus[];
  expandedQuestion: number | null;
  onQuestionTypeChange: (type: string) => void;
  onAddQuestion: () => void;
  onUpdateQuestion: (index: number, question: Question) => void;
  onRemoveQuestion: (index: number) => void;
  onSaveQuestion: (question: Question, index: number) => void;
  onExpandQuestion: (index: number | null) => void;
}

export const QuestionList = ({
  questions,
  selectedQuestionType,
  questionSaveStatuses,
  expandedQuestion,
  onQuestionTypeChange,
  onAddQuestion,
  onUpdateQuestion,
  onRemoveQuestion,
  onSaveQuestion,
  onExpandQuestion,
}: QuestionListProps) => {
  const [hoveredQuestion, setHoveredQuestion] = useState<number | null>(null);

  return (
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="space-y-6 px-1">
        <CardHeader className="px-0 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Questions
              </h3>
              <CardDescription className="mt-1">
                Add and manage questions for this lesson. Each question can have multiple exercise prompts and follow-up questions.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="w-full sm:w-[200px]">
                <QuestionTypeSelect 
                  value={selectedQuestionType} 
                  onChange={onQuestionTypeChange}
                />
              </div>
              <Button
                onClick={onAddQuestion}
                disabled={!selectedQuestionType}
                className={cn(
                  "transition-all duration-200",
                  "hover:shadow-md",
                  "group",
                  !selectedQuestionType && "opacity-50"
                )}
              >
                <Plus className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                Add Question
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Questions List */}
        <div className="grid gap-4">
          {questions.map((question, index) => (
            <Card 
              key={question.id} 
              className={cn(
                "relative border-l-4 transition-all duration-200",
                expandedQuestion === index 
                  ? "border-l-primary shadow-lg scale-[1.01] bg-card" 
                  : "border-l-primary/40 hover:border-l-primary hover:shadow-md hover:scale-[1.005] bg-card/50",
                "animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
              onMouseEnter={() => setHoveredQuestion(index)}
              onMouseLeave={() => setHoveredQuestion(null)}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={cn(
                        "px-2 py-1 bg-primary/10 rounded-md",
                        "text-sm font-semibold text-primary",
                        "transition-all duration-200",
                        hoveredQuestion === index && "bg-primary/20"
                      )}>
                        Question {index + 1}
                      </div>
                      <Badge variant="outline" className={cn(
                        "whitespace-nowrap capitalize",
                        "transition-all duration-200",
                        hoveredQuestion === index && "bg-primary/5 border-primary/30"
                      )}>
                        {QUESTION_TYPES[question.type]?.label || question.type}
                      </Badge>
                      {question.isDraft && (
                        <Badge variant="secondary" className="whitespace-nowrap animate-fade-in">
                          Draft
                        </Badge>
                      )}
                      {questionSaveStatuses.find(s => s.id === question.id)?.status === 'saved' && (
                        <Badge variant="success" className="animate-fade-in">Saved</Badge>
                      )}
                    </div>
                    {expandedQuestion !== index && (
                      <div className="text-sm text-muted-foreground truncate mt-2 sm:mt-0">
                        {question.title || 'No question text'}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onExpandQuestion(expandedQuestion === index ? null : index)}
                            className={cn(
                              "transition-all duration-200",
                              "hover:bg-primary/10",
                              "group"
                            )}
                          >
                            {expandedQuestion === index ? (
                              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                            ) : (
                              <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {expandedQuestion === index ? 'Collapse' : 'Expand'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveQuestion(index)}
                            className={cn(
                              "transition-all duration-200",
                              "hover:bg-destructive/10",
                              "group"
                            )}
                          >
                            <Trash2 className="h-4 w-4 text-destructive transition-transform duration-200 group-hover:scale-110" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete question</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>

              {expandedQuestion === index && (
                <CardContent className="animate-fade-in">
                  <QuestionForm
                    question={question}
                    index={index}
                    onUpdate={(updatedQuestion) => onUpdateQuestion(index, updatedQuestion)}
                  />
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => onSaveQuestion(question, index)}
                            disabled={questionSaveStatuses.find(s => s.id === question.id)?.status === 'saving'}
                            className={cn(
                              "transition-all duration-200",
                              "hover:bg-primary hover:text-primary-foreground",
                              "group"
                            )}
                          >
                            {questionSaveStatuses.find(s => s.id === question.id)?.status === 'saving' ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2" />
                            ) : (
                              <Save className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                            )}
                            Save Question
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {`Status: ${questionSaveStatuses.find(s => s.id === question.id)?.status || 'draft'}`}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Badge variant={
                      questionSaveStatuses.find(s => s.id === question.id)?.status === 'saved'
                        ? 'success'
                        : questionSaveStatuses.find(s => s.id === question.id)?.status === 'error'
                          ? 'destructive'
                          : 'default'
                    } className="animate-fade-in">
                      {questionSaveStatuses.find(s => s.id === question.id)?.status || 'draft'}
                    </Badge>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {questions.length === 0 && (
          <div className={cn(
            "text-center py-12 px-4 rounded-lg",
            "border-2 border-dashed border-primary/20",
            "bg-card/50",
            "animate-fade-in-up",
            "transition-all duration-200",
            "hover:border-primary/30 hover:bg-card/80"
          )}>
            <div className="max-w-sm mx-auto space-y-3">
              <h3 className="text-lg font-semibold text-primary">No questions yet</h3>
              <p className="text-sm text-muted-foreground">
                Get started by selecting a question type and clicking 'Add Question'.
              </p>
              <Button
                onClick={onAddQuestion}
                disabled={!selectedQuestionType}
                className={cn(
                  "mt-4 transition-all duration-200",
                  "hover:shadow-md",
                  "group",
                  !selectedQuestionType && "opacity-50"
                )}
              >
                <Plus className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                Add Your First Question
              </Button>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}; 