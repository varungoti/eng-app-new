import type { Database } from '../../lib/database.types';
import type { Grade, Topic, SubTopic, Lesson, Exercise } from '../../types';

export type Tables = Database['public']['Tables'];

export const mapGrade = (grade: Tables['grades']['Row']): Grade => ({
  id: grade.id,
  name: grade.name,
  level: grade.level,
  description: grade.description || ''
});

export const mapTopic = (topic: Tables['topics']['Row']): Topic => ({
  id: topic.id,
  gradeId: topic.grade_id,
  title: topic.title,
  description: topic.description || '',
  order: topic.order
});

export const mapSubTopic = (subTopic: Tables['sub_topics']['Row']): SubTopic => ({
  id: subTopic.id,
  topicId: subTopic.topic_id,
  title: subTopic.title,
  description: subTopic.description || '',
  order: subTopic.order
});

export const mapExercise = (exercise: Tables['exercises']['Row']): Exercise => ({
  id: exercise.id,
  prompt: exercise.prompt,
  mediaUrl: exercise.media_url || '',
  mediaType: exercise.media_type || 'image',
  sayText: exercise.say_text
});

export const mapLesson = (lesson: Tables['lessons']['Row'] & { exercises?: Tables['exercises']['Row'][] }): Lesson => ({
  id: lesson.id,
  subTopicId: lesson.sub_topic_id,
  title: lesson.title,
  description: lesson.description || '',
  order: lesson.order,
  teacherScript: lesson.teacher_script || '',
  teacherPrompt: lesson.teacher_prompt || '',
  sampleAnswer: lesson.sample_answer || '',
  exercises: (lesson.exercises || []).map(mapExercise)
});