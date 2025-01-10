import type { Tables } from './mappers';
import type { Grade, Topic, SubTopic, Lesson } from '../../types';

export interface ContentState {
  grades: Grade[];
  topics: Topic[];
  subTopics: SubTopic[];
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
}

export interface ContentActions {
  upsertTopic: (topic: Partial<Topic>) => Promise<Topic | null>;
  upsertSubTopic: (subTopic: Partial<SubTopic>) => Promise<SubTopic | null>;
  upsertLesson: (lesson: Partial<Lesson>) => Promise<Lesson | null>;
  deleteTopic: (id: string) => Promise<void>;
  deleteSubTopic: (id: string) => Promise<void>;
  deleteLesson: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}