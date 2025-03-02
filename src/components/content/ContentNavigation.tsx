
import React from 'react';
import { ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import type { Grade, Topic, SubTopic, Lesson } from '../../types';

interface ContentNavigationProps {
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

export default function ContentNavigation({
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
}: ContentNavigationProps) {
  return (
    <div className="w-80 bg-white overflow-y-auto flex flex-col">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-900">Content Navigation</h2>
          <p className="mt-1 text-sm text-gray-500">Browse and manage content</p>
        </div>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {/* Grades List */}
        <div className="w-1/4 bg-gray-50">
          <div className="p-4 border-b">
            <h2 className="text-sm font-medium text-gray-700">Grade Levels</h2>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <div className="space-y-1 p-2">
              {grades.map((grade) => (
                <button
                  title={grade.name}
                  aria-label={grade.name}
                  type="button"
                  key={grade.id}
                  onClick={() => onSelectGrade(grade.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md text-sm",
                    selectedGrade === grade.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  {grade.name}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Topics List */}
        {selectedGrade && (
          <div className="w-1/4 bg-white">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-sm font-medium text-gray-700">Topics</h2>
              <button 
                title="Add Topic"
                aria-label="Add Topic"
                type="button"
                onClick={onAddTopic}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-1 p-2">
                {topics
                  .filter(topic => topic.grade_id === selectedGrade)
                  .map((topic) => (
                    <div
                      key={topic.id}
                      className={cn(
                        "group relative flex items-center px-3 py-2 rounded-md text-sm",
                        selectedTopic === topic.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <button
                        title={topic.title}
                        aria-label={topic.title}
                        type="button"
                        onClick={() => onSelectTopic(topic.id)}
                        className="flex-1 text-left"
                      >
                        {topic.title}
                      </button>
                      <div className="hidden group-hover:flex items-center space-x-2">
                        <button
                          title="Edit Topic"
                          aria-label="Edit Topic"
                          type="button"
                          onClick={() => onEditTopic(topic)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          title="Delete Topic"
                          aria-label="Delete Topic"
                          type="button"
                          onClick={() => onDeleteTopic(topic.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* SubTopics List */}
        {selectedTopic && (
          <div className="w-1/4 bg-gray-50">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-sm font-medium text-gray-700">Sub-topics</h2>
              <button 
                title="Add Sub-topic"
                aria-label="Add Sub-topic"
                type="button"
                onClick={onAddSubTopic}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-1 p-2">
                {subTopics
                  .filter(subTopic => subTopic.topicId === selectedTopic)
                  .map((subTopic) => (
                    <div
                      key={subTopic.id}
                      className={cn(
                        "group relative flex items-center px-3 py-2 rounded-md text-sm",
                        selectedSubTopic === subTopic.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <button
                        title={subTopic.title}
                        aria-label={subTopic.title}
                        type="button"
                        onClick={() => onSelectSubTopic(subTopic.id)}
                        className="flex-1 text-left"
                      >
                        {subTopic.title}
                      </button>
                      <div className="hidden group-hover:flex items-center space-x-2">
                        <button
                          title="Edit Sub-topic"
                          aria-label="Edit Sub-topic"
                          type="button"
                          onClick={() => onEditSubTopic(subTopic)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          title="Delete Sub-topic"
                          aria-label="Delete Sub-topic"
                          type="button"
                          onClick={() => onDeleteSubTopic(subTopic.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Lessons List */}
        {selectedSubTopic && (
          <div className="w-1/4 bg-white">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-sm font-medium text-gray-700">Lessons</h2>
              <button 
                title="Add Lesson"
                aria-label="Add Lesson"
                type="button"
                onClick={onAddLesson}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Plus className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-1 p-2">
                {lessons
                  .filter(lesson => lesson.subtopic_id === selectedSubTopic)
                  .map((lesson) => (
                    <div
                      key={lesson.id}
                      className={cn(
                        "group relative flex items-center px-3 py-2 rounded-md text-sm",
                        selectedLesson === lesson.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <button
                        title={lesson.title}
                        aria-label={lesson.title}
                        type="button"
                        onClick={() => onSelectLesson(lesson.id)}
                        className="flex-1 text-left"
                      >
                        {lesson.title}
                      </button>
                      <div className="hidden group-hover:flex items-center space-x-2">
                        <button
                          title="Edit Lesson"
                          aria-label="Edit Lesson"
                          type="button"
                          onClick={() => onEditLesson(lesson)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button
                          title="Delete Lesson"
                          aria-label="Delete Lesson"
                          type="button"
                          onClick={() => onDeleteLesson(lesson.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </nav>
    </div>
  );
}
