"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';
import { Plus, Trash as Trash2, ChevronDown, ChevronRight, X, Check, Loader } from 'lucide-react';
import { QuestionFormProps } from '../types';
import { ExercisePromptCard } from './exercise-prompt-card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icons';
import { ImageIcon } from 'lucide-react';
import { Question, QuestionType } from "@/app/content-management/types";
import { QUESTION_TYPES } from "@/app/content-management/constants";
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from '@/components/ui/select';

export function QuestionForm({
  question,
  index,
  onUpdate,
  onRemove,
  onAddExercisePrompt,
  onRemoveExercisePrompt,
  onExercisePromptChange
}: QuestionFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<'success' | 'error' | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleFieldChange = async (field: string, value: string) => {
    setIsSaving(true);
    setLastSaved(null);
    try {
      await onUpdate(index, {
        ...question,
        data: { ...question.data, [field]: value } as any
      });
      if (mounted.current) {
        setLastSaved('success');
      }
    } catch (error) {
      if (mounted.current) {
        setLastSaved('error');
        logger.error('Failed to update question field', {
          context: { error, field, index },
          source: 'QuestionForm'
        });
      }
    } finally {
      if (mounted.current) {
        setIsSaving(false);
        setTimeout(() => {
          if (mounted.current) {
            setLastSaved(null);
          }
        }, 2000);
      }
    }
  };

  const handleMetadataChange = (field: string, value: any) => {
    onUpdate(index, {
      ...question,
      metadata: {
        ...question.metadata,
        [field]: value
      }
    });
  };

  const handleQuestionTypeChange = (type: string, defaultData: any) => {
    const updatedQuestion: Question = {
      ...question,
      data: {
        ...defaultData,
        prompt: question.data?.prompt || '',
        teacherScript: question.data?.teacherScript || '',
        sampleAnswer: question.data?.sampleAnswer || ''
      }
    };
    onUpdate(index, updatedQuestion);
  };

  const renderQuestionFields = () => {
    switch (question.type) {
      case 'speaking':
        return (
          <>
            <div className="space-y-2">
              <Label>Sample Answer</Label>
              <Textarea
                value={question.metadata.sampleAnswer || ''}
                onChange={(e) => handleMetadataChange('sampleAnswer', e.target.value)}
              />
            </div>
          </>
        );
      case 'multipleChoice':
        return (
          <>
            <div className="space-y-2">
              <Label>Options</Label>
              {question.metadata.options?.map((option: string, index: number) => (
                <Input
                  key={index}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(question.metadata.options || [])];
                    newOptions[index] = e.target.value;
                    handleMetadataChange('options', newOptions);
                  }}
                />
              ))}
              <button onClick={() => handleMetadataChange('options', [...(question.metadata.options || []), ''])}>
                Add Option
              </button>
            </div>
          </>
        );
      case 'matching':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Items to Match</Label>
                {question.metadata?.items?.map((item: string, idx: number) => (
                  <Input
                    key={`item-${idx}`}
                    value={item}
                    onChange={(e) => {
                      const newItems = [...(question.metadata?.items || [])];
                      newItems[idx] = e.target.value;
                      handleMetadataChange('items', newItems);
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMetadataChange('items', [...(question.metadata?.items || []), ''])}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </>
        );

      case 'fillInTheBlank':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Sentence with Blanks</Label>
                <Textarea
                  value={question.metadata?.sentence || ''}
                  onChange={(e) => handleMetadataChange('sentence', e.target.value)}
                  placeholder="Enter sentence with ___ for blanks"
                />
              </div>
              <div className="space-y-2">
                <Label>Correct Answers</Label>
                {question.metadata?.blanks?.map((blank: string, idx: number) => (
                  <Input
                    key={`blank-${idx}`}
                    value={blank}
                    onChange={(e) => {
                      const newBlanks = [...(question.metadata?.blanks || [])];
                      newBlanks[idx] = e.target.value;
                      handleMetadataChange('blanks', newBlanks);
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMetadataChange('blanks', [...(question.metadata?.blanks || []), ''])}
                >
                  Add Answer
                </Button>
              </div>
            </div>
          </>
        );

      case 'trueOrFalse':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Statement</Label>
                <Textarea
                  value={question.metadata?.statement || ''}
                  onChange={(e) => handleMetadataChange('statement', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Correct Answer</Label>
                <div className="flex gap-4">
                  <Button
                    variant={question.metadata?.correctAnswer === 'true' ? 'default' : 'outline'}
                    onClick={() => handleMetadataChange('correctAnswer', 'true')}
                  >
                    True
                  </Button>
                  <Button
                    variant={question.metadata?.correctAnswer === 'false' ? 'default' : 'outline'}
                    onClick={() => handleMetadataChange('correctAnswer', 'false')}
                  >
                    False
                  </Button>
                </div>
              </div>
            </div>
          </>
        );

      case 'reading':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Reading Passage</Label>
                <Textarea
                  value={question.metadata?.passage || ''}
                  onChange={(e) => handleMetadataChange('passage', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Comprehension Questions</Label>
                {question.metadata?.questions?.map((q: string, idx: number) => (
                  <Input
                    key={`question-${idx}`}
                    value={q}
                    onChange={(e) => {
                      const newQuestions = [...(question.metadata?.questions || [])];
                      newQuestions[idx] = e.target.value;
                      handleMetadataChange('questions', newQuestions);
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMetadataChange('questions', [...(question.metadata?.questions || []), ''])}
                >
                  Add Question
                </Button>
              </div>
            </div>
          </>
        );

      case 'writing':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Writing Prompt</Label>
                <Textarea
                  value={question.metadata?.response || ''}
                  onChange={(e) => handleMetadataChange('response', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'speakingAndWriting':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Speaking Prompt</Label>
                <Textarea
                  value={question.metadata?.speakingPrompt || ''}
                  onChange={(e) => handleMetadataChange('speakingPrompt', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Writing Prompt</Label>
                <Textarea
                  value={question.metadata?.writingPrompt || ''}
                  onChange={(e) => handleMetadataChange('writingPrompt', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'speakingAndListening':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Speaking Prompt</Label>
                <Textarea
                  value={question.metadata?.speakingPrompt || ''}
                  onChange={(e) => handleMetadataChange('speakingPrompt', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Listening Prompt</Label>
                <Textarea
                  value={question.metadata?.listeningPrompt || ''}
                  onChange={(e) => handleMetadataChange('listeningPrompt', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'readingAndSpeaking':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Speaking Prompt</Label>
                <Textarea
                  value={question.metadata?.speakingPrompt || ''}
                  onChange={(e) => handleMetadataChange('speakingPrompt', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Reading Prompt</Label>
                <Textarea
                  value={question.metadata?.readingPrompt || ''}
                  onChange={(e) => handleMetadataChange('readingPrompt', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'speakingAndSpeaking':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>First Speaking Prompt</Label>
                <Textarea
                  value={question.metadata?.speakingPrompt || ''}
                  onChange={(e) => handleMetadataChange('speakingPrompt', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Second Speaking Prompt</Label>
                <Textarea
                  value={question.metadata?.speakingPrompt2 || ''}
                  onChange={(e) => handleMetadataChange('speakingPrompt2', e.target.value)}
                />
              </div>
            </div>
          </>
        );
      case 'speaking':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Sample Answer</Label>
                <Textarea
                  value={question.metadata?.sampleAnswer || ''}
                  onChange={(e) => handleMetadataChange('sampleAnswer', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case 'multipleChoice':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Options</Label>
                {question.metadata?.options?.map((option: string, idx: number) => (
                  <Input
                    key={`option-${idx}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.metadata?.options || [])];
                      newOptions[idx] = e.target.value;
                      handleMetadataChange('options', newOptions);
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMetadataChange('options', [...(question.metadata?.options || []), ''])}
                >
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Correct Answer</Label>
                <Select
                  value={question.metadata?.correctAnswer?.toString() || ''}
                  onValueChange={(value) => handleMetadataChange('correctAnswer', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {question.metadata?.options?.map((_, idx) => (
                      <SelectItem key={idx} value={idx.toString()}>
                        Option {idx + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      

      
    }
  };

  return (
    <Card className={cn(
      "border-l-4 transition-colors duration-200",
      isExpanded ? "border-l-primary" : "border-l-primary/40 hover:border-l-primary"
    )}>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="flex-shrink-0 px-2 py-1 bg-primary/10 rounded-md text-sm font-semibold text-primary">
              Q {index + 1}
            </span>
            <span className="text-sm text-muted-foreground truncate">
              {question.data?.prompt || 'No question text'}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-accent"
            >
              {isExpanded ? 
                <ChevronDown className="h-4 w-4 text-primary" /> : 
                <ChevronRight className="h-4 w-4 text-primary" />
              }
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Question Text</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Icon 
                        type="phosphor"
                        name="SPINNER"
                        className="h-4 w-4 animate-spin text-primary"
                      />}
                      {lastSaved === 'success' && <Icon 
                        type="phosphor"
                        name="CHECK"
                        className="h-4 w-4 text-green-500"
                      />}
                      {lastSaved === 'error' && <Icon 
                        type="phosphor"
                        name="X"
                        className="h-4 w-4 text-destructive"
                      />}
                    </div>
                  </div>
                  <Textarea
                    value={question.data?.prompt || ''}
                    onChange={(e) => handleFieldChange('prompt', e.target.value)}
                    placeholder="Enter the question text"
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Teacher Script (Optional)</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Icon 
                        type="phosphor"
                        name="SPINNER"
                        className="h-4 w-4 animate-spin text-primary"
                      />}
                      {lastSaved === 'success' && <Icon 
                        type="phosphor"
                        name="CHECK"
                        className="h-4 w-4 text-green-500"
                      />}
                      {lastSaved === 'error' && <Icon 
                        type="phosphor"
                        name="X"
                        className="h-4 w-4 text-destructive"
                      />}
                    </div>
                  </div>
                  <Textarea
                    value={question.data?.teacherScript || ''}
                    onChange={(e) => handleFieldChange('teacherScript', e.target.value)}
                    placeholder="Enter the teacher script"
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFieldChange('sampleAnswer', question.data?.sampleAnswer ? '' : 'Sample answer here...')}
                    className="gap-2"
                  >
                    {question.data?.sampleAnswer ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {question.data?.sampleAnswer ? 'Remove Sample Answer' : 'Add Sample Answer'}
                  </Button>
                </div>

                {question.data?.sampleAnswer && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Sample Answer</Label>
                      <div className="flex items-center gap-2">
                        {isSaving && <Icon 
                          type="phosphor"
                          name="SPINNER"
                          className="h-4 w-4 animate-spin text-primary"
                        />}
                        {lastSaved === 'success' && <Icon 
                          type="phosphor"
                          name="CHECK"
                          className="h-4 w-4 text-green-500"
                        />}
                        {lastSaved === 'error' && <Icon 
                          type="phosphor"
                          name="X"
                          className="h-4 w-4 text-destructive"
                        />}
                      </div>
                    </div>
                    <Textarea
                      value={question.data?.sampleAnswer || ''}
                      onChange={(e) => handleFieldChange('sampleAnswer', e.target.value)}
                      placeholder="Enter a sample answer"
                      className="min-h-[100px]"
                    />
                  </div>
                )}

                {/* Exercise Prompts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Exercise Prompts</Label>
                  </div>
                  
                  {question.exercisePrompts.map((prompt, promptIndex) => (
                    <ExercisePromptCard
                      key={promptIndex}
                      prompt={prompt}
                      promptIndex={promptIndex}
                      onUpdate={(updatedPrompt) => onExercisePromptChange(index, promptIndex, updatedPrompt)}
                      onRemove={() => onRemoveExercisePrompt(index, promptIndex)}
                    />
                  ))}
                </div>

                {renderQuestionFields()}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Add Prompt Button */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-8 z-50"
        >
          <Button
            onClick={() => onAddExercisePrompt(index)}
            className="rounded-full shadow-lg gap-2"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Add Prompt
          </Button>
        </motion.div>
      )}
    </Card>
  );
} 