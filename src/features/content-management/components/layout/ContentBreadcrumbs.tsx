import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface ContentBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const ContentBreadcrumbs = ({
  items,
  className
}: ContentBreadcrumbsProps) => {
  return (
    <ScrollArea 
      className={cn(
        "w-full rounded-lg border bg-card shadow-sm",
        "p-2 sm:p-3",
        className
      )}
    >
      <nav
        className="flex items-center space-x-1 text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        {items.map((item, index) => (
          <div 
            key={item.label} 
            className={cn(
              "flex items-center",
              "animate-fade-in",
              "transition-all duration-200"
            )}
            style={{ 
              animationDelay: `${index * 100}ms`,
              opacity: 0 
            }}
          >
            {index > 0 && (
              <ChevronRight 
                className={cn(
                  "h-4 w-4 mx-1 flex-shrink-0",
                  "text-muted-foreground/50",
                  "animate-slide-in-from-left",
                  "transition-transform duration-200",
                  "group-hover:scale-110"
                )}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className={cn(
                "h-auto px-2 py-1.5 rounded-md",
                "transition-all duration-200",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:ring-2 focus:ring-primary/20 focus:outline-none",
                "whitespace-nowrap",
                item.isActive && [
                  "bg-primary/10 text-primary font-medium",
                  "hover:bg-primary/20"
                ],
                "group"
              )}
            >
              <span className={cn(
                "transition-all duration-200",
                "group-hover:translate-x-0.5"
              )}>
                {item.label}
              </span>
            </Button>
          </div>
        ))}
      </nav>
    </ScrollArea>
  );
}; 