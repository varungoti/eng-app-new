import React from 'react';
import { logger } from '../../lib/logger';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { Grade, Topic, SubTopic, Lesson } from '../../types';

interface ContentSelectionDropdownsProps {
  grades: Grade[];
  topics: Topic[];
  subTopics: SubTopic[];
  lessons: Lesson[];
  selectedGrade?: string;
  selectedTopic?: string;
  selectedSubTopic?: string;
  selectedLesson?: string;
  onGradeSelect: (gradeId: string) => void;
  onTopicSelect: (topicId: string) => void;
  onSubTopicSelect: (subTopicId: string) => void;
  onLessonSelect: (lessonId: string) => void;
  onAddTopic?: () => void;
  onAddSubTopic?: () => void;
  onAddLesson?: () => void;
  disabled?: boolean;
}

const ContentSelectionDropdowns: React.FC<ContentSelectionDropdownsProps> = ({
  grades = [],
  topics = [],
  subTopics = [],
  lessons = [],
  selectedGrade,
  selectedTopic,
  selectedSubTopic,
  selectedLesson,
  onGradeSelect,
  onTopicSelect,
  onSubTopicSelect,
  onLessonSelect,
  onAddTopic,
  onAddSubTopic,
  onAddLesson,
  disabled = false
}) => {
  // Filter topics based on selected grade
  const filteredTopics = selectedGrade 
    ? topics.filter((topic) => topic.gradeId === selectedGrade)
    : topics;
  const filteredSubTopics = subTopics.filter((subTopic) => subTopic.topicId === selectedTopic);
  const filteredLessons = lessons.filter((lesson) => lesson.subTopicId === selectedSubTopic);

  React.useEffect(() => {
    logger.debug('Content selection state updated', {
      context: {
        selectedGrade,
        selectedTopic,
        selectedSubTopic,
        filteredTopics: filteredTopics.length,
        filteredSubTopics: filteredSubTopics.length,
        filteredLessons: filteredLessons.length
      },
      source: 'ContentSelectionDropdowns'
    });
  }, [selectedGrade, selectedTopic, selectedSubTopic, filteredTopics.length, filteredSubTopics.length, filteredLessons.length]);
  
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm mb-6 sticky top-0 z-10 border border-gray-100 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Content Navigation</h3>
          <p className="text-sm text-gray-500 mt-1">Select content to view or edit</p>
        </div>
        <div className="text-sm text-gray-500">
          {selectedGrade && topics.length > 0 && `${filteredTopics.length} topics`}
        </div>
      </div>

      {/* Grade Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Grade Level
          <span className="text-red-500 ml-1">*</span>
        </label>
        <Select
          value={selectedGrade}
          onValueChange={onGradeSelect}
          disabled={disabled}
        >
          <SelectTrigger className="w-full bg-white hover:bg-gray-50 transition-colors">
            <SelectValue placeholder="Select a grade" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto bg-white">
            {grades.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 mb-2">
                No grades available
                </p>
              </div>
            )}
            {grades.map((grade) => (
              <SelectItem 
                key={grade.id} 
                value={grade.id} 
                className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
              >
                {grade.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Topic Selection */}
      {selectedGrade && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Topic
          </label>
          <Select
            value={selectedTopic}
            onValueChange={onTopicSelect}
            disabled={disabled || !selectedGrade}
          >
            <SelectTrigger className="w-full bg-white hover:bg-gray-50 transition-colors">
              <SelectValue placeholder="Select a topic" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto bg-white">
              {filteredTopics.length === 0 && (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500 mb-3">No topics available for this grade</p>
                  {onAddTopic && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onAddTopic();
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-50 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New Topic
                    </button>
                  )}
                </div>
              )}
              {filteredTopics.map((topic) => (
                <SelectItem 
                  key={topic.id} 
                  value={topic.id}
                  className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                >
                  {topic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* SubTopic Selection */}
      {selectedTopic && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Sub Topic
          </label>
          <Select
            value={selectedSubTopic}
            onValueChange={onSubTopicSelect}
            disabled={disabled || !selectedTopic}
          >
            <SelectTrigger className="w-full bg-white hover:bg-gray-50 transition-colors">
              <SelectValue placeholder="Select a sub topic" />
            </SelectTrigger>
            <SelectContent>
              {filteredSubTopics.length === 0 && (
                <div className="p-2">
                  <p className="text-sm text-gray-500 mb-2">No sub-topics available for this topic</p>
                  {onAddSubTopic && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onAddSubTopic();
                      }}
                      className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New Sub-Topic
                    </button>
                  )}
                </div>
              )}
              {filteredSubTopics.map((subTopic) => (
                <SelectItem key={subTopic.id} value={subTopic.id}>
                  {subTopic.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Lesson Selection */}
      {selectedSubTopic && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Lesson
          </label>
          <Select
            value={selectedLesson}
            onValueChange={onLessonSelect}
            disabled={disabled || !selectedSubTopic}
          >
            <SelectTrigger className="w-full bg-white hover:bg-gray-50 transition-colors">
              <SelectValue placeholder="Select a lesson" />
            </SelectTrigger>
            <SelectContent>
              {filteredLessons.length === 0 && (
                <div className="p-2">
                  <p className="text-sm text-gray-500 mb-2">No lessons available for this sub-topic</p>
                  {onAddLesson && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        onAddLesson();
                      }}
                      className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add New Lesson
                    </button>
                  )}
                </div>
              )}
              {filteredLessons.map((lesson) => (
                <SelectItem key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ContentSelectionDropdowns;