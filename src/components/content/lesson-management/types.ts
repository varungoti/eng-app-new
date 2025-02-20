import { QUESTION_TYPES } from './constants';
import { ExercisePrompt, Question as QuestionType, BaseQuestionData } from '@/app/content-management/types';

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
  data: Required<Pick<BaseQuestionData, 'prompt' | 'teacherScript'>> & 
    Partial<Omit<BaseQuestionData, 'prompt' | 'teacherScript'>>;
  exercisePrompts: ExercisePrompt[]; 
}

export interface QuestionFormProps {
  question: QuestionType;
  index: number;
  onUpdate: (index: number, updatedQuestion: QuestionType) => void;
  onRemove: (index: number) => void;
  onAddExercisePrompt: (questionIndex: number) => void;
  onRemoveExercisePrompt: (questionIndex: number, promptIndex: number) => void;
  onExercisePromptChange: (questionIndex: number, promptIndex: number, updatedPrompt: ExercisePrompt) => void;
}

export interface ExercisePromptCardProps {
  prompt: ExercisePrompt;
  index: number;
  onRemove: () => void;
  onUpdate: (prompt: ExercisePrompt) => void;
}