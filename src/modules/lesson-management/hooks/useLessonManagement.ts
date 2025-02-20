import { useQuery } from '@tanstack/react-query';
import type { Grade, Topic, Lesson } from '../types';

interface UseLessonManagementProps {
  gradeId: string | null;
  topicId: string | null;
}

interface LessonManagementData {
  grades: Grade[];
  topics: Topic[];
  lessons: Lesson[];
}

const mockData: LessonManagementData = {
  grades: [
    { id: 'grade1', name: 'Grade 1' },
    { id: 'grade2', name: 'Grade 2' }
  ],
  topics: [
    { id: 'topic1', name: 'Topic 1', gradeId: 'grade1' },
    { id: 'topic2', name: 'Topic 2', gradeId: 'grade1' }
  ],
  lessons: []
};

export function useLessonManagement({ gradeId, topicId }: UseLessonManagementProps) {
  return useQuery({
    queryKey: ['lesson-management', gradeId, topicId],
    queryFn: () => Promise.resolve(mockData),
  });
} 