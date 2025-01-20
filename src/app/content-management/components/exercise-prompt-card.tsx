"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  ImageIcon,
  Video as VideoIcon,
  FileTextIcon,
  Check,
  X,
  Loader2
} from 'lucide-react';
import { ExercisePromptCardProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MediaPreview } from '@/components/ui/media-preview';

interface ExercisePrompt {
  type: 'image' | 'video' | 'gif';
  text: string;
  media: string;
  narration?: string;
  saytext?: string;
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ExercisePromptProps {
  prompt: ExercisePrompt;
  promptIndex: number;
  onUpdate: (updatedPrompt: ExercisePrompt) => void;
  onRemove: () => void;
}

// Initialize with default values
const defaultPrompt: ExercisePrompt = {
  id: '',  // Will be set when saved
  text: '',
  media: '',
  narration: '',
  saytext: '',
  type: 'image',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export function ExercisePromptCard({
  prompt = defaultPrompt,
  promptIndex,
  onUpdate,
  onRemove
}: ExercisePromptCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<'success' | 'error' | null>(null);

  const handleFieldChange = async (field: string, value: string) => {
    setIsSaving(true);
    setLastSaved(null);
    try {
      await onUpdate({
        ...prompt,
        [field]: value
      });
      setLastSaved('success');
    } catch (error) {
      setLastSaved('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setLastSaved(null), 2000);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    onUpdate({
      ...prompt,
      text: newContent
    });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    onUpdate({
      ...prompt,
      media: newUrl
    });
  };

  const getMediaTypeIcon = (url: string) => {
    if (!url) return null;
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <ImageIcon className="h-4 w-4" />;
    }
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
      return <VideoIcon className="h-4 w-4" />;
    }
    return <FileTextIcon className="h-4 w-4" />;
  };

  const getMediaType = (url: string): 'image' | 'video' | 'gif' => {
    const extension = url.split('.').pop()?.toLowerCase();
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
      return 'video';
    }
    if (extension === 'gif') {
      return 'gif';
    }
    return 'image';
  };

  const renderMediaPreview = (url: string) => {
    if (!url) return null;
    
    return (
      <div className="relative h-[200px] rounded-lg overflow-hidden bg-muted">
        <MediaPreview
          url={url}
          type={getMediaType(url)}
          className="w-full h-full"
          onError={(error) => {
            console.error('Media preview error:', error);
          }}
        />
      </div>
    );
  };

  return (
    <Card className={cn(
      "border-l-4 transition-colors duration-200",
      isExpanded ? "border-l-primary" : "border-l-primary/40 hover:border-l-primary"
    )}>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
              {promptIndex + 1}
            </span>
            <span className="text-sm text-muted-foreground line-clamp-1">
              {prompt.text || 'No prompt text'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-accent"
            >
              {isExpanded ? 
                <ChevronDown className="h-4 w-4 text-primary" /> : 
                <ChevronRight className="h-4 w-4 text-primary" />
              }
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove()}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Prompt Text</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                      {lastSaved === 'success' && <Check className="h-4 w-4 text-green-500" />}
                      {lastSaved === 'error' && <X className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                  <Input
                    value={prompt.text || ''}
                    onChange={handleContentChange}
                    placeholder="Enter prompt content"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Media URL</Label>
                    <div className="flex items-center gap-2">
                      {getMediaTypeIcon(prompt.media)}
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                      {lastSaved === 'success' && <Check className="h-4 w-4 text-green-500" />}
                      {lastSaved === 'error' && <X className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                  <Input
                    value={prompt.media || ''}
                    onChange={handleUrlChange}
                    placeholder="Enter media URL"
                  />
                  {prompt.media && renderMediaPreview(prompt.media)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Narration</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                      {lastSaved === 'success' && <Check className="h-4 w-4 text-green-500" />}
                      {lastSaved === 'error' && <X className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                  <Input
                    value={prompt.narration}
                    onChange={(e) => handleFieldChange('narration', e.target.value)}
                    placeholder="Enter narration text"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Say Text</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                      {lastSaved === 'success' && <Check className="h-4 w-4 text-green-500" />}
                      {lastSaved === 'error' && <X className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                  <Input
                    value={prompt.saytext}
                    onChange={(e) => handleFieldChange('sayText', e.target.value)}
                    placeholder="Enter text to say"
                  />
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
} 