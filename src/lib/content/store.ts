import { create } from 'zustand';
import { logger } from '../logger';

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
  setSelectedGrade: (id) => {
    logger.info('Setting selected grade', {
      context: { gradeId: id },
      source: 'ContentStore'
    });
    // Only reset other selections if grade changes
    set((state) => ({
      selectedGrade: id,
      selectedTopic: state.selectedGrade === id ? state.selectedTopic : undefined,
      selectedSubTopic: state.selectedGrade === id ? state.selectedSubTopic : undefined,
      selectedLesson: state.selectedGrade === id ? state.selectedLesson : undefined
    }));
  },
  setSelectedTopic: (id) => {
    logger.info('Setting selected topic', {
      context: { topicId: id },
      source: 'ContentStore'
    });
    set({ 
      selectedTopic: id, 
      selectedSubTopic: undefined, 
      selectedLesson: undefined 
    });
  },
  setSelectedSubTopic: (id) => {
    logger.info('Setting selected sub-topic', {
      context: { subTopicId: id },
      source: 'ContentStore'
    });
    set({ 
      selectedSubTopic: id, 
      selectedLesson: undefined 
    });
  },
  setSelectedLesson: (id) => {
    logger.info('Setting selected lesson', {
      context: { lessonId: id },
      source: 'ContentStore'
    });
    set({ selectedLesson: id });
  },
  reset: () => {
    logger.info('Resetting content selection', {
      source: 'ContentStore'
    });
    set({ 
      selectedGrade: undefined, 
      selectedTopic: undefined, 
      selectedSubTopic: undefined, 
      selectedLesson: undefined 
    });
  }
}));