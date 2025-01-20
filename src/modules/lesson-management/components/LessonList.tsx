import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Icon } from '@/components/ui/icons';
import { APP_ICONS } from '@/lib/constants/icons';
import { useLessonManagementContext } from '../context/LessonManagementContext';
import { Spinner as LoadingSpinner } from '../../../components/ui/spinner';

export function LessonList() {
  const { lessons, isLoading, error, selectedGrade, selectedTopic } = useLessonManagementContext();

  if (!selectedGrade) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium">Select a Grade</h3>
        <p className="text-muted-foreground mt-2">
          Choose a grade level to view its lessons
        </p>
      </Card>
    );
  }

  if (!selectedTopic) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium">Select a Topic</h3>
        <p className="text-muted-foreground mt-2">
          Choose a topic to view its lessons
        </p>
      </Card>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading lessons: {error.message}
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium">No Lessons Found</h3>
        <p className="text-muted-foreground mt-2">
          No lessons available for the selected grade and topic
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <Card key={lesson.id} className="p-4">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="font-medium">{lesson.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {lesson.description}
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {lesson.content.objectives.length} Objectives
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Icon name={APP_ICONS.EYE} className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name={APP_ICONS.EDIT} className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Icon name={APP_ICONS.TRASH} className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 