// src/scripts/insert-pp1-data.ts
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'
import pp1Data from '../data/pp1_data.json'
import dotenv from 'dotenv'
import path from 'path'
import { dbConfig, logLevels } from './config/db-config'
import { validators, ValidationError } from './utils/validators'
import type { PostgrestError } from '@supabase/supabase-js'
//import { Topic, Subtopic, Lesson, Question, ExercisePrompt, Activity } from '@/types/index'

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Debug environment variables
console.log('Environment variables:', {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY
})
import fs from 'fs'
const data = JSON.parse(fs.readFileSync('src/data/pp1_data.json', 'utf8'));

const questionTypes = new Set();

// Recursive function to find all question types
function findQuestionTypes(obj: any) {
  if (obj && typeof obj === 'object') {
    if (obj.type && obj.id && obj.id.startsWith('pp1')) {
      questionTypes.add(obj.type);
    }
    Object.values(obj).forEach(value => findQuestionTypes(value));
  }
}

findQuestionTypes(data);
console.log('Found question types:', Array.from(questionTypes));


// Define types based on your schema
interface ExercisePrompt {
  id?: string
  text: string
  narration: string
  saytext: string
  order_index: number
  question_id?: string
}

interface Question {
  id: string
  title: string
  content: string
  type: string
  exercise_prompts: ExercisePrompt[]
  lesson_id?: string
  order_index?: number
  sub_type?: string
  metadata?: Record<string, any>
  prompt: string
  teacher_script?: string
  sample_answer?: string
  data?: {
    prompt?: string;
    teacher_script?: string;
    sample_answer?: string;
    [key: string]: any;
  };
}

interface Activity {
  id: string
  title: string
  type: string
  description: string
  instructions: string
  duration: number
  lesson_id?: string
}

interface Lesson {
  id: string
  title: string
  description: string
  content_type: string
  duration: number
  difficulty: string
  metadata: Record<string, any>
  questions: Question[]
  activities: Activity[]
  subtopic_id?: string
  order_index: number
  content?: string
}

interface Subtopic {
  id: string
  title: string
  description: string
  order_index: number
  lessons: Lesson[]
  topic_id?: string
}

interface Topic {
  id: string
  title: string
  description: string
  subtopics: Subtopic[]
  grade_id?: string
  order_index: number
}

// Better yet, import it directly from constants:
import { QuestionType } from '@/app/content-management/constants';

const VALID_QUESTION_TYPES = [
  'speaking',
  'dialogue',
  'story_telling',
  'question_answer',
  'role_play',
  'morning_routine',
  'activity_description',
  'asking_help',
  'sharing_experiences',
  'problem_solving',
  'fun_speaking',
  'game_words',
  'sharing',
  'singing',
  'happy_words',
  'action_words',
  'action_songs',
  'follow_leader',
  'animal_actions',
  'playtime_words',
  'toy_words',
  'game_choices',
  'play_areas',
  'play_rules',
  'play_feelings',
  'play_invitations',
  'sharing_words',
  'kind_words',
  'play_help',
  'cleanup_time',
  'playground_words',
  'outdoor_games',
  'safety_words',
  'weather_words',
  'line_up',
  'playground_friends',
  'movement_words',
  'playground_rules',
  'playground_feelings',
  'cleanup_outside',
  'number_one',
  'number_two',
  'counting_objects',
  'body_parts',
  'classroom_items',
  'counting_actions',
  'counting_friends',
  'counting_sounds',
  'counting_colors',
  'counting_review',
  'number_three',
  'number_four',
  'counting_toys',
  'counting_fingers',
  'counting_steps',
  'counting_claps',
  'counting_animals',
  'number_six',
  'number_seven',
  'number_eight',
  'number_nine',
  'number_ten',
  'counting_together',
  'final_review',
  'count_up',
  'review_six_seven',
  'review_eight_nine',
  'review_ten',
  'counting_groups',
  'listening',
  'say_circle',
  'find_circles',
  'circle_objects',
  'draw_circle',
  'circle_colors',
  'circle_sizes',
  'circle_movement',
  'circle_counting',
  'circle_patterns',
  'circle_review'
] as const;

