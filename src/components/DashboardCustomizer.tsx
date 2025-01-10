import React from 'react';
import { Plus, Move, X } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import type { WidgetConfig } from '../lib/features/dashboard/DashboardManager';

interface DashboardCustomizerProps {
  onClose: () => void;
}

const AVAILABLE_WIDGETS = {
  stats: {
    name: 'Statistics',
    description: 'Display key metrics and statistics',
    defaultSize: { w: 3, h: 2 }
  },
  chart: {
    name: 'Chart',
    description: 'Visualize data with charts',
    defaultSize: { w: 4, h: 3 }
  },
  list: {
    name: 'List',
    description: 'Show a list of items or activities',
    defaultSize: { w: 3, h: 4 }
  }
};

const DashboardCustomizer: React.FC<DashboardCustomizerProps> = ({ onClose }) => {
  const { dashboard, addWidget, deleteWidget, updateWidgetPosition } = useDashboard();

  const handleAddWidget = async (type: keyof typeof AVAILABLE_WIDGETS) => {
    const widget = AVAILABLE_WIDGETS[type];
    await addWidget({
      type,
      title: `New ${widget.name}`,
      config: {},
      position: {
        x: 0,
        y: 0,
        ...widget.defaultSize
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Customize Dashboard</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-6">
            {/* Available Widgets */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Widgets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(AVAILABLE_WIDGETS).map(([type, widget]) => (
                  <button
                    key={type}
                    onClick={() => handleAddWidget(type as keyof typeof AVAILABLE_WIDGETS)}
                    className="p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Plus className="h-5 w-5 text-indigo-600" />
                      <div className="text-left">
                        <h4 className="text-sm font-medium text-gray-900">{widget.name}</h4>
                        <p className="text-sm text-gray-500">{widget.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current Widgets */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Widgets</h3>
              <div className="space-y-4">
                {dashboard?.widgets.map((widget: WidgetConfig) => (
                  <div
                    key={widget.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Move className="h-5 w-5 text-gray-400 cursor-move" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{widget.title}</h4>
                        <p className="text-sm text-gray-500">
                          {AVAILABLE_WIDGETS[widget.type as keyof typeof AVAILABLE_WIDGETS]?.name}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteWidget(widget.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCustomizer;