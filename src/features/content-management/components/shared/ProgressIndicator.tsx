import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  className?: string;
}

export const ProgressIndicator = ({
  status,
  className
}: ProgressIndicatorProps) => {
  if (status === 'idle') return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50",
        "animate-slide-in-from-bottom",
        className
      )}
    >
      <div
        className={cn(
          "px-4 py-2 rounded-lg shadow-lg",
          "transform transition-all duration-300",
          "flex items-center gap-2 min-w-[140px]",
          status === 'saving' && "bg-card border animate-pulse",
          status === 'saved' && "bg-success text-success-foreground scale-105",
          status === 'error' && "bg-destructive text-destructive-foreground scale-105"
        )}
        role="status"
        aria-live="polite"
      >
        {status === 'saving' && (
          <>
            <div 
              className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">Saving changes...</span>
          </>
        )}
        {status === 'saved' && (
          <>
            <Check className="h-4 w-4 animate-bounce" aria-hidden="true" />
            <span className="text-sm font-medium">Changes saved</span>
          </>
        )}
        {status === 'error' && (
          <>
            <X className="h-4 w-4 animate-shake" aria-hidden="true" />
            <span className="text-sm font-medium">Error saving changes</span>
          </>
        )}
      </div>
    </div>
  );
}; 