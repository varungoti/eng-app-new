import React from 'react';
import { LoadingBar } from './LoadingBar';
import { useLoadingState } from '../../hooks/useLoadingState';
import { usePerformanceMonitor } from '../../hooks/usePerformanceMonitor';

interface LoadingOverlayProps {
  source: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ source }) => {
  const { isLoading, loadTime } = useLoadingState(source);
  const { activeOperations, completedOperations } = usePerformanceMonitor(source);

  if (!isLoading && activeOperations.length === 0) return null;

  const calculateProgress = (startTime: number) => {
    const elapsed = performance.now() - startTime;
    // Assume operations taking longer than 5s are slow
    return Math.min((elapsed / 5000) * 100, 95);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Active Operations */}
      <div className="space-y-2 p-3 bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Loading Status</span>
          <span className="text-xs text-gray-500">
            {activeOperations.length} active operation{activeOperations.length !== 1 ? 's' : ''}
          </span>
        </div>
        {activeOperations.map(op => (
          <LoadingBar
            key={op.id}
            operation={op.operation}
            progress={calculateProgress(op.startTime)}
            duration={performance.now() - op.startTime}
            showTooltip
          />
        ))}
        
        {/* Recently Completed */}
        {completedOperations.length > 0 && (
          <div className="border-t border-gray-100 mt-3 pt-2">
            <span className="text-xs text-gray-500">Recently Completed</span>
          </div>
        )}
        {completedOperations.slice(0, 3).map(op => (
          <LoadingBar
            key={op.id}
            operation={op.operation}
            progress={100}
            duration={op.duration || 0}
            status={op.status}
            showTooltip
          />
        ))}
      </div>
    </div>
  );
};