import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { Question, ExercisePrompt } from '../../api/types';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExercisePromptCard } from './ExercisePromptCard';
import { QUESTION_TYPES } from '../../utils/constants';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QuestionFormProps {
  question: Question;
  index: number;
  onUpdate: (updatedQuestion: Question) => void;
  onAddExercisePrompt?: () => void;
  onRemoveExercisePrompt?: (promptIndex: number) => void;
  onExercisePromptChange?: (promptIndex: number, updatedPrompt: ExercisePrompt) => void;
}

export const QuestionForm = ({
  question,
  index,
  onUpdate,
  onAddExercisePrompt,
  onRemoveExercisePrompt,
  onExercisePromptChange,
}: QuestionFormProps) => {
  const [localQuestion, setLocalQuestion] = useState(question);
  const [expandedSection, setExpandedSection] = useState<string | null>('main');
  const [hoveredPrompt, setHoveredPrompt] = useState<number | null>(null);

  const handleChange = useCallback((field: keyof Question['data'], value: any) => {
    const updatedQuestion = {
      ...localQuestion,
      data: {
        ...localQuestion.data,
        [field]: value
      }
    };
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
  }, [localQuestion, onUpdate]);

  const handleExercisePromptUpdate = useCallback((promptIndex: number, updatedPrompt: ExercisePrompt) => {
    const updatedPrompts = [...localQuestion.exercisePrompts];
    updatedPrompts[promptIndex] = updatedPrompt;
    
    const updatedQuestion = {
      ...localQuestion,
      exercisePrompts: updatedPrompts
    };
    
    setLocalQuestion(updatedQuestion);
    onUpdate(updatedQuestion);
    onExercisePromptChange?.(promptIndex, updatedPrompt);
  }, [localQuestion, onUpdate, onExercisePromptChange]);

  const sections = [
    { id: 'main', title: 'Main Content', show: true },
    { id: 'options', title: 'Options', show: localQuestion.type === 'multipleChoice' },
    { id: 'answer', title: 'Sample Answer', show: ['shortAnswer', 'speaking'].includes(localQuestion.type) },
    { id: 'prompts', title: 'Exercise Prompts', show: true }
  ];

  return (
    <ScrollArea className="max-h-[calc(100vh-30rem)]">
      <div className="space-y-6 pr-4">
        {sections.map((section, sectionIndex) => section.show && (
          <Card 
            key={section.id}
            className={cn(
              "border transition-all duration-200",
              "hover:shadow-md",
              "animate-fade-in-up",
              expandedSection === section.id && "border-primary/20 shadow-md"
            )}
            style={{ animationDelay: `${sectionIndex * 100}ms` }}
          >
            <div 
              className={cn(
                "flex items-center justify-between p-4 cursor-pointer",
                "transition-colors duration-200",
                "hover:bg-accent/50",
                "group"
              )}
              onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
            >
              <h3 className={cn(
                "text-lg font-semibold",
                "transition-colors duration-200",
                expandedSection === section.id && "text-primary"
              )}>
                {section.title}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="transition-transform duration-200 group-hover:scale-110"
              >
                {expandedSection === section.id ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>

            {expandedSection === section.id && (
              <CardContent className="animate-fade-in">
                {section.id === 'main' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Question Title</Label>
                      <Textarea
                        value={localQuestion.title}
                        onChange={(e) => {
                          const updatedQuestion = { ...localQuestion, title: e.target.value };
                          setLocalQuestion(updatedQuestion);
                          onUpdate(updatedQuestion);
                        }}
                        placeholder="Enter question title..."
                        className="min-h-[60px] transition-all duration-200 focus:scale-[1.01]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Question Prompt</Label>
                      <RichTextEditor
                        value={localQuestion.data.prompt}
                        onChange={(value) => handleChange('prompt', value)}
                        placeholder="Enter the question prompt..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Teacher Script</Label>
                      <Textarea
                        value={localQuestion.data.teacher_script}
                        onChange={(e) => handleChange('teacher_script', e.target.value)}
                        placeholder="Enter instructions for the teacher..."
                        className="min-h-[100px] transition-all duration-200 focus:scale-[1.01]"
                      />
                    </div>
                  </div>
                )}

                {section.id === 'options' && localQuestion.type === 'multipleChoice' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Options</Label>
                      {(localQuestion.data.options || []).map((option: string, optionIndex: number) => (
                        <div 
                          key={optionIndex} 
                          className={cn(
                            "flex items-center gap-2",
                            "animate-fade-in-up",
                            "group"
                          )}
                          style={{ animationDelay: `${optionIndex * 50}ms` }}
                        >
                          <Textarea
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(localQuestion.data.options || [])];
                              newOptions[optionIndex] = e.target.value;
                              handleChange('options', newOptions);
                            }}
                            placeholder={`Option ${optionIndex + 1}`}
                            className="transition-all duration-200 focus:scale-[1.01]"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newOptions = (localQuestion.data.options || []).filter((_, i) => i !== optionIndex);
                              handleChange('options', newOptions);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newOptions = [...(localQuestion.data.options || []), ''];
                          handleChange('options', newOptions);
                        }}
                        className="w-full mt-2 transition-all duration-200 hover:bg-primary/10 hover:text-primary group"
                      >
                        <Plus className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                        Add Option
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Correct Answer</Label>
                      <Select
                        value={localQuestion.data.correct_answer}
                        onValueChange={(value) => handleChange('correct_answer', value)}
                      >
                        <SelectTrigger className="transition-all duration-200 focus:scale-[1.01]">
                          <SelectValue placeholder="Select correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {(localQuestion.data.options || []).map((option: string, index: number) => (
                            <SelectItem 
                              key={index} 
                              value={option}
                              className="transition-all duration-200 hover:bg-primary/10 group"
                            >
                              <span className="transition-colors duration-200 group-hover:text-primary">
                                {option || `Option ${index + 1}`}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {section.id === 'answer' && ['shortAnswer', 'speaking'].includes(localQuestion.type) && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sample Answer</Label>
                    <Textarea
                      value={localQuestion.data.sample_answer}
                      onChange={(e) => handleChange('sample_answer', e.target.value)}
                      placeholder="Enter a sample answer..."
                      className="min-h-[100px] transition-all duration-200 focus:scale-[1.01]"
                    />
                  </div>
                )}

                {section.id === 'prompts' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Exercise Prompts</Label>
                      {onAddExercisePrompt && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onAddExercisePrompt}
                          className="transition-all duration-200 hover:bg-primary/10 hover:text-primary group"
                        >
                          <Plus className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                          Add Exercise Prompt
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid gap-4">
                      {localQuestion.exercisePrompts.map((prompt, promptIndex) => (
                        <div 
                          key={prompt.id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${promptIndex * 100}ms` }}
                          onMouseEnter={() => setHoveredPrompt(promptIndex)}
                          onMouseLeave={() => setHoveredPrompt(null)}
                        >
                          <ExercisePromptCard
                            prompt={prompt}
                            promptIndex={promptIndex}
                            onRemove={() => onRemoveExercisePrompt?.(promptIndex)}
                            onUpdate={(updatedPrompt) => handleExercisePromptUpdate(promptIndex, updatedPrompt)}
                            className={cn(
                              "transition-all duration-200",
                              hoveredPrompt === promptIndex && "scale-[1.01] shadow-md"
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};