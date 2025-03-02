import { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronRight, Layers, Lock, Plus, Unlock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Grade, Topic, Subtopic, Lesson } from '../../api/types';

interface ContentSidebarProps {
  grades: Grade[];
  topics: Topic[];
  subtopics: Subtopic[];
  lessons: Lesson[];
  selectedGradeId: string | null;
  selectedTopicId: string | null;
  selectedSubtopicId: string | null;
  currentLessonId: string | null;
  isViewMode: boolean;
  isCollapsed: boolean;
  isLocked: boolean;
  onGradeSelect: (gradeId: string) => void;
  onTopicSelect: (topicId: string) => void;
  onSubtopicSelect: (subtopicId: string) => void;
  onLessonSelect: (lessonId: string) => void;
  onAddGrade: () => void;
  onAddTopic: () => void;
  onAddSubtopic: () => void;
  onAddLesson: () => void;
  onCollapsedChange: (collapsed: boolean) => void;
  onLockedChange: (locked: boolean) => void;
  className?: string;
}

export const ContentSidebar = ({
  grades,
  topics,
  subtopics,
  lessons,
  selectedGradeId,
  selectedTopicId,
  selectedSubtopicId,
  currentLessonId,
  isViewMode,
  isCollapsed,
  isLocked,
  onGradeSelect,
  onTopicSelect,
  onSubtopicSelect,
  onLessonSelect,
  onAddGrade,
  onAddTopic,
  onAddSubtopic,
  onAddLesson,
  onCollapsedChange,
  onLockedChange,
  className
}: ContentSidebarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Auto-collapse sidebar when lesson is selected
  useEffect(() => {
    if (currentLessonId && !isLocked) {
      const timer = setTimeout(() => onCollapsedChange(true), 300);
      return () => clearTimeout(timer);
    }
  }, [currentLessonId, isLocked, onCollapsedChange]);

  return (
    <div 
      className={cn(
        "transition-all duration-300 ease-in-out relative",
        isCollapsed ? "w-16 sm:w-20" : "w-64 sm:w-80",
        "flex-shrink-0 group",
        className
      )}
      onMouseEnter={() => {
        if (!isLocked) {
          onCollapsedChange(false);
        }
      }}
      onMouseLeave={() => {
        if (!isLocked && !isDropdownOpen) {
          onCollapsedChange(true);
        }
      }}
    >
      <Card className={cn(
        "h-full relative",
        "transition-all duration-300",
        "border-primary/10",
        "hover:border-primary/20",
        "hover:shadow-lg",
        "bg-gradient-to-b from-card to-card/95"
      )}>
        {/* Lock/Unlock Button */}
        {currentLessonId && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "absolute top-2 right-2 z-10",
                    "transition-all duration-200",
                    "hover:bg-primary/10",
                    "group"
                  )}
                  onClick={() => onLockedChange(!isLocked)}
                >
                  {isLocked ? (
                    <Lock className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  ) : (
                    <Unlock className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isLocked ? 'Unlock sidebar' : 'Lock sidebar'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <div className={cn(
          "transition-all duration-300",
          isCollapsed ? "opacity-0 invisible" : "opacity-100 visible"
        )}>
          <CardHeader className="pb-4 space-y-3">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Content Management
            </CardTitle>
            <CardDescription>Create and manage your lessons</CardDescription>
          </CardHeader>

          <ScrollArea className="h-[calc(100vh-12rem)] px-6">
            <div className="space-y-6 pb-6">
              {/* Grade Selection */}
              <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <Label htmlFor="grade-select">Grade</Label>
                <Select 
                  value={selectedGradeId || ''} 
                  onValueChange={onGradeSelect}
                  onOpenChange={setIsDropdownOpen}
                >
                  <SelectTrigger 
                    id="grade-select"
                    className="transition-all duration-200 focus:scale-[1.01]"
                  >
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem 
                        key={grade.id} 
                        value={grade.id}
                        className={cn(
                          "transition-all duration-200",
                          "hover:bg-primary/10",
                          "focus:bg-primary/10",
                          "group"
                        )}
                        onMouseEnter={() => setHoveredItem(grade.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className={cn(
                            "h-4 w-4 text-primary",
                            "transition-transform duration-200",
                            hoveredItem === grade.id && "scale-110"
                          )} />
                          <span className="transition-colors duration-200 group-hover:text-primary">
                            {grade.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!isViewMode && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "w-full gap-2",
                      "transition-all duration-200",
                      "hover:bg-primary/10 hover:text-primary",
                      "group"
                    )}
                    onClick={onAddGrade}
                  >
                    <Plus className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    Add New Grade
                  </Button>
                )}
              </div>

              {/* Topic Selection */}
              {selectedGradeId && (
                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <Label htmlFor="topic-select">Topic</Label>
                  <Select 
                    value={selectedTopicId || ''} 
                    onValueChange={onTopicSelect}
                    onOpenChange={setIsDropdownOpen}
                  >
                    <SelectTrigger 
                      id="topic-select"
                      className="transition-all duration-200 focus:scale-[1.01]"
                    >
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem 
                          key={topic.id} 
                          value={topic.id}
                          className={cn(
                            "transition-all duration-200",
                            "hover:bg-primary/10",
                            "focus:bg-primary/10",
                            "group"
                          )}
                          onMouseEnter={() => setHoveredItem(topic.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <div className="flex items-center gap-2">
                            <Layers className={cn(
                              "h-4 w-4 text-primary",
                              "transition-transform duration-200",
                              hoveredItem === topic.id && "scale-110"
                            )} />
                            <span className="transition-colors duration-200 group-hover:text-primary">
                              {topic.title}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!isViewMode && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "w-full gap-2",
                        "transition-all duration-200",
                        "hover:bg-primary/10 hover:text-primary",
                        "group"
                      )}
                      onClick={onAddTopic}
                    >
                      <Plus className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      Add New Topic
                    </Button>
                  )}
                </div>
              )}

              {/* Subtopic Selection */}
              {selectedTopicId && (
                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  <Label htmlFor="subtopic-select">Subtopic</Label>
                  <Select 
                    value={selectedSubtopicId || ''} 
                    onValueChange={onSubtopicSelect}
                    onOpenChange={setIsDropdownOpen}
                  >
                    <SelectTrigger 
                      id="subtopic-select"
                      className="transition-all duration-200 focus:scale-[1.01]"
                    >
                      <SelectValue placeholder="Select Subtopic" />
                    </SelectTrigger>
                    <SelectContent>
                      {subtopics.map((subtopic) => (
                        <SelectItem 
                          key={subtopic.id} 
                          value={subtopic.id}
                          className={cn(
                            "transition-all duration-200",
                            "hover:bg-primary/10",
                            "focus:bg-primary/10",
                            "group"
                          )}
                          onMouseEnter={() => setHoveredItem(subtopic.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="transition-colors duration-200 group-hover:text-primary">
                              {subtopic.title}
                            </span>
                            <Badge variant="outline" className={cn(
                              "ml-2 transition-all duration-200",
                              "group-hover:bg-primary/10",
                              "group-hover:border-primary/30"
                            )}>
                              {subtopic.lessons?.length || 0} lessons
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!isViewMode && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "w-full gap-2",
                        "transition-all duration-200",
                        "hover:bg-primary/10 hover:text-primary",
                        "group"
                      )}
                      onClick={onAddSubtopic}
                    >
                      <Plus className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      Add New Subtopic
                    </Button>
                  )}
                </div>
              )}

              {/* Lesson Selection */}
              {selectedSubtopicId && (
                <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  <Label htmlFor="lesson-select">Lesson</Label>
                  <Select 
                    value={currentLessonId || ''} 
                    onValueChange={onLessonSelect}
                    onOpenChange={setIsDropdownOpen}
                  >
                    <SelectTrigger 
                      id="lesson-select"
                      className="transition-all duration-200 focus:scale-[1.01]"
                    >
                      <SelectValue placeholder="Select Lesson" />
                    </SelectTrigger>
                    <SelectContent>
                      {lessons.map((lesson) => (
                        <SelectItem 
                          key={lesson.id} 
                          value={lesson.id}
                          className={cn(
                            "transition-all duration-200",
                            "hover:bg-primary/10",
                            "focus:bg-primary/10",
                            "group"
                          )}
                          onMouseEnter={() => setHoveredItem(lesson.id)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          <div className="flex items-center gap-2">
                            <BookOpen className={cn(
                              "h-4 w-4 text-primary",
                              "transition-transform duration-200",
                              hoveredItem === lesson.id && "scale-110"
                            )} />
                            <div className="flex flex-col">
                              <span className="transition-colors duration-200 group-hover:text-primary">
                                {lesson.title}
                              </span>
                              {lesson.status && (
                                <Badge variant="outline" className={cn(
                                  "mt-1 transition-all duration-200",
                                  "group-hover:bg-primary/10",
                                  "group-hover:border-primary/30"
                                )}>
                                  {lesson.status}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!isViewMode && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "w-full gap-2",
                        "transition-all duration-200",
                        "hover:bg-primary/10 hover:text-primary",
                        "group"
                      )}
                      onClick={onAddLesson}
                    >
                      <Plus className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      Add New Lesson
                    </Button>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Collapsed View */}
        {isCollapsed && (
          <div className={cn(
            "absolute inset-0 flex flex-col items-center pt-12 gap-4",
            "animate-fade-in"
          )}>
            <BookOpen className="h-6 w-6 text-primary transition-transform duration-200 hover:scale-110" />
            <div className="w-px h-full bg-primary/20" />
          </div>
        )}
      </Card>
    </div>
  );
}; 