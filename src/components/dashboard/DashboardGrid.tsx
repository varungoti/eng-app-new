import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import type { DashboardWidget } from '../../lib/features/dashboard/DashboardManager';
import { useDashboard } from '../../hooks/useDashboard';
import { Loader2 } from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  widgets: DashboardWidget[];
  onLayoutChange?: (layout: any) => void;
  isEditing?: boolean;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  onLayoutChange,
  isEditing = false
}) => {
  const { updateWidgetPosition } = useDashboard();

  const handleLayoutChange = (layout: any) => {
    if (onLayoutChange) {
      onLayoutChange(layout);
    }

    // Update widget positions in database
    layout.forEach((item: any) => {
      const { i: id, x, y, w, h } = item;
      updateWidgetPosition(id, { x, y, w, h });
    });
  };

  const layouts = {
    lg: widgets.map(widget => ({
      i: widget.id,
      x: widget.position.x,
      y: widget.position.y,
      w: widget.position.w,
      h: widget.position.h,
      minW: 2,
      minH: 2
    }))
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={100}
      isDraggable={isEditing}
      isResizable={isEditing}
      onLayoutChange={handleLayoutChange}
      margin={[16, 16]}
    >
      {widgets.map(widget => (
        <div key={widget.id} className="bg-white rounded-lg shadow-md">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{widget.title}</h3>
            <div className="h-full">
              {/* Render widget content based on type */}
              {widget.type === 'loading' ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : (
                <div>Widget content goes here</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DashboardGrid;