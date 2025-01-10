import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon, 
  action,
  className
}) => {
  const handleAction = () => {
    try {
      action?.onClick();
    } catch (err) {
      logger.error('Failed to execute empty state action', {
        context: { error: err },
        source: 'EmptyState'
      });
    }
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 space-y-4 bg-muted/50 rounded-lg border-2 border-dashed",
      className
    )}>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button 
          onClick={handleAction}
          disabled={action.disabled}
          variant="outline" 
          size="lg" 
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
};