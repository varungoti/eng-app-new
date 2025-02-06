import { LessonProgress } from "@/types";

import { CustomLesson } from "@/types";

export const getColorForIndex = (index: number): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500'
  ];
  return colors[index % colors.length];
};

export const isLessonUnlocked = (
  lesson: DbLesson, 
  progress: LessonProgress[]
): boolean => {
  if (!lesson.prerequisites?.length) return true;
  return lesson.prerequisites.every(prereqId => 
    progress.some(p => p.lesson_id === prereqId && p.status === 'completed')
  );
};

export const transformLessonData = (
  lesson: DbLesson,
  index: number,
  progress?: LessonProgress,
  selectedGrade?: string,
  selectedTopic?: string, 
  selectedSubtopic?: string
): CustomLesson => {
  // Filter based on selected grade/topic/subtopic hierarchy
  const filteredLesson = {
    ...lesson,
    topics: lesson.topics?.filter(topic => 
      !selectedGrade || topic.grade_id === selectedGrade
    ),
    subtopics: lesson.subtopics?.filter(subtopic =>
      (!selectedTopic || subtopic.topic_id === selectedTopic) &&
      (!selectedGrade || subtopic.grade_id === selectedGrade)
    ),
    content: lesson.content?.filter(content =>
      (!selectedSubtopic || content.subtopic_id === selectedSubtopic) &&
      (!selectedTopic || content.topic_id === selectedTopic) &&
      (!selectedGrade || content.grade_id === selectedGrade)
    ),
    questions: lesson.questions?.filter(question =>
      (!selectedSubtopic || question.subtopic_id === selectedSubtopic) &&
      (!selectedTopic || question.topic_id === selectedTopic) &&
      (!selectedGrade || question.grade_id === selectedGrade)
    ),
    activities: lesson.activities?.filter(activity =>
      (!selectedSubtopic || activity.subtopic_id === selectedSubtopic) &&
      (!selectedTopic || activity.topic_id === selectedTopic) &&
      (!selectedGrade || activity.grade_id === selectedGrade)
    )
  };

  return {
    id: String(filteredLesson.id),
    title: filteredLesson.title,
    status: filteredLesson.status as 'draft' | 'published',
    color: getColorForIndex(index),
    unlocked: isLessonUnlocked(filteredLesson, progress ? [progress] : []),
    completed: progress?.status === 'completed',
    lessonNumber: `${index + 1}`,
    totalTopics: String(filteredLesson.topics?.length || 0),
    difficulty: filteredLesson.difficulty || 'beginner', 
    duration: filteredLesson.duration || 30,
    customSubLessons: filteredLesson.questions?.map(question => ({
      id: String(question.id),
      title: question.title,
      description: question.description || '',
      duration: question.duration || 30,
      unlocked: isLessonUnlocked(filteredLesson, progress ? [progress] : []),
      completed: progress?.status === 'completed',
      exercisePrompts: question.exercise_prompts || []
    })) || []
  };
};