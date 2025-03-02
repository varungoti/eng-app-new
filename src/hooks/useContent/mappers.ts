import type { Database } from '../../lib/database.types';
import type { Grade, Topic, SubTopic, Lesson, ExercisePrompt, Question, Activity } from '../../types';

export type Tables = Database['public']['Tables'];

export const mapGrade = (grade: any): Grade => ({
  id: grade.id,
  name: grade.name,
  level: grade.level || 0,
  description: grade.description || '',
  created_at: grade.created_at || new Date().toISOString(),
  updated_at: grade.updated_at || new Date().toISOString(),
  students: grade.students || 0,
  schedule: grade.schedule || 'Not scheduled',
  progress: grade.progress || 0,
  nextLesson: grade.nextLesson || undefined,
  studentIds: grade.studentIds || [],
  maxStudents: grade.maxStudents || 30,
  lessonIds: grade.lessonIds || [],
  assignments: grade.assignments || []
});

export const mapTopic = (topic: any): Topic => ({
  id: topic.id,
  title: topic.title || topic.name || '',
  description: topic.description || '',
  grade_id: topic.grade_id || topic.gradeId || '',
  order_index: topic.order_index || topic.order || 0,
  created_at: topic.created_at || new Date().toISOString(),
  updated_at: topic.updated_at || new Date().toISOString(),
  course_id: topic.course_id || null,
  subtopics: topic.subtopics ? topic.subtopics.map(mapSubTopic) : undefined
});

export const mapSubTopic = (subTopic: any): SubTopic => ({
  id: subTopic.id,
  name: subTopic.name || subTopic.title || '',
  topic_id: subTopic.topic_id || '',
  title: subTopic.title || subTopic.name || '',
  topicId: subTopic.topic_id || subTopic.topicId || '',
  description: subTopic.description || null,
  order: subTopic.order || null,
  order_index: subTopic.order_index || subTopic.order || null,
  created_at: subTopic.created_at || new Date(),
  updated_at: subTopic.updated_at || new Date()
});

export const mapQuestion = (question: any): Question => ({
  id: question.id,
  title: question.title || '',
  content: question.content || null,
  type: question.type || 'text',
  lesson_id: question.lesson_id || question.lessonId || '',
  points: question.points || 0,
  metadata: question.metadata || {},
  order_index: question.order_index || question.order || null,
  created_at: question.created_at || new Date(),
  updated_at: question.updated_at || new Date()
});

export const mapExercisePrompt = (exercise: any): ExercisePrompt => ({
  id: exercise.id,
  prompt: exercise.prompt || '',
  mediaUrl: exercise.media_url || exercise.mediaUrl || '',
  mediaType: exercise.media_type || exercise.mediaType || 'image',
  sayText: exercise.say_text || exercise.sayText || '',
  questions: exercise.questions || []
});

export const mapActivity = (activity: any): Activity => ({
  id: activity.id,
  title: activity.title || '',
  content: activity.content || null,
  type: activity.type || 'text',
  lesson_id: activity.lesson_id || activity.lessonId || '',
  duration: activity.duration || null,
  description: activity.description || null,
  created_at: activity.created_at || new Date(),
  updated_at: activity.updated_at || new Date()
});

export const mapLesson = (lesson: any): Lesson => ({
  id: lesson.id,
  title: lesson.title || '',
  content: lesson.content || null,
  grade_id: lesson.grade_id || null,
  topic_id: lesson.topic_id || null,
  subtopic_id: lesson.sub_topic_id || lesson.subtopic_id || '',
  order_index: lesson.order_index || lesson.order || null,
  duration: lesson.duration || null,
  subjectId: lesson.subjectId || null,
  status: lesson.status || 'draft',
  created_at: lesson.created_at || undefined,
  updated_at: lesson.updated_at || undefined,
  description: lesson.description || null,
  prerequisites: lesson.prerequisites || [],
  media_type: lesson.media_type || undefined,
  media_url: lesson.media_url || null,
  questions: lesson.questions || [],
  activities: lesson.activities || [],
  contentheading: lesson.contentheading || null,
  user_id: lesson.user_id || null,
  student_id: lesson.student_id || '',
  lesson_status: lesson.lesson_status || 'not_started',
  progress_data: lesson.progress_data || {
    lastQuestionIndex: 0,
    answers: {},
    totalSteps: 0,
    completedSteps: 0,
    activities: {}
  },
  completed_at: lesson.completed_at,
  difficulty: lesson.difficulty || 'beginner',
  voice_id: lesson.voice_id,
  total_questions: lesson.total_questions || 0
});