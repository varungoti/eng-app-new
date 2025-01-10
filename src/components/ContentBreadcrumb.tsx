import React from 'react';
import { ChevronRight } from 'lucide-react';
import type { Grade, Topic, SubTopic, Lesson } from '../types';

interface ContentBreadcrumbProps {
  grade?: Grade;
  topic?: Topic;
  subTopic?: SubTopic;
  lesson?: Lesson;
}

const ContentBreadcrumb: React.FC<ContentBreadcrumbProps> = ({
  grade,
  topic,
  subTopic,
  lesson,
}) => {
  return (
    <nav className="flex items-center space-x-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <li>
          <div className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
            Content Library
          </div>
        </li>
        {grade && (
          <li>
            <div className="flex items-center">
              <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400" />
              <div className="ml-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
                {grade.name}
              </div>
            </div>
          </li>
        )}
        {topic && (
          <li>
            <div className="flex items-center">
              <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400" />
              <div className="ml-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
                {topic.title}
              </div>
            </div>
          </li>
        )}
        {subTopic && (
          <li>
            <div className="flex items-center">
              <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400" />
              <div className="ml-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
                {subTopic.title}
              </div>
            </div>
          </li>
        )}
        {lesson && (
          <li>
            <div className="flex items-center">
              <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400" />
              <div className="ml-2 text-sm font-semibold text-indigo-600">
                {lesson.title}
              </div>
            </div>
          </li>
        )}
      </ol>
    </nav>
  );
};

export default ContentBreadcrumb;