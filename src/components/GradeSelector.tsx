"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGrades, Grade } from '@/hooks/useGrades';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface GradeSelectorProps {
  selectedGrades: string[];
  onChange: (grades: string[]) => void;
}

const GradeSelector: React.FC<GradeSelectorProps> = ({
  selectedGrades = [],
  onChange
}) => {
  const { data: grades, isLoading, error } = useGrades();

  const toggleGrade = (gradeId: string) => {
    const newGrades = selectedGrades.includes(gradeId)
      ? selectedGrades.filter(g => g !== gradeId)
      : [...selectedGrades, gradeId];
    onChange(newGrades);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner className="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive p-4 text-center rounded-lg border border-destructive/20 bg-destructive/10">
        Failed to load grades. Please try again.
      </div>
    );
  }

  if (!grades || grades.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center rounded-lg border bg-muted/50">
        No grades available. Please add grades to the system.
      </div>
    );
  }

  // Group grades by level
  const groupedGrades = grades.reduce((acc, grade) => {
    const level = grade.level <= 2 ? 'Pre-Primary' : 'Primary';
    if (!acc[level]) acc[level] = [];
    acc[level].push(grade);
    return acc;
  }, {} as Record<string, Grade[]>);

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Available Grades</h4>
          <p className="text-xs text-muted-foreground">
            Click to select or deselect grades
          </p>
        </div>
        <Badge variant="secondary" className="h-7 px-3">
          {selectedGrades.length} Selected
        </Badge>
      </div>
      
      <ScrollArea className="h-full max-h-[400px] pr-4">
        <div className="space-y-6">
          {Object.entries(groupedGrades).map(([level, levelGrades]) => (
            <div key={level} className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {level}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {levelGrades.map((grade) => {
                  const isSelected = selectedGrades.includes(grade.id);
                  return (
                    <Button
                      key={grade.id}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => toggleGrade(grade.id)}
                      className={cn(
                        "h-auto py-3 px-4 text-sm font-medium justify-between group relative",
                        isSelected && "border-primary shadow-sm"
                      )}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{grade.name}</span>
                        {grade.description && (
                          <span className="text-xs text-muted-foreground mt-0.5">
                            {grade.description}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary-foreground shrink-0" />
                      )}
                      <span className={cn(
                        "absolute inset-0 rounded-md ring-2 ring-transparent transition-all",
                        isSelected ? "ring-primary" : "group-hover:ring-primary/20"
                      )} />
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default GradeSelector;