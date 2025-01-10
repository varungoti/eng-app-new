import React from 'react';
import { dataLoadMonitor } from '../lib/monitoring/DataLoadMonitor';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  source: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ source }) => {
  const [metrics, setMetrics] = React.useState<any[]>([]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const activeLoads = dataLoadMonitor.getActiveLoads();
      const sourceLoads = activeLoads.filter(load => load.source === source);
      setMetrics(sourceLoads);
    }, 100);

    return () => clearInterval(timer);
  }, [source]);

  if (metrics.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm w-full z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">Loading Status</h3>
        <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
      </div>
      <div className="space-y-2">
        {metrics.map((metric, index) => (
          <div key={index} className="text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{metric.operation}</span>
              <span className="text-gray-900">
                {metric.duration ? `${metric.duration.toFixed(0)}ms` : 'Loading...'}
              </span>
            </div>
            {metric.queryKey && (
              <div className="text-xs text-gray-500 mt-1">
                Query: {metric.queryKey.join(' / ')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};