type ValidQuestionType = typeof VALID_QUESTION_TYPES[number];

// Define a mapping of specific types to our core question types
const QUESTION_TYPE_MAPPING: Record<string, QuestionType> = {
  // Speaking-related types map to 'speaking'
  'speaking': 'speaking',
  'fun_speaking': 'speaking',
  'sharing': 'speaking',
  'singing': 'speaking',
  'dialogue': 'speaking',
  'question_answer': 'speaking',
  'role_play': 'speaking',
  'play_invitations': 'speaking',
  'asking_help': 'speaking',
  'problem_solving': 'speaking',
  
  // Story-related types map to 'storytelling'
  'story_telling': 'storytelling',
  'sharing_experiences': 'storytelling',
  
  // Action-related types map to 'actionAndSpeaking'
  'morning_routine': 'speaking',
  'activity_description': 'speaking',
  'cleanup_time': 'speaking',
  'cleanup_outside': 'speaking',
  'line_up': 'speaking',
  'outdoor_games': 'speaking',
  
  // Multiple choice related types
  'game_choices': 'multipleChoice',
  'play_rules': 'multipleChoice',
  'playground_rules': 'multipleChoice',
  'safety_words': 'multipleChoice',
  
  // Map all remaining types to 'speaking'
  'action_words': 'speaking',
  'action_songs': 'speaking',
  'follow_leader': 'speaking',
  'animal_actions': 'speaking',
  'playtime_words': 'speaking',
  'toy_words': 'speaking',
  'game_words': 'speaking',
  'play_areas': 'speaking',
  'happy_words': 'speaking',
  'kind_words': 'speaking',
  'playground_words': 'speaking',
  'weather_words': 'speaking',
  'movement_words': 'speaking',
  'body_parts': 'speaking',
  'classroom_items': 'speaking',
  'play_feelings': 'speaking',
  'play_help': 'speaking',
  'playground_friends': 'speaking',
  'playground_feelings': 'speaking',
  
  // Number and counting related types
  'number_one': 'speaking',
  'number_two': 'speaking',
  'number_three': 'speaking',
  'number_four': 'speaking',
  'number_six': 'speaking',
  'number_seven': 'speaking',
  'number_eight': 'speaking',
  'number_nine': 'speaking',
  'number_ten': 'speaking',
  'counting_objects': 'speaking',
  'counting_actions': 'speaking',
  'counting_friends': 'speaking',
  'counting_sounds': 'speaking',
  'counting_colors': 'speaking',
  'counting_review': 'speaking',
  'counting_toys': 'speaking',
  'counting_fingers': 'speaking',
  'counting_steps': 'speaking',
  'counting_claps': 'speaking',
  'counting_animals': 'speaking',
  'counting_together': 'speaking',
  'counting_groups': 'speaking',
  'count_up': 'speaking',
  'review_six_seven': 'speaking',
  'review_eight_nine': 'speaking',
  'review_ten': 'speaking',
  'final_review': 'speaking',
  
  // Additional mappings for missing types
  'sharing_words': 'speaking',
  'class_activity': 'speaking',
  'individual_activity': 'speaking',
  'individual': 'speaking',
  'pair': 'speaking',
  'class': 'speaking',
  'group_activity': 'speaking',
  'movement_activity': 'speaking',
  
  // Add listening mapping
  'listening': 'speaking',
  
  // Add circle-related mappings
  'say_circle': 'speaking',
  'find_circles': 'speaking',
  'circle_objects': 'speaking',
  'draw_circle': 'speaking',
  'circle_colors': 'speaking',
  'circle_sizes': 'speaking',
  'circle_movement': 'speaking',
  'circle_counting': 'speaking',
  'circle_patterns': 'speaking',
  'circle_review': 'speaking'
};

