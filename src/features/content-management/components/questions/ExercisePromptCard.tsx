import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ExercisePrompt } from '../../api/types';
import { MediaPreview } from '@/components/ui/media-preview';
import { cn } from '@/lib/utils';

interface ExercisePromptCardProps {
  prompt: ExercisePrompt;
  promptIndex: number;
  onRemove: () => void;
  onUpdate: (updatedPrompt: ExercisePrompt) => void;
  className?: string;
}

export const ExercisePromptCard = ({
  prompt,
  promptIndex,
  onRemove,
  onUpdate,
  className
}: ExercisePromptCardProps) => {
  const [localPrompt, setLocalPrompt] = useState(prompt);

  const handleChange = useCallback((field: keyof ExercisePrompt, value: any) => {
    const updatedPrompt = {
      ...localPrompt,
      [field]: value,
      updated_at: new Date().toISOString()
    };
    setLocalPrompt(updatedPrompt);
    onUpdate(updatedPrompt);
  }, [localPrompt, onUpdate]);

  return (
    <Card className={cn("border-l-4 border-l-primary/40 hover:border-l-primary transition-colors", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h4 className="text-sm font-medium">Exercise Prompt {promptIndex + 1}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Prompt Text */}
        <div className="space-y-2">
          <Label>Prompt Text</Label>
          <Textarea
            value={localPrompt.text}
            onChange={(e) => handleChange('text', e.target.value)}
            placeholder="Enter the exercise prompt..."
          />
        </div>

        {/* Media Type */}
        <div className="space-y-2">
          <Label>Media Type</Label>
          <Select
            value={localPrompt.type}
            onValueChange={(value: 'image' | 'gif' | 'video') => handleChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="gif">GIF</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Media URL */}
        {localPrompt.type && (
          <div className="space-y-2">
            <Label>Media URL</Label>
            <Textarea
              value={typeof localPrompt.media === 'string' ? localPrompt.media : ''}
              onChange={(e) => handleChange('media', e.target.value)}
              placeholder={`Enter ${localPrompt.type} URL...`}
            />
            {localPrompt.media && typeof localPrompt.media === 'string' && (
              <div className="mt-2">
                <MediaPreview
                  type={localPrompt.type}
                  url={localPrompt.media}
                />
              </div>
            )}
          </div>
        )}

        {/* Narration */}
        <div className="space-y-2">
          <Label>Narration</Label>
          <Textarea
            value={localPrompt.narration}
            onChange={(e) => handleChange('narration', e.target.value)}
            placeholder="Enter narration text..."
          />
        </div>

        {/* Say Text */}
        <div className="space-y-2">
          <Label>Say Text</Label>
          <Textarea
            value={localPrompt.saytext}
            onChange={(e) => handleChange('saytext', e.target.value)}
            placeholder="Enter text for the student to say..."
          />
        </div>

        {/* Difficulty Level */}
        <div className="space-y-2">
          <Label>Difficulty Level</Label>
          <Select
            value={localPrompt.metadata?.difficulty || 'beginner'}
            onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
              handleChange('metadata', {
                ...localPrompt.metadata,
                difficulty: value
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estimated Time */}
        <div className="space-y-2">
          <Label>Estimated Time (minutes)</Label>
          <Select
            value={String(localPrompt.metadata?.estimatedTime || 5)}
            onValueChange={(value) => 
              handleChange('metadata', {
                ...localPrompt.metadata,
                estimatedTime: parseInt(value)
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select estimated time" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 5, 8, 10, 15, 20, 30].map((time) => (
                <SelectItem key={time} value={String(time)}>
                  {time} minute{time !== 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}; 