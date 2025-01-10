import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, ChevronDown, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: {
    type: string;
    data: {
      prompt: string;
      teacherScript?: string;
    };
    exercisePrompts?: Array<{
      text: string;
      media?: string;
      type?: 'image' | 'gif' | 'video';
    }>;
  };
  index: number;
  onEdit: () => void;
  questionTypes: Record<string, { label: string }>;
}

export function QuestionCard({ question, index, onEdit, questionTypes }: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border rounded-lg shadow-sm bg-card">
      <div 
        className="p-4 cursor-pointer hover:bg-accent/50 transition-colors flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">Question {index + 1}</p>
            <p className="text-sm text-muted-foreground">{questionTypes[question.type]?.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="h-8 w-8 p-0 text-primary hover:text-primary/90"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              isExpanded && "transform rotate-180"
            )}
          />
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t bg-muted/50">
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium">Prompt</p>
              <p className="text-sm">{question.data.prompt}</p>
            </div>
            {question.data.teacherScript && (
              <div>
                <p className="text-sm font-medium">Teacher Script</p>
                <p className="text-sm">{question.data.teacherScript}</p>
              </div>
            )}
            {question.exercisePrompts && question.exercisePrompts.length > 0 && (
              <div>
                <p className="text-sm font-medium">Exercise Prompts</p>
                <div className="space-y-2 mt-2">
                  {question.exercisePrompts.map((prompt, pIndex) => (
                    <div key={pIndex} className="text-sm bg-background rounded-md p-2">
                      <p>{prompt.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 