import { QUESTION_TYPES } from './constants';

export interface QuestionData {
  prompt: string;
  teacherScript: string;
  sampleAnswer?: string;
  storyPrompt?: string;
  keywords?: string[];
  hints?: string[];
  audioContent?: string;
  transcript?: string;
  questions?: string[];
  phrases?: string[];
  translations?: string[];
  options?: string[];
  correctAnswer?: number | null;
  grammarPoint?: string;
  example?: string;
}

export interface Question {
  type: string;
  data: Required<Pick<QuestionData, 'prompt' | 'teacherScript'>> & 
    Partial<Omit<QuestionData, 'prompt' | 'teacherScript'>>;
  exercisePrompts: ExercisePrompt[]; 
}

export interface ExercisePrompt {
  text: string;
  media: string;
  type: 'image' | 'gif' | 'video';
  narration: string;
  sayText: string;
}

export interface QuestionFormProps {
  question: Question;
  index: number;
  onUpdate: (index: number, updatedQuestion: Question) => void;
  onRemove: (index: number) => void;
  onAddExercisePrompt: (questionIndex: number) => void;
  onRemoveExercisePrompt: (questionIndex: number, promptIndex: number) => void;
  onExercisePromptChange: (questionIndex: number, promptIndex: number, updatedPrompt: ExercisePrompt) => void;
}