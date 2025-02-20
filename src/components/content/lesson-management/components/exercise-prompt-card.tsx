"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
//import { Trash2, ChevronDown, ChevronRight, Image, Video, FileText, Check, X, Loader2 } from 'lucide-react';
import { APP_ICONS } from '@/lib/constants/icons';
import { ExercisePromptCardProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import React from 'react';
import { Icon } from '@/components/ui/icons';
import { ExercisePrompt } from '@/app/content-management/types';

export const ExercisePromptCard: React.FC<ExercisePromptCardProps> = ({
  prompt,
  index,
  onRemove,
  onUpdate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<'success' | 'error' | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleFieldChange = async (field: string, value: string) => {
    setIsSaving(true);
    setLastSaved(null);
    try {
      await onUpdate({
        ...prompt,
        [field]: value
      });
      if (mounted.current) {
        setLastSaved('success');
      }
    } catch (error) {
      if (mounted.current) {
        setLastSaved('error');
        logger.error('Failed to update exercise prompt', {
          context: { error, field },
          source: 'ExercisePromptCard'
        });
      }
    } finally {
      if (mounted.current) {
        setIsSaving(false);
        setTimeout(() => {
          if (mounted.current) {
            setLastSaved(null);
          }
        }, 2000);
      }
    }
  };

  const getMediaTypeIcon = (url: string) => {
    if (!url) return null;
    const extension = url.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return React.createElement(APP_ICONS.IMAGE, {
        className: "h-4 w-4"
      });
    }
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
      return React.createElement(APP_ICONS.VIDEO, {
        className: "h-4 w-4"
      });
    }
    return React.createElement(APP_ICONS.FILE_TEXT, {
      className: "h-4 w-4"
    });
  };

  const renderMediaPreview = (url: string) => {
    if (!url) return null;
    const extension = url.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return (
        <div className="relative h-[200px] rounded-lg overflow-hidden bg-muted">
          <img 
            src={url} 
            alt="Media preview" 
            className="object-contain w-full h-full"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x225?text=Invalid+Image+URL';
            }}
          />
        </div>
      );
    }
    
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
      return (
        <div className="relative h-[200px] rounded-lg overflow-hidden bg-muted">
          <video 
            src={url} 
            controls 
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.parentElement!.innerHTML = 'Invalid video URL';
            }}
          />
        </div>
      );
    }
    
    return null;
  };

  // Ensure default values for all fields
  const safePrompt = {
    ...prompt, // Spread first to get all fields
    text: prompt.text || '',
    type: prompt.type || 'text',
    narration: prompt.narration || '',
    saytext: prompt.saytext || '',
    media: prompt.media || ''
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
              {index + 1}
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
                <Icon 
                  type="phosphor"
                  name="CHEVRON_DOWN"
                  className="h-4 w-4 text-primary"
                /> : 
                <Icon 
                  type="phosphor"
                  name="CHEVRON_RIGHT"
                  className="h-4 w-4 text-primary"
                />
              }
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove()}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Icon 
                type="phosphor"
                name="TRASH_SIMPLE"
                className="h-4 w-4"
              />
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
                      {isSaving && <Icon 
                        type="phosphor"
                        name="SPINNER"
                        className="h-4 w-4 animate-spin text-primary"
                      />}
                      {lastSaved === 'success' && <Icon 
                        type="phosphor"
                        name="CHECK"
                        className="h-4 w-4 text-green-500"
                      />}
                      {lastSaved === 'error' && <Icon 
                        type="phosphor"
                        name="X"
                        className="h-4 w-4 text-destructive"
                      />}
                    </div>
                  </div>
                  <Textarea
                    value={safePrompt.text}
                    onChange={(e) => handleFieldChange('text', e.target.value)}
                    placeholder="Enter prompt text"
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Media URL</Label>
                    <div className="flex items-center gap-2">
                      {safePrompt.media && getMediaTypeIcon(safePrompt.media)}
                      {isSaving && <Icon 
                        type="phosphor"
                        name="SPINNER"
                        className="h-4 w-4 animate-spin text-primary"
                      />}
                      {lastSaved === 'success' && <Icon 
                        type="phosphor"
                        name="CHECK"
                        className="h-4 w-4 text-green-500"
                      />}
                      {lastSaved === 'error' && <Icon 
                        type="phosphor"
                        name="X"
                        className="h-4 w-4 text-destructive"
                      />}
                    </div>
                  </div>
                  <Input
                    value={safePrompt.media}
                    onChange={(e) => handleFieldChange('media', e.target.value)}
                    placeholder="Enter media URL"
                  />
                  {safePrompt.media && renderMediaPreview(safePrompt.media)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Narration</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Icon 
                        type="phosphor"
                        name="SPINNER"
                        className="h-4 w-4 animate-spin text-primary"
                      />}
                      {lastSaved === 'success' && <Icon 
                        type="phosphor"
                        name="CHECK"
                        className="h-4 w-4 text-green-500"
                      />}
                      {lastSaved === 'error' && <Icon 
                        type="phosphor"
                        name="X"
                        className="h-4 w-4 text-destructive"
                      />}
                    </div>
                  </div>
                  <Input
                    value={safePrompt.narration}
                    onChange={(e) => handleFieldChange('narration', e.target.value)}
                    placeholder="Enter narration text"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Say Text</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Icon 
                        type="phosphor"
                        name="SPINNER"
                        className="h-4 w-4 animate-spin text-primary"
                      />}
                      {lastSaved === 'success' && <Icon 
                        type="phosphor"
                        name="CHECK"
                        className="h-4 w-4 text-green-500"
                      />}
                      {lastSaved === 'error' && <Icon 
                        type="phosphor"
                        name="X"
                        className="h-4 w-4 text-destructive"
                      />}
                    </div>
                  </div>
                  <Input
                    value={safePrompt.saytext}
                    onChange={(e) => handleFieldChange('saytext', e.target.value)}
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