import React from 'react';
import { useErrorMetrics } from '../../hooks/useErrorMetrics';
import { AlertTriangle, BarChart2, RefreshCw } from 'lucide-react';

export const ErrorMetricsDisplay: React.FC = () => {
  const metrics = useErrorMetrics();

  if (metrics.total === 0) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Error Metrics</h3>
        <span className="text-sm text-gray-500">
          Last {metrics.timeWindow / 1000 / 60} minutes
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Errors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.total}
              </p>
            </div>
            <AlertTriangle className={`h-8 w-8 ${
              metrics.total > 10 ? 'text-red-500' : 'text-yellow-500'
            }`} />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Error Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.errorRate.toFixed(2)}/s
              </p>
            </div>
            <BarChart2 className={`h-8 w-8 ${
              metrics.errorRate > 1 ? 'text-red-500' : 'text-yellow-500'
            }`} />
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Retry Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {metrics.averageRetryCount.toFixed(1)}x
              </p>
            </div>
            <RefreshCw className={`h-8 w-8 ${
              metrics.averageRetryCount > 2 ? 'text-red-500' : 'text-yellow-500'
            }`} />
          </div>
        </div>
      </div>

      {/* Error Sources */}
      {Object.keys(metrics.errorsBySource).length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Error Sources</h4>
          <div className="space-y-2">
            {Object.entries(metrics.errorsBySource)
              .sort(([, a], [, b]) => b - a)
              .map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{source}</span>
                  <span className="text-sm font-medium text-gray-900">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};