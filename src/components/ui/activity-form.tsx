import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useRef, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface Activity {
  instructions: string;
  media: {
    url: string;
    type: 'image' | 'gif' | 'video';
    caption?: string;
  }[];
}

interface ActivityFormProps {
  activity: Activity;
  index: number;
  onRemove: () => void;
  onChange: (activity: Activity) => void;
  onError?: (error: Error) => void;
}

const handleFileUpload = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    return null;
  }
};

export const ActivityForm: React.FC<ActivityFormProps> = ({
  activity,
  index,
  onRemove,
  onChange,
  onError
}) => {
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleFieldChange = (field: string, value: string) => {
    try {
      if (mounted.current) {
        onChange({
          ...activity,
          [field]: value
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update activity');
      logger.error('Failed to update activity field', {
        context: { error, field, index },
        source: 'ActivityForm'
      });
      if (onError) {
        onError(error);
      }
      toast.error(error.message);
    }
  };

  const handleMediaChange = (index: number, field: string, value: string) => {
    try {
      if (mounted.current) {
        const newMedia = [...activity.media];
        newMedia[index] = {
          ...newMedia[index],
          [field]: value
        };
        onChange({
          ...activity,
          media: newMedia
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update media');
      logger.error('Failed to update media field', {
        context: { error, mediaIndex: index, field },
        source: 'ActivityForm'
      });
      if (onError) {
        onError(error);
      }
      toast.error(error.message);
    }
  };

  const handleMediaRemove = (index: number) => {
    try {
      if (mounted.current) {
        const newMedia = activity.media.filter((_, i) => i !== index);
        onChange({
          ...activity,
          media: newMedia
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove media');
      logger.error('Failed to remove media', {
        context: { error, mediaIndex: index },
        source: 'ActivityForm'
      });
      if (onError) {
        onError(error);
      }
      toast.error(error.message);
    }
  };

  const handleMediaAdd = () => {
    try {
      if (mounted.current) {
        onChange({
          ...activity,
          media: [
            ...activity.media,
            { url: '', type: 'image' }
          ]
        });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to add media');
      logger.error('Failed to add media', {
        context: { error },
        source: 'ActivityForm'
      });
      if (onError) {
        onError(error);
      }
      toast.error(error.message);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium">Activity {index + 1}</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Instructions</Label>
          <Textarea 
            value={activity.instructions}
            onChange={(e) => handleFieldChange('instructions', e.target.value)}
            placeholder="Enter activity instructions here..."
            className="min-h-[100px]"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Media Files</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleMediaAdd}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Media
            </Button>
          </div>
          {activity.media.map((media, mediaIndex) => (
            <div key={mediaIndex} className="border rounded-lg p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Media File</Label>
                  <FileUpload
                    value={media.url}
                    type={media.type}
                    onFileSelect={async (file: File) => {
                      try {
                        const url = await handleFileUpload(file);
                        if (url && mounted.current) {
                          handleMediaChange(mediaIndex, 'url', url);
                        }
                      } catch (err) {
                        const error = err instanceof Error ? err : new Error('Failed to upload file');
                        logger.error('Failed to upload file', {
                          context: { error, mediaIndex },
                          source: 'ActivityForm'
                        });
                        if (onError) {
                          onError(error);
                        }
                        toast.error(error.message);
                      }
                    }}
                    onUrlChange={(url) => handleMediaChange(mediaIndex, 'url', url)}
                    onClear={() => handleMediaChange(mediaIndex, 'url', '')}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Caption</Label>
                  <Input 
                    value={media.caption || ''}
                    onChange={(e) => handleMediaChange(mediaIndex, 'caption', e.target.value)}
                    placeholder="Enter media caption..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Media Type</Label>
                  <Select
                    value={media.type}
                    onValueChange={(value: 'image' | 'gif' | 'video') => {
                      handleMediaChange(mediaIndex, 'type', value);
                    }}
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};