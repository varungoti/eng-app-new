import { supabase } from '../../lib/supabase';

//import type { Database } from '../../lib/database.types';
import type { Topic, SubTopic, Lesson, Question, ExercisePrompt, Activity } from '../../types';

export const fetchGrades = async () => {
  const { data, error } = await supabase
    .from('grades')
    .select(`
      id,
      name,
      level,
      description,
      created_at,
      updated_at
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
      order,
      created_at,
      updated_at
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
      order,
      created_at,
      updated_at
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
      content
      order,
      teacher_script,
      teacher_prompt,
      sample_answer,
      contentheading,
      lesson_status,
      progress_data,
      completed_at,
      difficulty,
      voice_id,
      total_questions
    `)
    .order('order');

  if (error) throw error;
  return data;
};

export const fetchQuestions = async () => {
  const { data, error } = await supabase
    .from('questions')
    .select('*');

  if (error) throw error;
  return data || [];
};

export const upsertQuestion = async (question: Partial<Question>) => {
  const { data, error } = await supabase
    .from('questions')
    .upsert({
      id: question.id,
      title: question.title,
      content: question.content,
      type: question.type,
      lesson_id: question.lesson_id,
      order_index: question.order_index,
      created_at: question.created_at,
      updated_at: question.updated_at,
      metadata: question.metadata,
      data: question.data,
      
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const fetchExercisePrompts = async () => {
  const { data, error } = await supabase
    .from('exercise_prompts')
    .select('*');
    
  if (error) throw error;
  return data || [];
};

export const upsertExercisePrompt = async (exercisePrompt: Partial<ExercisePrompt>) => {
  const { data, error } = await supabase
    .from('exercise_prompts')
    .upsert({
      id: exercisePrompt.id,
      prompt: exercisePrompt.prompt,
      media_url: exercisePrompt.media_url,
      media_type: exercisePrompt.media_type,
      say_text: exercisePrompt.say_text,
      questions: exercisePrompt.questions,
      created_at: exercisePrompt.created_at,
      updated_at: exercisePrompt.updated_at,
      lesson_id: exercisePrompt.lesson_id,
      order_index: exercisePrompt.order_index,
      score: exercisePrompt.score,
      name: exercisePrompt.name,
      instructions: exercisePrompt.instructions,
          })
    .select()
    .single();

  if (error) throw error;
  return data;
};


export const fetchActivities = async () => {
  const { data, error } = await supabase
    .from('activities')
    .select('*');

  if (error) throw error;
  return data || [];
};

export const upsertActivity = async (activity: Partial<Activity>) => {
  const { data, error } = await supabase
    .from('activities')
    .upsert({
      id: activity.id,
      title: activity.title,
      content: activity.content,
      type: activity.type,
      lesson_id: activity.lesson_id,
      order_index: activity.order_index,
      created_at: activity.created_at,
      updated_at: activity.updated_at,
      data: activity.data,
      score: activity.score,
      name: activity.name,
      instructions: activity.instructions,
      media: activity.media,
      media_type: activity.media_type,
      media_url: activity.media_url,
      media_caption: activity.media_caption,
      media_alt_text: activity.media_alt_text,
      media_description: activity.media_description,
      media_keywords: activity.media_keywords,
      media_tags: activity.media_tags,
      media_title: activity.media_title,
      
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upsertTopic = async (topic: Partial<Topic>) => {
  const { data, error } = await supabase
    .from('topics')
    .upsert({
      id: topic.id,
      grade_id: topic.grade_id,
      title: topic.title,
      description: topic.description,
      order: topic.order_index
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
      topic_id: subTopic.topicId || subTopic.topic_id,
      title: subTopic.title,
      description: subTopic.description,
      order: subTopic.order || subTopic.order_index
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const upsertLesson = async (lesson: Partial<Lesson> & { exercises?: any[] }) => {
  const { id, exercises, ...lessonData } = lesson;

  // First upsert the lesson
  const { data: lessonResult, error: lessonError } = await supabase
    .from('lessons')
    .upsert({
      id,
      sub_topic_id: lessonData.subtopic_id,
      title: lessonData.title,
      description: lessonData.description,
      order: lessonData.order_index,
      teacher_script: lessonData.content,
      teacher_prompt: lesson.contentheading || '',
      sample_answer: '',
      contentheading: lessonData.contentheading,
      content: lessonData.content,
      lesson_status: lessonData.lesson_status,
      progress_data: lessonData.progress_data,
      completed_at: lessonData.completed_at,
      difficulty: lessonData.difficulty,
      voice_id: lessonData.voice_id,
      total_questions: lessonData.total_questions
    })
    .select()
    .single();

  if (lessonError) throw lessonError;

  // Then handle exercises if provided
  if (exercises) {
    const exercisesWithLessonId = exercises.map((exercise: any) => ({
      ...exercise,
      lesson_id: lessonResult.id
    }));

    const { error: exercisesError } = await supabase
      .from('exercise_prompts')
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