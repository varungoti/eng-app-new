import React from 'react';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';


interface PerformanceIndicatorProps {
  source: string;
  showCompleted?: boolean;
}

export const PerformanceIndicator: React.FC<PerformanceIndicatorProps> = ({
  source,
  showCompleted = false
}) => {
  const { activeOperations, completedOperations } = usePerformanceMonitor(source);

  if (activeOperations.length === 0 && (!showCompleted || completedOperations.length === 0)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Performance Metrics</h3>
        {activeOperations.length > 0 && (
          <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
        )}
      </div>

      {/* Active Operations */}
      {activeOperations.length > 0 && (
        <div className="space-y-2 mb-4">

          <p className="text-xs font-medium text-gray-500">Active Operations</p>
          {activeOperations.map(op => (
            <div key={op.id} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{op.operation}</span>
                <span className="text-gray-900">
                  {Math.floor((performance.now() - op.startTime))}ms
                </span>
              </div>
              {op.context && (
                <div className="text-xs text-gray-500 mt-1">
                  {Object.entries(op.context).map(([key, value]) => (
                    <div key={key}>{key}: {String(value)}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Completed Operations */}
      {showCompleted && completedOperations.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500">Recent Operations</p>
          {completedOperations.slice(0, 5).map(op => (
            <div key={op.id} className="text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{op.operation}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900">{op.duration?.toFixed(0)}ms</span>
                  {op.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};