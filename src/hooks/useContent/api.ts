import { supabase } from '../../lib/supabase';
import { logger } from '../../lib/logger';
import type { Database } from '../../lib/database.types';
import type { Topic, SubTopic, Lesson, Exercise } from '../../types';

export const fetchGrades = async () => {
  const { data, error } = await supabase
    .from('grades')
    .select(`
      id,
      name,
      level,
      description
    `)
    .order('level');

  if (error) throw error;
  return data;
};

export const fetchTopics = async () => {
  const { data, error } = await supabase
    .from('topics')
    .select(`
      id,
      grade_id,
      title,
      description,
      order
    `)
    .order('order');

  if (error) throw error;
  return data;
};

export const fetchSubTopics = async () => {
  const { data, error } = await supabase
    .from('sub_topics')
    .select(`
      id,
      topic_id,
      title,
      description,
      order
    `)
    .order('order');

  if (error) throw error;
  return data;
};

export const fetchLessons = async () => {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      id,
      sub_topic_id,
      title,
      description,
      order,
      teacher_script,
      teacher_prompt,
      sample_answer,
      exercises (
        id,
        prompt,
        media_url,
        media_type,
        say_text
      )
    `)
    .order('order');

  if (error) throw error;
  return data;
};

export const upsertTopic = async (topic: Partial<Topic>) => {
  const { data, error } = await supabase
    .from('topics')
    .upsert({
      id: topic.id,
      grade_id: topic.gradeId,
      title: topic.title,
      description: topic.description,
      order: topic.order
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upsertSubTopic = async (subTopic: Partial<SubTopic>) => {
  const { data, error } = await supabase
    .from('sub_topics')
    .upsert({
      id: subTopic.id,
      topic_id: subTopic.topicId,
      title: subTopic.title,
      description: subTopic.description,
      order: subTopic.order
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upsertLesson = async (lesson: Partial<Lesson>) => {
  const { id, exercises, ...lessonData } = lesson;

  // First upsert the lesson
  const { data: lessonResult, error: lessonError } = await supabase
    .from('lessons')
    .upsert({
      id,
      sub_topic_id: lessonData.subTopicId,
      title: lessonData.title,
      description: lessonData.description,
      order: lessonData.order,
      teacher_script: lessonData.teacherScript,
      teacher_prompt: lessonData.teacherPrompt,
      sample_answer: lessonData.sampleAnswer
    })
    .select()
    .single();

  if (lessonError) throw lessonError;

  // Then handle exercises if provided
  if (exercises) {
    const exercisesWithLessonId = exercises.map(exercise => ({
      ...exercise,
      lesson_id: lessonResult.id
    }));

    const { error: exercisesError } = await supabase
      .from('exercises')
      .upsert(exercisesWithLessonId);

    if (exercisesError) throw exercisesError;
  }

  return lessonResult;
};

export const deleteTopic = async (id: string) => {
  const { error } = await supabase
    .from('topics')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const deleteSubTopic = async (id: string) => {
  const { error } = await supabase
    .from('sub_topics')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const deleteLesson = async (id: string) => {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) throw error;
};