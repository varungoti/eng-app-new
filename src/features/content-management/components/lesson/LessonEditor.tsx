import { Pencil, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { InlineEdit } from '../shared/InlineEdit';
import { SaveProgress } from '../../hooks/useLessonEditor';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface LessonEditorProps {
  lessonTitle: string;
  contentHeading: string;
  lessonContent: string;
  isContentEditorOpen: boolean;
  isEditingTitle: boolean;
  isEditingHeading: boolean;
  saveProgress: SaveProgress;
  onTitleChange: (title: string) => void;
  onHeadingChange: (heading: string) => void;
  onContentChange: (content: string) => void;
  onContentSave: (content: string) => void;
  setIsContentEditorOpen: (isOpen: boolean) => void;
  setIsEditingTitle: (isEditing: boolean) => void;
  setIsEditingHeading: (isEditing: boolean) => void;
  onSave: () => void;
  className?: string;
}

export const LessonEditor = ({
  lessonTitle,
  contentHeading,
  lessonContent,
  isContentEditorOpen,
  isEditingTitle,
  isEditingHeading,
  saveProgress,
  onTitleChange,
  onHeadingChange,
  onContentChange,
  onContentSave,
  setIsContentEditorOpen,
  setIsEditingTitle,
  setIsEditingHeading,
  onSave,
  className
}: LessonEditorProps) => {
  return (
    <Card className={cn("relative", className)}>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-4">
              <InlineEdit
                value={lessonTitle}
                onSave={onTitleChange}
                isEditing={isEditingTitle}
                setIsEditing={setIsEditingTitle}
                placeholder="Enter lesson title"
                className="text-2xl font-bold"
              />
              <Badge variant={saveProgress === 'saved' ? 'secondary' : 'outline'}>
                {saveProgress === 'saving' ? 'Saving...' : saveProgress === 'saved' ? 'Saved' : 'Draft'}
              </Badge>
            </div>
            <CardDescription>
              Create and manage your lesson content, including the main content and heading.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsContentEditorOpen(true)}
                    disabled={isContentEditorOpen}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Content
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Open the content editor to modify lesson content
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Content Editor and Display */}
        <div className="space-y-4">
          {isContentEditorOpen ? (
            <div className="border rounded-lg p-4 space-y-4">
              {/* Content Heading */}
              <div className="space-y-2">
                <Label>Content Heading</Label>
                <InlineEdit
                  value={contentHeading}
                  onSave={onHeadingChange}
                  isEditing={isEditingHeading}
                  setIsEditing={setIsEditingHeading}
                  placeholder="Add content heading"
                  className="text-base text-muted-foreground"
                />
              </div>

              {/* Rich Text Editor */}
              <div className="space-y-2">
                <Label>Lesson Content</Label>
                <RichTextEditor
                  value={lessonContent}
                  onChange={onContentChange}
                  onSave={onContentSave}
                  placeholder="Add lesson content here..."
                />
              </div>

              {/* Editor Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsContentEditorOpen(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    onContentSave(lessonContent);
                    setIsContentEditorOpen(false);
                  }}
                  disabled={saveProgress === 'saving'}
                >
                  {saveProgress === 'saving' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              {contentHeading && (
                <h3 className="text-lg font-semibold mb-4">{contentHeading}</h3>
              )}
              {lessonContent ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: lessonContent }}
                  className="min-h-[200px] p-4 rounded-lg border bg-card"
                />
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground border rounded-lg bg-muted/5">
                  <p>Click 'Edit Content' to add lesson content</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onSave}
                  disabled={saveProgress === 'saving'}
                  size="sm"
                >
                  {saveProgress === 'saving' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Lesson
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Save all lesson changes including title, heading, and content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>

      {/* Save Progress Indicator */}
      {saveProgress !== 'idle' && (
        <div className={cn(
          "absolute bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transition-all duration-200",
          saveProgress === 'saving' && "bg-background border",
          saveProgress === 'saved' && "bg-green-500 text-white",
          saveProgress === 'error' && "bg-destructive text-destructive-foreground"
        )}>
          {saveProgress === 'saving' && (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              <span className="text-sm">Saving changes...</span>
            </div>
          )}
          {saveProgress === 'saved' && (
            <div className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              <span className="text-sm">Changes saved</span>
            </div>
          )}
          {saveProgress === 'error' && (
            <div className="flex items-center gap-2">
              <X className="h-4 w-4" />
              <span className="text-sm">Error saving changes</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 