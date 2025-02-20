"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown, ChevronRight, X, Check, Loader2  } from 'lucide-react';
import { QuestionFormProps } from '../types';
import { ExercisePromptCard } from './exercise-prompt-card_bak';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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

  const handleFieldChange = async (field: string, value: string) => {
    setIsSaving(true);
    setLastSaved(null);
    try {
      await onUpdate(index, {
        ...question,
        data: { ...question.data, [field]: value } as { prompt: string; teacherScript: string; sampleAnswer?: string },
        metadata: { ...question.metadata, [field]: value } as { sampleAnswer?: string },
      });
      setLastSaved('success');
    } catch (error) {
      setLastSaved('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setLastSaved(null), 2000);
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
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                      {lastSaved === 'success' && <Check className="h-4 w-4 text-green-500" />}
                      {lastSaved === 'error' && <X className="h-4 w-4 text-destructive" />}
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
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                      {lastSaved === 'success' && <Check className="h-4 w-4 text-green-500" />}
                      {lastSaved === 'error' && <X className="h-4 w-4 text-destructive" />}
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
                        {isSaving && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                        {lastSaved === 'success' && <Check className="h-4 w-4 text-green-500" />}
                        {lastSaved === 'error' && <X className="h-4 w-4 text-destructive" />}
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