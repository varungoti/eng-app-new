import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lock } from 'lucide-react';
import type { Topic, Subtopic, Lesson, LessonProgress } from '@/types/learning';

interface LearningPathNavProps {
  topics: Topic[];
  progress: LessonProgress[];
  onSelectLesson: (lessonId: string) => void;
}

export function LearningPathNav({ topics, progress, onSelectLesson }: LearningPathNavProps) {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null);

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lesson_id === lessonId && p.status === 'completed');
  };

  const isLessonUnlocked = (lesson: Lesson, subtopicLessons: Lesson[] | undefined) => {
    if (!subtopicLessons) return false;
    
    const lessonIndex = subtopicLessons.findIndex(l => l.id === lesson.id);
    if (lessonIndex === 0) return true;
    
    const previousLesson = subtopicLessons[lessonIndex - 1];
    return isLessonCompleted(previousLesson.id);
  };

  return (
    <div className="space-y-4">
      {topics.map(topic => (
        <Card key={topic.id}>
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setExpandedTopic(
                expandedTopic === topic.id ? null : topic.id
              )}
            >
              {topic.title}
              <ChevronRight className={`transform transition-transform ${
                expandedTopic === topic.id ? 'rotate-90' : ''
              }`} />
            </Button>

            {expandedTopic === topic.id && topic.subtopics?.map(subtopic => (
              <div key={subtopic.id} className="ml-4 mt-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between"
                  onClick={() => setExpandedSubtopic(
                    expandedSubtopic === subtopic.id ? null : subtopic.id
                  )}
                >
                  {subtopic.title}
                  <ChevronRight className={`transform transition-transform ${
                    expandedSubtopic === subtopic.id ? 'rotate-90' : ''
                  }`} />
                </Button>

                {expandedSubtopic === subtopic.id && subtopic.lessons?.map(lesson => {
                  const isUnlocked = isLessonUnlocked(lesson, subtopic.lessons);
                  const isCompleted = isLessonCompleted(lesson.id);

                  return (
                    <Button
                      key={lesson.id}
                      variant="ghost"
                      className={`ml-4 mt-2 w-full justify-between ${
                        !isUnlocked ? 'opacity-50' : ''
                      }`}
                      onClick={() => isUnlocked && onSelectLesson(lesson.id)}
                      disabled={!isUnlocked}
                    >
                      <span>{lesson.title}</span>
                      {!isUnlocked ? (
                        <Lock className="h-4 w-4" />
                      ) : isCompleted ? (
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                      ) : null}
                    </Button>
                  );
                })}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 