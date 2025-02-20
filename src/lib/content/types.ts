export interface ContentState {
  selectedGrade?: string;
  selectedTopic?: string;
  selectedSubTopic?: string;
  selectedLesson?: string;
  setSelectedGrade: (id?: string) => void;
  setSelectedTopic: (id?: string) => void;
  setSelectedSubTopic: (id?: string) => void;
  setSelectedLesson: (id?: string) => void;
  reset: () => void;
}

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  subtopic_id: string;
  status?: 'draft' | 'published';
  questions?: any[];
  activities?: any[];
  created_at?: string;
  updated_at?: string;
  exercise_prompts?: any[];
  order_index?: number;
  lesson_id?: string;
  type?: string;
  narration?: string;
  saytext?: string;
  media?: string;
  question_id?: string;
}