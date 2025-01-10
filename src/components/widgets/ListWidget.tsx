import React from 'react';
import Widget from './Widget';
import { LucideIcon } from 'lucide-react';

interface ListItem {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  timestamp?: string;
  status?: {
    label: string;
    color: string;
  };
}

interface ListWidgetProps {
  id: string;
  title: string;
  items: ListItem[];
  isLoading?: boolean;
  error?: string | null;
}

const ListWidget: React.FC<ListWidgetProps> = ({
  id,
  title,
  items,
  isLoading,
  error
}) => {
  return (
    <Widget id={id} title={title} isLoading={isLoading} error={error}>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
            <div className="flex items-center space-x-3">
              {item.icon && <item.icon className="h-5 w-5 text-gray-400" />}
              <div>
                <p className="text-sm font-medium text-gray-900">{item.title}</p>
                {item.subtitle && (
                  <p className="text-sm text-gray-500">{item.subtitle}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {item.timestamp && (
                <span className="text-xs text-gray-500">{item.timestamp}</span>
              )}
              {item.status && (
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status.color}`}>
                  {item.status.label}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Widget>
  );
};

export default ListWidget;