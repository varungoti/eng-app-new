import { QUESTION_TYPES } from "./constants";

export type QuestionType = keyof typeof QUESTION_TYPES;

export interface BaseQuestionData {
  prompt: string;
  teacherScript: string;
}

export interface Question {
  id: string;
  title: string;
  content?: string;
  type: QuestionType;
  lesson_id: string;
  points?: number;
  data?: {
    prompt: string;
    teacherScript: string;
    sampleAnswer?: string;
  };
  metadata: {
    prompt?: string;
    // Speaking
    sampleAnswer?: string;
    
    // Storytelling
    storyPrompt?: string;
    keywords?: string[];
    hints?: string[];
    
    // Listening
    audioContent?: string;
    transcript?: string;
    questions?: string[];
    
    // Listen and Repeat
    phrases?: string[];
    translations?: string[];
    
    // Multiple Choice
    options?: string[];
    correctAnswer?: number | null;
    
    // Grammar Speaking
    grammarPoint?: string;
    example?: string;
    
    // Idiom Practice
    idiom?: string;
    meaning?: string;
    usageNotes?: string;
    
    // Look and Speak
    imageUrl?: string;
    imageCaption?: string;
    speakingPrompt?: string;
    helpfulVocabulary?: string[];
    
    // Watch and Speak
    videoUrl?: string;
    discussionPoints?: string[];
    
    // Debate
    topic?: string;
    position?: string;
    keyPoints?: string[];
    
    // Presentation
    duration?: string;
    structure?: Array<{
      title: string;
      points: string[];
    }>;
    visualAids?: Array<{
      url: string;
      description: string;
    }>;
    visualAidsInstructions?: string;

    // Matching
    matchingOptions?: Array<{
      text: string;
      correct: boolean;
    }>;

    //fill in the blank
    fillInTheBlankOptions?: Array<{
      sentence: string;
      blanks: string[];
    }>;
      
    //fill in the blank with multiple choices
    fillInTheBlankWithMultipleChoicesOptions?: Array<{
      sentence: string;
      blanks: string[];
      options: string[];
      correctAnswer: number;
      }>;
    //True or False
    trueOrFalseOptions?: Array<{
      sentence: string;
      correctAnswer: boolean;
    }>;

    //Reading Comprehension
    readingComprehensionOptions?: Array<{
      passage: string;
      questions: string[];
    }>;

    //Speaking and Writing
    speakingAndWritingOptions?: Array<{
      speakingPrompt: string;
      writingPrompt: string;
    }>;

    //Listening and Speaking
    listeningAndSpeakingOptions?: Array<{
      listeningPrompt: string;
      speakingPrompt: string;
    }>;

    //reading and speaking
    readingAndSpeakingOptions?: Array<{
      readingPrompt: string;
      speakingPrompt: string;
    }>;

    //Speaking with a partner
    speakingWithAPartnerOptions?: Array<{
      speakingPrompt: string;
      partnerPrompt: string;
    }>;
    
  };
  exercisePrompts: ExercisePrompt[];
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  status?: 'draft' | 'published';
  isDraft?: boolean;
  //data: Record<string, any>;
}

export interface ExercisePrompt {
  id: string;
  text: string;
  media: string;
  type: 'image' | 'gif' | 'video';
  narration?: string;
  saytext?: string;
  question_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ExercisePromptCardProps {
  prompt: ExercisePrompt;
  promptIndex: number;
  onUpdate: (updatedPrompt: ExercisePrompt) => void;
  onRemove: () => void;
}

export interface QuestionFormProps {
  question: Question;
  index: number;
  onUpdate: (index: number, updatedQuestion: Question) => Promise<void>;
  onRemove: (index: number) => void;
  onAddExercisePrompt: (questionIndex: number) => void;
  onRemoveExercisePrompt: (questionIndex: number, promptIndex: number) => void;
  onExercisePromptChange: (questionIndex: number, promptIndex: number, updatedPrompt: ExercisePrompt) => void;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
  created_at?: string;
  updated_at?: string;
  topics?: Topic[];
  description?: string;
  orderIndex: number;
}

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  grade_id?: string;
  topic_id?: string;
  subtopic_id: string;
  questions?: Question[];
  activities?: Activity[];
  order_index?: number;
  duration?: number;
  subjectId?: string;
  status?: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
  description?: string;
  media_type?: 'image' | 'video' | 'document';
  media_url?: string;
}

export interface Subtopic {
  id: string;
  title: string;
  description?: string;
  topic_id: string;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  name?: string;
}

export type SubTopic = Subtopic; // Alias for lowercase usage

export interface Topic {
  id: string;
  title: string;
  description?: string;
  grade_id: string;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Prompt {
  _id?: string;
  id?: string;
  prompt: string;
  created_at?: string;
  updated_at?: string;
  lessonId: string;
  description: string;
}

export interface ContentManagementData {
  grades: Grade[];
  topics: Topic[];
  subtopics: Subtopic[];
  lessons: Lesson[];
}

export interface Activity {
  id: string;
  created_at: string;
  lesson_id: string;
  title: string;
  description?: string;
  type: string;
  content?: string;
  updated_at?: string;
  name: string;
  instructions?: string;
  data?: {
    prompt: string;
    teacherScript: string;
    media: string[];
  };
  media?: Array<{
    url: string;
    type: 'image' | 'gif' | 'video';
  }>;
}

export interface QuestionTypeSelectProps {
  value: string;
  onValueChange: (type: string) => void;
}