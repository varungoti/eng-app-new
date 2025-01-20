import { create } from 'zustand';

interface ContentStore {
  selectedGrade: string | null;
  selectedTopic: string | null;
  selectedSubtopic: string | null;
  selectedLesson: string | null;
  setSelectedGrade: (id: string | null) => void;
  setSelectedTopic: (id: string | null) => void;
  setSelectedSubtopic: (id: string | null) => void;
  setSelectedLesson: (id: string | null) => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  selectedGrade: null,
  selectedTopic: null,
  selectedSubtopic: null,
  selectedLesson: null,
  setSelectedGrade: (id) => set({ selectedGrade: id, selectedTopic: null, selectedSubtopic: null, selectedLesson: null }),
  setSelectedTopic: (id) => set({ selectedTopic: id, selectedSubtopic: null, selectedLesson: null }),
  setSelectedSubtopic: (id) => set({ selectedSubtopic: id, selectedLesson: null }),
  setSelectedLesson: (id) => set({ selectedLesson: id }),
}));