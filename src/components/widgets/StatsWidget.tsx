import React from 'react';
import { LucideIcon } from 'lucide-react';
import Widget from './Widget';

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
  _trend?: 'up' | 'down';
  _subtext?: string;
}

interface StatsWidgetProps {
  id: string;
  title: string;
  stats: StatItem[];
  isLoading?: boolean;
  error?: string | null;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({
  id,
  title,
  stats,
  isLoading,
  error
}) => {
  return (
    <Widget id={id} title={title} isLoading={isLoading} error={error}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{stat.value}</p>
                  {stat._subtext && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat._subtext}</p>
                  )}
                </div>
                <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${
                  stat._trend === 'up' ? 'text-green-500' :
                  stat._trend === 'down' ? 'text-red-500' :
                  'text-gray-400'
                }`} />
              </div>
            </div>
          );
        })}
      </div>
    </Widget>
  );
};

export default StatsWidget;