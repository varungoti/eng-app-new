import React from 'react';
import { Book, Plus, Edit, Trash2, ChevronDown } from 'lucide-react';
import type { Grade, Topic, SubTopic, Lesson } from '../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { cn } from '../lib/utils';

interface ContentNavigationProps {
  mode?: 'view' | 'edit';
  grades: Grade[];
  topics: Topic[];
  subTopics: SubTopic[];
  lessons: Lesson[];
  selectedGrade?: string;
  selectedTopic?: string;
  selectedSubTopic?: string;
  selectedLesson?: string;
  onSelectGrade: (gradeId: string) => void;
  onSelectTopic: (topicId: string) => void;
  onSelectSubTopic: (subTopicId: string) => void;
  onSelectLesson: (lessonId: string) => void;
  onAddTopic: () => void;
  onEditTopic: (topic: Topic) => void;
  onDeleteTopic: (id: string) => void;
  onAddSubTopic: () => void;
  onEditSubTopic: (subTopic: SubTopic) => void;
  onDeleteSubTopic: (id: string) => void;
  onAddLesson: () => void;
  onEditLesson: (lesson: Lesson) => void;
  onDeleteLesson: (id: string) => void;
}

const ContentNavigation: React.FC<ContentNavigationProps> = ({
  mode = 'view',
  grades,
  topics,
  subTopics,
  lessons,
  selectedGrade,
  selectedTopic,
  selectedSubTopic,
  selectedLesson,
  onSelectGrade,
  onSelectTopic,
  onSelectSubTopic,
  onSelectLesson,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onAddSubTopic,
  onEditSubTopic,
  onDeleteSubTopic,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}) => {
  return (
    <div className="w-80 bg-white overflow-y-auto flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4 space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Content Navigation</h2>
          <p className="mt-1 text-sm text-gray-500">
            {mode === 'edit' ? 'Manage your educational content' : 'Browse available content'}
          </p>
          <div className="mt-4">
            <Select
              value={selectedGrade || ''}
              onValueChange={(value) => {
                onSelectGrade(value);
                onSelectTopic('');
                onSelectSubTopic('');
                onSelectLesson('');
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {selectedGrade && (
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Topics
              </span>
              {mode === 'edit' && (
                <button
                  onClick={onAddTopic}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="space-y-1">
              {topics
                .filter((topic) => topic.gradeId === selectedGrade)
                .map((topic) => (
                  <div
                    key={topic.id}
                    className={cn(
                      "group relative flex items-center py-2 px-3 rounded-md transition-colors cursor-pointer",
                      selectedTopic === topic.id 
                        ? "bg-indigo-50 text-indigo-900" 
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => onSelectTopic(topic.id)}
                  >
                    <ChevronDown className={cn(
                      "h-4 w-4 shrink-0 transition-transform",
                      selectedTopic === topic.id && "rotate-180"
                    )} />
                    <span className="flex-1 ml-2 text-left text-sm font-medium">
                      {topic.title}
                    </span>
                    {mode === 'edit' && (
                      <div className="hidden group-hover:flex items-center space-x-1 absolute right-2">
                        <button
                          onClick={() => onEditTopic(topic)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTopic(topic.id)}
                          className="p-1 text-red-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {selectedTopic && (
          <div className="mt-6 space-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Sub Topics
              </span>
              {mode === 'edit' && (
                <button
                  onClick={onAddSubTopic}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="space-y-1 pl-4">
              {subTopics
                .filter((subTopic) => subTopic.topicId === selectedTopic)
                .map((subTopic) => (
                  <div
                    key={subTopic.id}
                    className={cn(
                      "group relative flex items-center py-2 px-3 rounded-md transition-colors cursor-pointer",
                      selectedSubTopic === subTopic.id 
                        ? "bg-indigo-50 text-indigo-900" 
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => onSelectSubTopic(subTopic.id)}
                  >
                    <ChevronDown className={cn(
                      "h-4 w-4 shrink-0 transition-transform",
                      selectedSubTopic === subTopic.id && "rotate-180"
                    )} />
                    <span className="flex-1 ml-2 text-left text-sm font-medium">
                      {subTopic.title}
                    </span>
                    {mode === 'edit' && (
                      <div className="hidden group-hover:flex items-center space-x-1 absolute right-2">
                        <button
                          onClick={() => onEditSubTopic(subTopic)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSubTopic(subTopic.id)}
                          className="p-1 text-red-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {selectedSubTopic && (
          <div className="mt-6 space-y-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Lessons
              </span>
              {mode === 'edit' && (
                <button
                  onClick={onAddLesson}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
            <div className="space-y-1 pl-8">
              {lessons
                .filter((lesson) => lesson.subtopicId === selectedSubTopic)
                .map((lesson) => (
                  <div
                    key={lesson.id}
                    className={cn(
                      "group relative flex items-center py-2 px-3 rounded-md transition-colors cursor-pointer",
                      selectedLesson === lesson.id 
                        ? "bg-indigo-50 text-indigo-900" 
                        : "hover:bg-gray-50"
                    )}
                    onClick={() => onSelectLesson(lesson.id)}
                  >
                    <span className="flex-1 text-left text-sm font-medium">
                      {lesson.title}
                    </span>
                    {mode === 'edit' && (
                      <div className="hidden group-hover:flex items-center space-x-1 absolute right-2">
                        <button
                          onClick={() => onEditLesson(lesson)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteLesson(lesson.id)}
                          className="p-1 text-red-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default ContentNavigation;