// Valid sub-types list (for reference and validation)
export const VALID_SUB_TYPES = [
  'speaking',
  'fun_speaking',
  'sharing',
  'singing',
  'action_words',
  'action_songs',
  'follow_leader',
  'animal_actions',
  'playtime_words',
  'toy_words',
  'game_words',
  'play_areas',
  'happy_words',
  'kind_words',
  'playground_words',
  'weather_words',
  'movement_words',
  'body_parts',
  'classroom_items',
  'story_telling',
  'sharing_experiences',
  'dialogue',
  'question_answer',
  'role_play',
  'play_invitations',
  'sharing_words',
  'morning_routine',
  'activity_description',
  'cleanup_time',
  'cleanup_outside',
  'line_up',
  'game_choices',
  'play_rules',
  'playground_rules',
  'safety_words',
  'number_one',
  'number_two',
  'number_three',
  'number_four',
  'number_six',
  'number_seven',
  'number_eight',
  'number_nine',
  'number_ten',
  'counting_objects',
  'counting_actions',
  'counting_friends',
  'counting_sounds',
  'counting_colors',
  'counting_review',
  'counting_toys',
  'counting_fingers',
  'counting_steps',
  'counting_claps',
  'counting_animals',
  'counting_together',
  'counting_groups',
  'count_up',
  'review_six_seven',
  'review_eight_nine',
  'review_ten',
  'final_review',
] as const;


class InsertionLogger {
  private startTime: number

  constructor() {
    this.startTime = Date.now()
  }

  warn(data: { message: string; context?: any; source?: string }) {
    this.log('WARNING', data.message);
  }

  log(level: keyof typeof logLevels, message: string, error?: Error | PostgrestError) {
    const timestamp = new Date().toISOString()
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(2)
    
    console.log(`[${timestamp}] [${elapsed}s] [${level}] ${message}`)
    if (error) {
      console.error(error)
    }
  }
}

