import { createContext, useContext, useState } from 'react';
import { useLessonManagement } from '../hooks/useLessonManagement';
import type { Grade, Topic, Lesson } from '../types';

interface LessonManagementContextType<T> {
  grades: T[];
  topics: Topic[];
  lessons: Lesson[];
  selectedGrade: string | null;
  selectedTopic: string | null;
  setSelectedGrade: (gradeId: T | null) => void;
  setSelectedTopic: (topicId: string | null) => void;
  isLoading: boolean;
  error: Error | null;
}

const LessonManagementContext = createContext<LessonManagementContextType<any> | undefined>(undefined);

export function LessonManagementProvider({ children }: { children: React.ReactNode }) {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const { grades, topics, lessons, isLoading, error } = useLessonManagement({
    gradeId: selectedGrade,
    topicId: selectedTopic,
  });

  return (
    <LessonManagementContext.Provider
      value={{
        grades,
        topics,
        lessons,
        selectedGrade,
        selectedTopic,
        setSelectedGrade,
        setSelectedTopic,
        isLoading,
        error,
      }}
    >
      {children}
    </LessonManagementContext.Provider>
  );
}

export function useLessonManagementContext() {
  const context = useContext(LessonManagementContext);
  if (!context) {
    throw new Error('useLessonManagementContext must be used within a LessonManagementProvider');
  }
  return context;
} 