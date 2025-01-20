import { LessonManagementProvider } from '../../../modules/lesson-management/context/LessonManagementContext';
import { GradeSelector } from '../../../modules/lesson-management/components/GradeSelector';
import { TopicSelector } from '../../../modules/lesson-management/components/TopicSelector';
import { LessonList } from '../../../modules/lesson-management/components/LessonList';
import { Button } from '../../../components/ui/button';
import { Plus } from 'lucide-react';

export default function LessonManagementPage() {
  return (
    <LessonManagementProvider>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lesson Management</h1>
            <p className="text-muted-foreground">
              Create and manage lessons for different grades and topics
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Lesson
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <GradeSelector />
          <TopicSelector />
        </div>

        <LessonList />
      </div>
    </LessonManagementProvider>
  );
} 