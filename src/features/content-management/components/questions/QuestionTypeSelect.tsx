import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QUESTION_TYPES } from '../../utils/constants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const QuestionTypeSelect = ({
  value,
  onChange,
  className
}: QuestionTypeSelectProps) => {
  // Group question types by category
  const groupedTypes = Object.entries(QUESTION_TYPES).reduce((acc, [type, details]) => {
    const category = details.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ type, details });
    return acc;
  }, {} as Record<string, { type: string; details: typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES] }[]>);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select question type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedTypes).map(([category, types]) => (
            <SelectGroup key={category}>
              <SelectLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                {category}
              </SelectLabel>
              {types.map(({ type, details }) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center justify-between gap-2">
                    <span>{details.label}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{details.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}; 