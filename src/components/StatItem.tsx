import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatItemProps {
  title: string;
  value: number;
  icon: LucideIcon;
  className?: string;
}

export const StatItem = ({ title, value, icon: Icon, className }: StatItemProps) => {
  return (
    <div className={cn('rounded-lg p-4 text-white', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}; 