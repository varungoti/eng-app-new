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