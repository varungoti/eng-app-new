import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import type { Topic } from '../../types';

interface TopicSelectProps {
  topics: Topic[];
  selectedTopic?: string;
  onSelect: (topicId: string) => void;
  disabled?: boolean;
}

const TopicSelect: React.FC<TopicSelectProps> = ({
  topics,
  selectedTopic,
  onSelect,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select Topic
      </label>
      <Select
        value={selectedTopic}
        onValueChange={onSelect}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a topic" />
        </SelectTrigger>
        <SelectContent>
          {topics.map((topic) => (
            <SelectItem key={topic.id} value={topic.id}>
              {topic.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TopicSelect;