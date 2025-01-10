import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QUESTION_TYPES, QuestionType, isQuestionType } from '../constants';
import { logger } from '@/lib/logger';
import { useCallback } from 'react';

interface QuestionTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function QuestionTypeSelect({ value, onValueChange }: QuestionTypeSelectProps) {
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleValueChange = useCallback((newValue: string) => {
    try {
      if (!isQuestionType(newValue)) {
        throw new Error(`Invalid question type: ${newValue}`);
      }
      onValueChange(newValue);
      logger.debug('Question type selected', {
        context: { type: newValue },
        source: 'QuestionTypeSelect'
      });
    } catch (err) {
      logger.error('Failed to change question type', {
        context: { error: err, value: newValue },
        source: 'QuestionTypeSelect'
      });
    }
  }, [onValueChange]);

  const renderPreview = (type: string) => {
    if (!isQuestionType(type)) return null;
    const questionType = QUESTION_TYPES[type];
    if (!questionType) return null;

    return (
      <div className="w-[300px] p-4 space-y-2">
        <h3 className="font-semibold text-sm">{questionType.label}</h3>
        <p className="text-sm text-muted-foreground">{questionType.description}</p>
        <div className="mt-4 p-3 bg-muted rounded-lg text-xs space-y-2">
          <div className="font-medium">Default Structure:</div>
          <div className="overflow-auto max-h-[200px] whitespace-pre-wrap break-all">
            <code>{JSON.stringify(questionType.defaultData, null, 2)}</code>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select question type" />
        </SelectTrigger>
        <SelectContent align="start" side="right" className="w-[200px]">
          <div className="relative">
            {Object.entries(QUESTION_TYPES).map(([key, type]) => (
              <div key={key} className="relative group">
                <SelectItem
                  value={key}
                  onMouseEnter={() => setHoveredType(key)}
                  onMouseLeave={() => setHoveredType(null)}
                  className="cursor-pointer"
                >
                  {type.label}
                </SelectItem>
                {mounted && hoveredType === key && (
                  <div 
                    className="absolute left-full top-0 ml-2 z-[9999]"
                  >
                    <div
                      style={{
                        opacity: 1,
                        transform: 'translateX(0)',
                        transition: 'all 0.15s ease-out'
                      }}
                      className="bg-popover border rounded-md shadow-md"
                    >
                      {renderPreview(key)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}