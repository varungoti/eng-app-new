import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Topic, Lesson, LessonProgress } from '@/types/learning';

interface LearningState {
  topics: Topic[];
  currentLesson: Lesson | null;
  progress: LessonProgress[];
  isLoading: boolean;
  error: Error | null;
}

type LearningAction =
  | { type: 'SET_TOPICS'; payload: Topic[] }
  | { type: 'SET_CURRENT_LESSON'; payload: Lesson }
  | { type: 'UPDATE_PROGRESS'; payload: LessonProgress }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null };

const LearningContext = createContext<{
  state: LearningState;
  dispatch: React.Dispatch<LearningAction>;
} | null>(null);

function learningReducer(state: LearningState, action: LearningAction): LearningState {
  switch (action.type) {
    case 'SET_TOPICS':
      return { ...state, topics: action.payload };
    case 'SET_CURRENT_LESSON':
      return { ...state, currentLesson: action.payload };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: state.progress.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(learningReducer, {
    topics: [],
    currentLesson: null,
    progress: [],
    isLoading: false,
    error: null,
  });

  return (
    <LearningContext.Provider value={{ state, dispatch }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
} 