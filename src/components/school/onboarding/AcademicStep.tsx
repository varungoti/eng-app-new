"use client";

import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Languages, X, Plus, Minus, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const curriculumOptions = [
  { value: 'CBSE', label: 'CBSE', icon: '📚' },
  { value: 'ICSE', label: 'ICSE', icon: '📖' },
  { value: 'State', label: 'State Board', icon: '📝' },
  { value: 'IB', label: 'International Baccalaureate', icon: '🌍' },
  { value: 'Cambridge', label: 'Cambridge International', icon: '🎓' }
];

const languageOptions = [
  { value: 'english', label: 'English', icon: '🇬🇧' },
  { value: 'hindi', label: 'Hindi', icon: '🇮🇳' },
  { value: 'sanskrit', label: 'Sanskrit', icon: '📜' },
  { value: 'french', label: 'French', icon: '🇫🇷' },
  { value: 'german', label: 'German', icon: '🇩🇪' },
  { value: 'spanish', label: 'Spanish', icon: '🇪🇸' }
];

const activityOptions = [
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'dance', label: 'Dance', icon: '💃' },
  { value: 'art', label: 'Art & Craft', icon: '🎨' },
  { value: 'debate', label: 'Debate Club', icon: '🗣️' },
  { value: 'science_club', label: 'Science Club', icon: '🔬' },
  { value: 'robotics', label: 'Robotics', icon: '🤖' },
  { value: 'eco_club', label: 'Eco Club', icon: '🌱' }
];

interface Section {
  id: string;
  name: string;
  roomNumber: string;
}

interface GradeWithSections {
  grade: string;
  sections: Section[];
}

interface SelectableOption {
  value: string;
  label: string;
  icon: string;
}

function MultiSelectBadges({
  options,
  selected,
  onSelect,
  onRemove,
  placeholder
}: {
  options: SelectableOption[];
  selected: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) => {
          if (!selected.includes(value)) {
            onSelect(value);
          }
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options.map(option => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={selected.includes(option.value)}
            >
              <span className="flex items-center gap-2">
                <span>{option.icon}</span>
                {option.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-wrap gap-2">
        {selected.map((value) => {
          const option = options.find(opt => opt.value === value);
          return (
            <Badge
              key={value}
              variant="secondary"
              className="py-2 px-3 flex items-center gap-2"
            >
              <span>{option?.icon}</span>
              {option?.label}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => onRemove(value)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

interface AcademicStepProps {
  schoolId: string;
  onComplete: () => void;
}

export function AcademicStep({ schoolId, onComplete }: AcademicStepProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [gradesWithSections, setGradesWithSections] = useState<GradeWithSections[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const addSection = (grade: string) => {
    setGradesWithSections(prev => prev.map(g => {
      if (g.grade === grade) {
        const nextSectionName = String.fromCharCode(65 + g.sections.length); // A, B, C, ...
        return {
          ...g,
          sections: [...g.sections, {
            id: `${grade}-${nextSectionName}`,
            name: nextSectionName,
            roomNumber: ''
          }]
        };
      }
      return g;
    }));
  };

  const removeSection = (grade: string, sectionId: string) => {
    setGradesWithSections(prev => prev.map(g => {
      if (g.grade === grade) {
        return {
          ...g,
          sections: g.sections.filter(s => s.id !== sectionId)
        };
      }
      return g;
    }));
  };

  const updateRoomNumber = (grade: string, sectionId: string, roomNumber: string) => {
    setGradesWithSections(prev => prev.map(g => {
      if (g.grade === grade) {
        return {
          ...g,
          sections: g.sections.map(s => 
            s.id === sectionId ? { ...s, roomNumber } : s
          )
        };
      }
      return g;
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      
      // Validate that all sections have room numbers
      const hasEmptyRoomNumbers = gradesWithSections.some(grade =>
        grade.sections.some(section => !section.roomNumber.trim())
      );

      if (hasEmptyRoomNumbers) {
        toast({
          title: "Validation Error",
          description: "Please enter room numbers for all sections",
          variant: "destructive"
        });
        return;
      }

      // Update school with academic information
      const { error: updateError } = await supabase
        .from('schools')
        .update({
          curriculum_type: selectedCurriculum,
          languages_offered: selectedLanguages,
          extracurricular_activities: selectedActivities,
          grade_structure: {
            grades: gradesWithSections.map(g => ({
              grade: g.grade,
              sections: g.sections
            }))
          }
        })
        .eq('id', schoolId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Academic setup completed successfully",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Grade Sections Management */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Grade Sections</h3>
              <p className="text-sm text-gray-500">Manage sections and room numbers for each grade</p>
            </div>
            <Badge variant="secondary" className="h-8 px-3">
              <Users className="h-4 w-4 mr-2" />
              {gradesWithSections.reduce((acc, grade) => acc + grade.sections.length, 0)} Total Sections
            </Badge>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="grid gap-4">
              {gradesWithSections.map((grade) => (
                <Card key={grade.grade} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{grade.grade}</h4>
                        <Badge variant="outline" className="text-xs">
                          {grade.sections.length} {grade.sections.length === 1 ? 'Section' : 'Sections'}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSection(grade.grade)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Section
                      </Button>
                    </div>

                    <div className="grid gap-3">
                      {grade.sections.map((section) => (
                        <div key={section.id} 
                             className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                          <Badge variant="secondary" className="h-8 px-3">
                            Section {section.name}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <Label htmlFor={`room-${section.id}`} className="text-sm text-muted-foreground mb-1 block">
                              Room Number
                            </Label>
                            <Input
                              id={`room-${section.id}`}
                              placeholder="Enter room number"
                              value={section.roomNumber}
                              onChange={(e) => updateRoomNumber(grade.grade, section.id, e.target.value)}
                              className="h-9"
                            />
                          </div>
                          {grade.sections.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeSection(grade.grade, section.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>

      {/* Curriculum Selection */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Curriculum</h3>
              <p className="text-sm text-gray-500">Select curriculum types offered</p>
            </div>
            <BookOpen className="h-8 w-8 text-gray-400" />
          </div>
          <MultiSelectBadges
            options={curriculumOptions}
            selected={selectedCurriculum}
            onSelect={(value) => setSelectedCurriculum([...selectedCurriculum, value])}
            onRemove={(value) => setSelectedCurriculum(selectedCurriculum.filter(v => v !== value))}
            placeholder="Select curriculum types"
          />
        </div>
      </Card>

      {/* Languages */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Languages</h3>
              <p className="text-sm text-gray-500">Select languages offered</p>
            </div>
            <Languages className="h-8 w-8 text-gray-400" />
          </div>
          <MultiSelectBadges
            options={languageOptions}
            selected={selectedLanguages}
            onSelect={(value) => setSelectedLanguages([...selectedLanguages, value])}
            onRemove={(value) => setSelectedLanguages(selectedLanguages.filter(v => v !== value))}
            placeholder="Select languages"
          />
        </div>
      </Card>

      {/* Activities */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Extracurricular Activities</h3>
              <p className="text-sm text-gray-500">Select activities offered</p>
            </div>
            <GraduationCap className="h-8 w-8 text-gray-400" />
          </div>
          <MultiSelectBadges
            options={activityOptions}
            selected={selectedActivities}
            onSelect={(value) => setSelectedActivities([...selectedActivities, value])}
            onRemove={(value) => setSelectedActivities(selectedActivities.filter(v => v !== value))}
            placeholder="Select activities"
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Complete Academic Setup'
          )}
        </Button>
      </div>
    </div>
  );
}