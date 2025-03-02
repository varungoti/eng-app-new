import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Activity, MediaItem } from '../../api/types';
import { MediaPreview } from '@/components/ui/media-preview';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityFormProps {
  activity: Activity;
  index: number;
  onUpdate: (updatedActivity: Activity) => void;
  className?: string;
}

export const ActivityForm = ({
  activity,
  index,
  onUpdate,
  className
}: ActivityFormProps) => {
  const [localActivity, setLocalActivity] = useState(activity);

  const handleChange = (field: keyof Activity | keyof Activity['data'], value: any) => {
    const updatedActivity = {
      ...localActivity,
      [field]: value
    };

    // If the field is part of the data object
    if (field in (localActivity.data || {})) {
      updatedActivity.data = {
        ...localActivity.data,
        [field]: value
      };
    }

    setLocalActivity(updatedActivity);
    onUpdate(updatedActivity);
  };

  const handleAddMedia = () => {
    const newMedia: MediaItem = {
      type: 'image',
      url: ''
    };

    handleChange('media', [...localActivity.media, newMedia]);
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = localActivity.media.filter((_, i) => i !== index);
    handleChange('media', newMedia);
  };

  const handleUpdateMedia = (index: number, field: keyof MediaItem, value: string) => {
    const newMedia = [...localActivity.media];
    newMedia[index] = {
      ...newMedia[index],
      [field]: value
    };
    handleChange('media', newMedia);
  };

  return (
    <ScrollArea className={cn("max-h-[70vh] pr-4", className)}>
      <div className="space-y-6 animate-fade-in-up">
        {/* Basic Info */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <Label>Activity Title</Label>
              <Input
                value={localActivity.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter activity title"
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
            <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <Label>Activity Type</Label>
              <Select
                value={localActivity.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger className="transition-all duration-200 focus:scale-[1.01]">
                  <SelectValue placeholder="Select activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="game">Game</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Label>Instructions</Label>
            <Textarea
              value={localActivity.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              placeholder="Enter activity instructions"
              className="min-h-[100px] transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
        </div>

        {/* Media Section */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label>Media</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddMedia}
                className="transition-all duration-200 hover:scale-105 hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Media
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {localActivity.media.map((media, mediaIndex) => (
                <div 
                  key={mediaIndex} 
                  className={cn(
                    "space-y-2 animate-fade-in-up",
                    "p-4 rounded-lg border bg-card/50",
                    "transition-all duration-200 hover:shadow-md",
                    "group"
                  )}
                  style={{ animationDelay: `${500 + (mediaIndex * 100)}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <Select
                      value={media.type}
                      onValueChange={(value: 'image' | 'gif' | 'video') => 
                        handleUpdateMedia(mediaIndex, 'type', value)
                      }
                    >
                      <SelectTrigger className="w-[150px] transition-all duration-200 focus:scale-[1.01]">
                        <SelectValue placeholder="Media type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="gif">GIF</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                      </SelectContent>
                    </Select>

                    <Input
                      value={media.url}
                      onChange={(e) => handleUpdateMedia(mediaIndex, 'url', e.target.value)}
                      placeholder={`Enter ${media.type} URL`}
                      className="flex-1 transition-all duration-200 focus:scale-[1.01]"
                    />

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedia(mediaIndex)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  {media.url && (
                    <div className="mt-2 rounded-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
                      <MediaPreview
                        type={media.type}
                        url={media.url}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Data */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea
              value={localActivity.data.prompt}
              onChange={(e) => handleChange('prompt', e.target.value)}
              placeholder="Enter activity prompt"
              className="min-h-[100px] transition-all duration-200 focus:scale-[1.01]"
            />
          </div>

          <div className="space-y-2">
            <Label>Teacher Script</Label>
            <Textarea
              value={localActivity.data.teacher_script}
              onChange={(e) => handleChange('teacher_script', e.target.value)}
              placeholder="Enter instructions for the teacher"
              className="min-h-[100px] transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};