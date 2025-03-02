import { Keyboard } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ShortcutItem {
  keys: string[];
  description: string;
}

const SHORTCUTS: Record<string, ShortcutItem[]> = {
  'General': [
    { keys: ['Ctrl', 'S'], description: 'Save current lesson' },
    { keys: ['Ctrl', 'E'], description: 'Toggle edit mode' },
    { keys: ['Ctrl', '/'], description: 'Toggle keyboard shortcuts' },
    { keys: ['Ctrl', 'H'], description: 'Toggle help tips' },
  ],
  'Navigation': [
    { keys: ['Alt', '←'], description: 'Collapse sidebar' },
    { keys: ['Alt', '→'], description: 'Expand sidebar' },
    { keys: ['Alt', 'L'], description: 'Lock/unlock sidebar' },
  ],
  'Content Editing': [
    { keys: ['Ctrl', 'Space'], description: 'Toggle content editor' },
    { keys: ['Ctrl', 'Enter'], description: 'Save content changes' },
    { keys: ['Esc'], description: 'Cancel editing' },
  ],
  'Questions & Activities': [
    { keys: ['Ctrl', 'Q'], description: 'Switch to Questions tab' },
    { keys: ['Ctrl', 'A'], description: 'Switch to Activities tab' },
    { keys: ['Ctrl', 'N'], description: 'Add new question/activity' },
  ]
};

interface KeyboardShortcutsDialogProps {
  className?: string;
}

export const KeyboardShortcutsDialog = forwardRef<HTMLButtonElement, KeyboardShortcutsDialogProps>(({
  className
}, ref) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 transition-all duration-200",
            "hover:bg-primary hover:text-primary-foreground",
            "group",
            className
          )}
        >
          <Keyboard className={cn(
            "h-4 w-4 transition-transform duration-200",
            "group-hover:scale-110"
          )} />
          <span className="hidden sm:inline">Keyboard Shortcuts</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription className="text-base">
            Use these keyboard shortcuts to quickly navigate and manage content.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="grid gap-6 py-4">
            {Object.entries(SHORTCUTS).map(([category, shortcuts], categoryIndex) => (
              <div 
                key={category}
                className={cn(
                  "animate-fade-in-up",
                  "transition-all duration-200",
                  `animation-delay-${categoryIndex * 100}`
                )}
              >
                <h3 className="font-medium text-lg mb-3 text-primary">{category}</h3>
                <div className="space-y-3">
                  {shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center justify-between text-sm",
                        "p-2 rounded-lg",
                        "hover:bg-accent/50 transition-colors duration-200",
                        "animate-fade-in-up",
                        "group",
                        `animation-delay-${(categoryIndex * 100) + (index * 50)}`
                      )}
                    >
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                        {shortcut.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <kbd
                            key={keyIndex}
                            className={cn(
                              "px-2 py-1 rounded",
                              "text-xs font-semibold",
                              "bg-primary/5 text-primary",
                              "border border-primary/20",
                              "shadow-sm",
                              "transition-all duration-200",
                              "group-hover:bg-primary/10",
                              "group-hover:border-primary/30",
                              "group-hover:scale-105"
                            )}
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
});

KeyboardShortcutsDialog.displayName = 'KeyboardShortcutsDialog'; 