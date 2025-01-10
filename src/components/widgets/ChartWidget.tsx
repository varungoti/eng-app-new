import React from 'react';
import Widget from './Widget';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

interface ChartWidgetProps {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: ChartData;
  isLoading?: boolean;
  error?: string | null;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({
  id,
  title,
  type,
  data,
  isLoading,
  error
}) => {
  return (
    <Widget id={id} title={title} isLoading={isLoading} error={error}>
      <div className="h-64">
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <p className="text-sm font-medium mb-2">
              {type.charAt(0).toUpperCase() + type.slice(1)} Chart: {title}
            </p>
            <div className="text-xs text-gray-400">
              {data.datasets.map((dataset, i) => (
                <div key={i} className="mb-1">
                  {dataset.label}: {dataset.data.reduce((a, b) => a + b, 0)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Widget>
  );
};

export default ChartWidget;