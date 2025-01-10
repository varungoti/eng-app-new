import React from 'react';
import { Plus } from 'lucide-react';

interface WidgetOption {
  type: string;
  title: string;
  description: string;
  icon: React.ElementType;
  defaultSize: { w: number; h: number };
}

interface WidgetPickerProps {
  onSelect: (widget: WidgetOption) => void;
}

const AVAILABLE_WIDGETS: WidgetOption[] = [
  {
    type: 'metrics',
    title: 'Key Metrics',
    description: 'Display important business metrics',
    icon: Plus,
    defaultSize: { w: 3, h: 2 }
  },
  {
    type: 'chart',
    title: 'Chart',
    description: 'Visualize data with charts',
    icon: Plus,
    defaultSize: { w: 4, h: 3 }
  },
  {
    type: 'table',
    title: 'Data Table',
    description: 'Display tabular data',
    icon: Plus,
    defaultSize: { w: 6, h: 4 }
  }
];

const WidgetPicker: React.FC<WidgetPickerProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {AVAILABLE_WIDGETS.map((widget) => {
        const Icon = widget.icon;
        return (
          <button
            key={widget.type}
            onClick={() => onSelect(widget)}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 text-left"
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-6 w-6 text-indigo-600" />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{widget.title}</h3>
                <p className="text-sm text-gray-500">{widget.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default WidgetPicker;