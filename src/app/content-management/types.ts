import { QUESTION_TYPES } from "./constants";

export type QuestionType = keyof typeof QUESTION_TYPES;

export interface BaseQuestionData {
  prompt: string;
  teacherScript: string;
}

interface TextBlock {
  type: 'heading' | 'paragraph' | 'image';
  content: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  imageUrl?: string;
  altText?: string;
  format?: {
    isBold?: boolean;
    isItalic?: boolean;
    isUnderline?: boolean;
    color?: string;
    fontSize?: number;
    alignment?: 'left' | 'center' | 'right';
    indentation?: number;
    lineHeight?: number;
    marginTop?: number;
    marginBottom?: number;
  };
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
    followup_prompt: string[];
    sampleAnswer?: string;
    answer?: string;
    sub_type?: string;
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
    matching?: Array<{
      text: string;
      correct: boolean;
    }>;

    //fill in the blank
    fillInTheBlank?: Array<{
      sentence: string;
      blanks: string[];
    }>;
      
    //fill in the blank with multiple choices
    fillInTheBlankWithMultipleChoices?: Array<{
      sentence: string;
      blanks: string[];
      options: string[];
      correctAnswer: number;
      }>;
    //True or False
    trueOrFalse?: Array<{
      sentence: string;
      correctAnswer: boolean;
    }>;

    //Reading Comprehension
    readingComprehension?: Array<{
      passage: string;
      questions: string[];
    }>;

    //Speaking and Writing
    speakingAndWriting?: Array<{
      speakingPrompt: string;
      writingPrompt: string;
    }>;

    //Listening and Speaking
    listeningAndSpeaking?: Array<{
      listeningPrompt: string;
      speakingPrompt: string;
    }>;

    //reading and speaking
    readingAndSpeaking?: Array<{
      readingPrompt: string;
      speakingPrompt: string;
    }>;

    //Speaking with a partner
    speakingWithAPartner?: Array<{
      speakingPrompt: string;
      partnerPrompt: string;
    }>;

    //Action and Reaction
    actionAndReaction?: Array<{
      action: string;
      reaction: string;
    }>;

    // Action and Speaking
    actionAndSpeaking?: Array<{
      action: string;
      speakingPrompt: string;
    }>;

    //Vocabulary Practice
    vocabularyPractice?: Array<{
      word: string;
      spelling: string;
      definition: string;
      sentences: string[];
    }>;

    //spelling practice
    spellingPractice?: Array<{
      word: string;
      spelling: string;
      sentences: string[];
    }>;

    //Watch and Speak
    watchAndSpeak?: Array<{
      videoUrl: string;
      discussionPoints: string[];
      instructions: string;
    }>;

    //Look and Speak
    lookAndSpeak?: Array<{
      imageUrl: string;
      imageCaption: string;
      helpfulVocabulary: string[];
      instructions: string;
    }>;

    //idiom_practice
    idiomPractice?: Array<{
      idiom: string;
      meaning: string;
      example: string;
      usageNotes: string;
    }>; 

    
    
    items?: string[];
    sentence?: string;
    blanks?: string[];
    statement?: string;
    passage?: string | { text: TextBlock[] }[];
    answer?: string;
    response?: string | { text: TextBlock[] }[];
    speakingPrompt?: string;
    writingPrompt?: string;
    listeningPrompt?: string;
    partnerPrompt?: string;
    actionPrompt?: string;
  };
  exercisePrompts: ExercisePrompt[];
  order_index?: number;
  created_at?: string;
  updated_at?: string;
  status?: 'draft' | 'published';
  isDraft?: boolean;
  sampleAnswer?: string;
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
  onChange: (type: string) => void;
}