import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, HelpCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ContentHeaderProps {
  showHelpTips: boolean;
  onToggleHelpTips: () => void;
  onRefresh: () => void;
  isViewMode?: boolean;
  onToggleViewMode?: () => void;
  saveProgress?: 'idle' | 'saving' | 'saved' | 'error';
  children?: ReactNode;
  className?: string;
}

export const ContentHeader = ({
  showHelpTips,
  onToggleHelpTips,
  onRefresh,
  isViewMode,
  onToggleViewMode,
  saveProgress,
  children,
  className
}: ContentHeaderProps) => {
  return (
    <div className={cn(
      "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
      "p-4 sm:p-6 rounded-lg border bg-card shadow-sm",
      "transition-all duration-200 hover:shadow-md",
      className
    )}>
      {/* Left Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href="/dashboard" className="self-start">
          <Button 
            variant="outline" 
            className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </Link>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Lesson Management
            </h1>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onRefresh}
                      className="h-8 w-8 hover:bg-primary/10 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Refresh lesson content</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {saveProgress && saveProgress !== 'idle' && (
                <Badge variant={
                  saveProgress === 'saved' 
                    ? 'success' 
                    : saveProgress === 'error' 
                      ? 'destructive' 
                      : 'outline'
                } className="animate-fade-in">
                  {saveProgress === 'saving' ? 'Saving...' : saveProgress === 'saved' ? 'Saved' : 'Error'}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage your educational content with ease
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* View/Edit Mode Toggle */}
        {typeof isViewMode !== 'undefined' && onToggleViewMode && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleViewMode}
                  className={cn(
                    "gap-2 transition-all duration-200",
                    isViewMode 
                      ? "hover:bg-primary hover:text-primary-foreground" 
                      : "hover:bg-destructive hover:text-destructive-foreground"
                  )}
                >
                  {isViewMode ? (
                    <>
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">View Mode</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit Mode</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isViewMode ? 'Switch to edit mode' : 'Switch to view mode'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Help Tips Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleHelpTips}
                className={cn(
                  "gap-2 transition-all duration-200",
                  showHelpTips 
                    ? "hover:bg-primary hover:text-primary-foreground" 
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {showHelpTips ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span className="hidden sm:inline">Hide Tips</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Show Tips</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {showHelpTips ? 'Hide help tips' : 'Show help tips'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Additional Content */}
        {children}
      </div>
    </div>
  );
}; 