class DatabaseInserter {
  private supabase
  private logger
  private insertedIds: Map<string, string[]>

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey)
    this.logger = new InsertionLogger()
    this.insertedIds = new Map()
  }

  private async rollback(): Promise<void> {
    this.logger.log('WARNING', 'Starting rollback...')
    
    // Delete in reverse order to handle foreign key constraints
    const tables = Object.values(dbConfig.tables).reverse()
    
    for (const table of tables) {
      const ids = this.insertedIds.get(table) || []
      if (ids.length > 0) {
        this.logger.log('INFO', `Rolling back ${ids.length} records from ${table}`)
        const { error } = await this.supabase
          .from(table)
          .delete()
          .in('id', ids)
        
        if (error) {
          this.logger.log('ERROR', `Failed to rollback ${table}`, error)
        }
      }
    }
  }

  private trackInsertedId(table: string, id: string) {
    if (!this.insertedIds.has(table)) {
      this.insertedIds.set(table, [])
    }
    this.insertedIds.get(table)!.push(id)
  }

  async insertPP1Data() {
    try {
      // Validate data before starting
      this.validateData(pp1Data)
      this.logger.log('INFO', 'Starting data insertion...')

      // Get existing PP1 grade ID
      const { data: gradeData, error: gradeError } = await this.supabase
        .from(dbConfig.tables.grades)
        .select('id')
        .eq('name', 'PP1')
        .single()

      if (gradeError) throw new Error('Failed to find PP1 grade')
      const gradeId = gradeData.id

      // Process topics
      for (const topic of pp1Data.topics) {
        await this.processTopic(topic as Topic, gradeId)
      }

      this.logger.log('SUCCESS', 'All data inserted successfully!')
      return true
    } catch (error) {
      this.logger.log('ERROR', 'Error during insertion', error as Error)
      await this.rollback()
      throw error
    }
  }

  private async processTopic(topic: Topic, gradeId: string) {
    // Check if topic already exists
    const { data: existingTopics, error: topicError } = await this.supabase
      .from(dbConfig.tables.topics)
      .select('*')
      .eq('title', topic.title)
      .eq('grade_id', gradeId);

    if (topicError) throw topicError;

    let topicId: string;

    if (existingTopics && existingTopics.length > 0) {
      topicId = existingTopics[0].id;
      this.logger.log('INFO', `Topic "${topic.title}" already exists - checking for updates`);
      
      // Check if topic needs updating
      if (existingTopics[0].description !== topic.description || 
          existingTopics[0].order_index !== topic.order_index) {
        const { error: updateError } = await this.supabase
          .from(dbConfig.tables.topics)
          .update({
            description: topic.description,
            order_index: topic.order_index
          })
          .eq('id', topicId);

        if (updateError) throw updateError;
        this.logger.log('SUCCESS', `Topic "${topic.title}" updated`);
      }
    } else {
      // Create new topic
      topicId = uuidv4();
      const { error: insertError } = await this.supabase
        .from(dbConfig.tables.topics)
        .insert({
          id: topicId,
          title: topic.title,
          description: topic.description,
          grade_id: gradeId,
          order_index: topic.order_index
        });

      if (insertError) throw insertError;
      this.trackInsertedId(dbConfig.tables.topics, topicId);
      this.logger.log('SUCCESS', `Topic "${topic.title}" inserted`);
    }

    // Process subtopics
    for (const subtopic of topic.subtopics) {
      await this.processSubtopic(subtopic, topicId, gradeId);
    }
  }

  private async processSubtopic(subtopic: Subtopic, topicId: string, gradeId: string) {
    // Check if subtopic exists
    const { data: existingSubtopics, error: subtopicError } = await this.supabase
      .from(dbConfig.tables.subtopics)
      .select('*')
      .eq('title', subtopic.title)
      .eq('topic_id', topicId);

    if (subtopicError) throw subtopicError;

    let subtopicId: string;

    if (existingSubtopics && existingSubtopics.length > 0) {
      subtopicId = existingSubtopics[0].id;
      this.logger.log('INFO', `Subtopic "${subtopic.title}" already exists - checking for updates`);

      // Check if subtopic needs updating
      if (existingSubtopics[0].description !== subtopic.description || 
          existingSubtopics[0].order_index !== subtopic.order_index) {
        const { error: updateError } = await this.supabase
          .from(dbConfig.tables.subtopics)
          .update({
            description: subtopic.description,
            order_index: subtopic.order_index
          })
          .eq('id', subtopicId);

        if (updateError) throw updateError;
        this.logger.log('SUCCESS', `Subtopic "${subtopic.title}" updated`);
      }
    } else {
      // Create new subtopic
      subtopicId = uuidv4();
      const { error: insertError } = await this.supabase
        .from(dbConfig.tables.subtopics)
        .insert({
          id: subtopicId,
          title: subtopic.title,
          description: subtopic.description,
          topic_id: topicId,
          order_index: subtopic.order_index
        });

      if (insertError) throw insertError;
      this.trackInsertedId(dbConfig.tables.subtopics, subtopicId);
      this.logger.log('SUCCESS', `Subtopic "${subtopic.title}" inserted`);
    }

    // Process lessons
    for (const lesson of subtopic.lessons) {
      await this.processLesson(lesson, subtopicId, topicId, gradeId);
    }
  }

  private async processLesson(lesson: Lesson, subtopicId: string, topicId: string, gradeId: string) {
    // Check if lesson exists
    const { data: existingLessons, error: lessonError } = await this.supabase
      .from(dbConfig.tables.lessons)
      .select('*')
      .eq('title', lesson.title)
      .eq('subtopic_id', subtopicId);

    if (lessonError) throw lessonError;

    let lessonId: string;

    if (existingLessons && existingLessons.length > 0) {
      lessonId = existingLessons[0].id;
      this.logger.log('INFO', `Lesson "${lesson.title}" already exists - checking for updates`);

      // Check if lesson needs updating
      if (this.isLessonDifferent(existingLessons[0], lesson)) {
        const { error: updateError } = await this.supabase
          .from(dbConfig.tables.lessons)
          .update({
            description: lesson.description,
            content_type: lesson.content_type,
            duration: lesson.duration,
            difficulty: lesson.difficulty,
            metadata: lesson.metadata,
            order_index: lesson.order_index,
            content: lesson.content || null
          })
          .eq('id', lessonId);

        if (updateError) throw updateError;
        this.logger.log('SUCCESS', `Lesson "${lesson.title}" updated`);
      }
    } else {
      // Create new lesson
      lessonId = uuidv4();
      const { error: insertError } = await this.supabase
        .from(dbConfig.tables.lessons)
        .insert({
          id: lessonId,
          title: lesson.title,
          description: lesson.description,
          content_type: lesson.content_type,
          duration: lesson.duration,
          difficulty: lesson.difficulty,
          metadata: lesson.metadata,
          subtopic_id: subtopicId,
          topic_id: topicId,
          grade_id: gradeId,
          order_index: lesson.order_index,
          status: 'draft',
          content: lesson.content || null
        });

      if (insertError) throw insertError;
      this.trackInsertedId(dbConfig.tables.lessons, lessonId);
      this.logger.log('SUCCESS', `Lesson "${lesson.title}" inserted`);
    }

    // Process questions and activities
    for (const question of lesson.questions) {
      await this.processQuestion(question, lessonId);
    }

    if (lesson.activities && lesson.activities.length > 0) {
      await this.processActivities(lesson.activities, lessonId);
    }
  }

  private isLessonDifferent(existing: any, newLesson: Lesson): boolean {
    return existing.description !== newLesson.description ||
            existing.content_type !== newLesson.content_type ||
            existing.duration !== newLesson.duration ||
            existing.difficulty !== newLesson.difficulty ||
            JSON.stringify(existing.metadata) !== JSON.stringify(newLesson.metadata) ||
            existing.order_index !== newLesson.order_index ||
            existing.content !== newLesson.content;
  }

  private async processQuestion(question: Question, lessonId: string) {
    // Check if question exists
    const { data: existingQuestions, error: questionError } = await this.supabase
      .from(dbConfig.tables.questions)
      .select('*, exercise_prompts(*)')
      .eq('original_id', question.id)
      .eq('lesson_id', lessonId);

    if (questionError) throw questionError;

    let questionId: string;

    if (existingQuestions && existingQuestions.length > 0) {
      questionId = existingQuestions[0].id;
      this.logger.log('INFO', `Question "${question.title}" already exists - checking for updates`);

      // Check if question needs updating
      if (this.isQuestionDifferent(existingQuestions[0], question)) {
        const newData = {
          prompt: question.prompt,
          teacher_script: question.teacher_script,
          sample_answer: question.sample_answer
        };

        const { error: updateError } = await this.supabase
          .from(dbConfig.tables.questions)
          .update({
            title: question.title,
            content: question.content,
            type: this.mapQuestionType(question.type),
            sub_type: question.type,
            order_index: question.order_index,
            metadata: question.metadata,
            data: newData
          })
          .eq('id', questionId);

        if (updateError) throw updateError;
        this.logger.log('SUCCESS', `Question "${question.title}" updated`);
      }
    } else {
      // Create new question
      questionId = uuidv4();
      const newData = {
        prompt: question.prompt,
        teacher_script: question.teacher_script,
        sample_answer: question.sample_answer
      };

      const { error: insertError } = await this.supabase
        .from(dbConfig.tables.questions)
        .insert({
          id: questionId,
          original_id: question.id,
          title: question.title,
          content: question.content,
          type: this.mapQuestionType(question.type),
          sub_type: question.type,
          lesson_id: lessonId,
          order_index: question.order_index,
          metadata: question.metadata,
          data: newData
        });

      if (insertError) throw insertError;
      this.trackInsertedId(dbConfig.tables.questions, questionId);
      this.logger.log('SUCCESS', `Question "${question.title}" inserted`);
    }

    // Process exercise prompts
    await this.processExercisePrompts(question.exercise_prompts, questionId, lessonId);
  }

  private isQuestionDifferent(existing: any, newQuestion: Question): boolean {
    return existing.title !== newQuestion.title ||
            existing.content !== newQuestion.content ||
            existing.type !== this.mapQuestionType(newQuestion.type) ||
            existing.sub_type !== newQuestion.type ||
            existing.order_index !== newQuestion.order_index ||
            JSON.stringify(existing.metadata) !== JSON.stringify(newQuestion.metadata) ||
            existing.data?.prompt !== newQuestion.prompt ||
            existing.data?.teacher_script !== newQuestion.teacher_script ||
            existing.data?.sample_answer !== newQuestion.sample_answer;
  }

  private mapQuestionType(originalType: string): QuestionType {
    const mappedType = QUESTION_TYPE_MAPPING[originalType];
    if (!mappedType) {
      this.logger.warn({
        message: `Unknown question type "${originalType}" - defaulting to "speaking"`,
        context: { originalType },
        source: 'DatabaseInserter'
      });
      return 'speaking';
    }
    return mappedType;
  }

  private async processExercisePrompts(prompts: ExercisePrompt[], questionId: string, lessonId: string) {
    // First get existing prompts
    const { data: existingPrompts, error: fetchError } = await this.supabase
      .from(dbConfig.tables.exercise_prompts)
      .select('*')
      .eq('question_id', questionId);

    if (fetchError) throw fetchError;

    // Delete prompts that no longer exist
    if (existingPrompts?.length > 0) {
      const existingTexts = new Set(existingPrompts.map(p => p.text));
      const newTexts = new Set(prompts.map(p => p.text));
      
      const promptsToDelete = existingPrompts.filter(p => !newTexts.has(p.text));
      if (promptsToDelete.length > 0) {
        const { error: deleteError } = await this.supabase
          .from(dbConfig.tables.exercise_prompts)
          .delete()
          .in('id', promptsToDelete.map(p => p.id));

        if (deleteError) throw deleteError;
      }
    }

    // Insert or update prompts
    for (const prompt of prompts) {
      const existingPrompt = existingPrompts?.find(ep => 
        ep.text === prompt.text &&
        ep.narration === prompt.narration &&
        ep.saytext === prompt.saytext &&
        ep.order_index === prompt.order_index
      );

      if (!existingPrompt) {
        const promptId = uuidv4();
        const { error: insertError } = await this.supabase
          .from(dbConfig.tables.exercise_prompts)
          .insert({
            id: promptId,
            text: prompt.text,
            narration: prompt.narration,
            saytext: prompt.saytext,
            order_index: prompt.order_index,
            question_id: questionId,
            lesson_id: lessonId
          });

        if (insertError) throw insertError;
        this.trackInsertedId(dbConfig.tables.exercise_prompts, promptId);
        this.logger.log('SUCCESS', `Exercise prompt "${prompt.text}" inserted`);
      }
    }
  }

  private validateActivityType(type: string): boolean {
    // Convert legacy types to standard types
    const normalizedType = type
      .replace('_activity', '')
      .replace('role_play', 'individual')  // Map role_play to individual
      .replace('class_activity', 'class')
      .replace('pair_activity', 'pair')
      .replace('group_activity', 'group')
      .replace('individual_activity', 'individual');

    const validTypes = ['individual', 'pair', 'group', 'class', 'homework', 'assessment'];
    return validTypes.includes(normalizedType);
  }

  private async processActivities(activities: Activity[], lessonId: string) {
    const activityIds = activities.map(_activity => uuidv4())
    
    // Convert legacy activity types to new format
    const normalizedActivities = activities.map(activity => {
      // Map legacy types to valid enum values
      const typeMapping: Record<string, string> = {
        'class_activity': 'class',
        'individual_activity': 'individual',
        'pair_activity': 'pair',
        'group_activity': 'group',
        'role_play': 'individual',
        'movement_activity': 'individual'
      };

      return {
        ...activity,
        type: typeMapping[activity.type] || activity.type
      };
    });

    // Validate types before insertion
    normalizedActivities.forEach(activity => {
      if (!this.validateActivityType(activity.type)) {
        throw new Error(`Invalid activity type: ${activity.type}`)
      }
    })

    const { error: activityError } = await this.supabase
      .from(dbConfig.tables.activities)
      .insert(normalizedActivities.map((activity, index) => ({
        id: activityIds[index],
        title: activity.title,
        name: activity.title,
        type: activity.type,
        description: activity.description,
        instructions: activity.instructions,
        duration: activity.duration || 30,
        lesson_id: lessonId
      })))

    if (activityError) throw activityError
    activityIds.forEach(id => this.trackInsertedId(dbConfig.tables.activities, id))
    this.logger.log('SUCCESS', 'Activities inserted')
  }

  private validateQuestionType(type: string): type is ValidQuestionType {
    const mappedType = QUESTION_TYPE_MAPPING[type];
    if (!mappedType) {
      throw new ValidationError(`Invalid question type: ${type}. Valid types are: ${Object.keys(QUESTION_TYPE_MAPPING).join(', ')}`);
    }
    return true;
  }

  private validateData(data: any) {
    this.logger.log('INFO', 'Validating data...')
    
    // Validate grade data
    validators.validateString('PP1', dbConfig.validation.maxTitleLength, 'Grade name')

    // Validate topics
    for (const topic of data.topics) {
      validators.validateString(topic.title, dbConfig.validation.maxTitleLength, 'Topic title')
      validators.validateString(topic.description, dbConfig.validation.maxDescriptionLength, 'Topic description')
      validators.validateOrderIndex(topic.order_index)

      // Validate subtopics
      for (const subtopic of topic.subtopics) {
        validators.validateString(subtopic.title, dbConfig.validation.maxTitleLength, 'Subtopic title')
        validators.validateString(subtopic.description, dbConfig.validation.maxDescriptionLength, 'Subtopic description')
        validators.validateOrderIndex(subtopic.order_index)

        // Validate lessons
        for (const lesson of subtopic.lessons) {
          validators.validateString(lesson.title, dbConfig.validation.maxTitleLength, 'Lesson title')
          validators.validateString(lesson.description, dbConfig.validation.maxDescriptionLength, 'Lesson description')
          validators.validateOrderIndex(lesson.order_index)

          // Validate questions
          for (const question of lesson.questions) {
            validators.validateString(question.title, dbConfig.validation.maxTitleLength, 'Question title')
            validators.validateString(question.content, dbConfig.validation.maxDescriptionLength, 'Question content')
            validators.validateOrderIndex(question.order_index)
            this.validateQuestionType(question.type)

            // Validate exercise prompts
            for (const exercisePrompt of question.exercise_prompts) {
              validators.validateString(exercisePrompt.text, dbConfig.validation.maxDescriptionLength, 'Exercise prompt text')
              validators.validateOrderIndex(exercisePrompt.order_index)
            }
          }

          // Validate activities
          if (lesson.activities && lesson.activities.length > 0) {
            for (const activity of lesson.activities) {
              validators.validateString(activity.title, dbConfig.validation.maxTitleLength, 'Activity title')
              validators.validateString(activity.description, dbConfig.validation.maxDescriptionLength, 'Activity description')
              validators.validateOrderIndex(activity.duration)
            }
          }
        }
      }
    }

    this.logger.log('SUCCESS', 'Data validation completed')
  }

  private validateQuestion(question: Question) {
    validators.validateString(question.title, dbConfig.validation.maxTitleLength, 'Question title');
    validators.validateString(question.content, dbConfig.validation.maxDescriptionLength, 'Question content');
    
    // Validate new fields
    if (question.prompt) {
      validators.validateString(question.prompt, dbConfig.validation.maxDescriptionLength, 'Question prompt');
    }
    
    if (question.teacher_script) {
      validators.validateString(question.teacher_script, dbConfig.validation.maxDescriptionLength, 'Teacher script');
    }
    
    if (question.sample_answer) {
      validators.validateString(question.sample_answer, dbConfig.validation.maxDescriptionLength, 'Sample answer');
    }
    
    if (question.order_index !== undefined) {
      validators.validateOrderIndex(question.order_index);
    }
    this.validateQuestionType(question.type);

    // Validate exercise prompts
    for (const exercisePrompt of question.exercise_prompts) {
      this.validateExercisePrompt(exercisePrompt);
    }
  }

  private validateExercisePrompt(prompt: ExercisePrompt) {
    validators.validateString(prompt.text, dbConfig.validation.maxDescriptionLength, 'Exercise prompt text');
    validators.validateString(prompt.narration, dbConfig.validation.maxDescriptionLength, 'Exercise prompt narration');
    validators.validateString(prompt.saytext, dbConfig.validation.maxDescriptionLength, 'Exercise prompt saytext');
    validators.validateOrderIndex(prompt.order_index);
  }
}

// Replace import.meta.env with process.env
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY  // Use service role key instead of anon key

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const inserter = new DatabaseInserter(supabaseUrl, supabaseKey)

if (process.env.VITE_ENTRY_URL === process.env.VITE_ENTRY_URL) {
  inserter.insertPP1Data()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

export { DatabaseInserter }