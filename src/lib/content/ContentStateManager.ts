import { create } from 'zustand';
import type { Grade, Topic, SubTopic, Lesson } from '../../types';

interface ContentState {
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

export const useContentStore = create<ContentState>((set) => ({
  selectedGrade: undefined,
  selectedTopic: undefined,
  selectedSubTopic: undefined,
  selectedLesson: undefined,
  setSelectedGrade: (id) => set({ selectedGrade: id, selectedTopic: undefined, selectedSubTopic: undefined, selectedLesson: undefined }),
  setSelectedTopic: (id) => set({ selectedTopic: id, selectedSubTopic: undefined, selectedLesson: undefined }),
  setSelectedSubTopic: (id) => set({ selectedSubTopic: id, selectedLesson: undefined }),
  setSelectedLesson: (id) => set({ selectedLesson: id }),
  reset: () => set({ selectedGrade: undefined, selectedTopic: undefined, selectedSubTopic: undefined, selectedLesson: undefined })
}));