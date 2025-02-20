"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, HomeIcon, Minimize2, Maximize2, Volume2, MessageCircle, Clock, Video } from 'lucide-react';
import { ExercisePromptCardProps } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { ImageIcon, PlayCircle, FileText } from 'lucide-react';
import { Icon } from '@/components/ui/icons';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type ExercisePromptType =  'image' | 'video' | 'audio' ;

// Add interface for the prompt structure
interface ExercisePrompt {
  id?: string;
  text: string;
  type: ExercisePromptType;
  media?: string | null;
  narration?: string | null;
  saytext?: string | null;
  question_id?: string | null;
  order_index: number;
  created_at?: string;
  updated_at?: string;
  metadata: { estimatedTime: number };
}

interface ViewModeProps {
  prompt: ExercisePrompt;
  promptIndex: number;
  onStart?: () => void;
  onWatch?: () => void;
  onListen?: () => void;
  onHelp?: () => void;
}

const ViewMode: React.FC<ViewModeProps> = ({ prompt, promptIndex }) => {
  const [isMediaExpanded, setIsMediaExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 ease-in-out transform hover:-translate-y-1">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 opacity-0 group-hover:opacity-100 animate-gradient-xy transition-opacity duration-500" />
        
        <CardHeader className="relative overflow-hidden backdrop-blur-md">
          {/* Floating badge with shine effect */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 left-4 z-10"
          >
            <Badge 
              variant="outline" 
              className="relative overflow-hidden bg-background/80 backdrop-blur-sm border-primary/20 px-3 py-1 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent"
            >
              Exercise {promptIndex + 1}
            </Badge>
          </motion.div>

          {/* Media Section with hover effects */}
          {prompt.media && (
            <motion.div 
              layoutId={`media-${prompt.id}`}
              className={cn(
                "relative rounded-lg overflow-hidden group/media",
                isMediaExpanded ? "h-[400px]" : "h-[200px]"
              )}
            >
              {prompt.type === 'image' && (
                <div className="relative overflow-hidden">
                  <img
                    src={prompt.media}
                    alt={prompt.text}
                    className="w-full h-full object-cover transition-all duration-500 group-hover/media:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              {prompt.type === 'video' && (
                <div className="relative">
                  <video
                    src={prompt.media}
                    controls
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              
              {/* Floating control button with hover effect */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-white transform hover:scale-110 transition-all duration-300 ease-out"
                onClick={() => setIsMediaExpanded(!isMediaExpanded)}
              >
                {isMediaExpanded ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          )}

          {/* Main Content with animated underline */}
          <div className={cn("space-y-4", prompt.media && "mt-4")}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <CardTitle className="text-xl font-semibold leading-tight relative inline-block">
                {prompt.text}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </CardTitle>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Narration Section with hover lift effect */}
          {prompt.narration && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group/narration"
            >
              <div className="relative p-4 rounded-lg border border-primary/10 bg-background/50 backdrop-blur-sm transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Volume2 className="h-4 w-4 animate-pulse" />
                  <h4 className="font-medium">Narration</h4>
                </div>
                <p className="text-muted-foreground relative z-10">{prompt.narration}</p>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-lg opacity-0 group-hover/narration:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          )}

          {/* Say Text Section with floating effect */}
          {prompt.saytext && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group/saytext"
            >
              <div className="relative p-4 rounded-lg border border-primary/10 bg-background/50 backdrop-blur-sm transform transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <MessageCircle className="h-4 w-4 group-hover/saytext:animate-bounce" />
                  <h4 className="font-medium">Say Text</h4>
                </div>
                <p className="text-muted-foreground">{prompt.saytext}</p>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg opacity-0 group-hover/saytext:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          )}

          {/* Add action buttons with the new animated style */}
          <div className="flex items-center gap-4 pt-4">
            <button className="animated-button">
              <span className="animated-button-content">
                <PlayCircle className="h-5 w-5" />
                Start Exercise
              </span>
            </button>
            
            {prompt.type === 'video' && (
              <button className="animated-button">
                <span className="animated-button-content">
                  <Video className="h-5 w-5" />
                  Watch Tutorial
                </span>
              </button>
            )}
            
            {prompt.narration && (
              <button className="animated-button">
                <span className="animated-button-content">
                  <Volume2 className="h-5 w-5" />
                  Listen
                </span>
              </button>
            )}
          </div>
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Progress</span>
              <span className="text-sm font-medium text-primary">0%</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </CardContent>

        {/* Interactive footer with stats or metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-6 pb-6 pt-0 flex items-center justify-between text-sm text-muted-foreground"
        >
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {prompt.created_at && new Date(prompt.created_at).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-4">
            {prompt.type && (
              <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10 transition-colors duration-300">
                {prompt.type}
              </Badge>
            )}
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export const ExercisePromptCard: React.FC<ExercisePromptCardProps> = ({
  prompt,
  promptIndex,
  onRemove,
  onUpdate,
  viewMode = false,
  onStart,
  onWatch,
  onListen,
  onHelp
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
    if (field === 'type' && !['text', 'image', 'video', 'audio', 'practice', 'exercise'].includes(value)) {
      console.error('Invalid type value:', value);
      return;
    }
    
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
      return <ImageIcon className="h-4 w-4" />;
    }
    if (['mp4', 'webm', 'ogg'].includes(extension || '')) {
      return <PlayCircle className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
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

  // Update the safePrompt initialization with more thorough defaults
  const safePrompt: ExercisePrompt = {
    ...prompt,
    id: prompt?.id || undefined,
    text: prompt?.text || '',
    type: (prompt?.type as ExercisePromptType) || 'practice',
    media: prompt?.media || '',
    narration: prompt?.narration || '',
    saytext: prompt?.saytext || '',
    question_id: prompt?.question_id || null,
    order_index: promptIndex,
    metadata: { estimatedTime: prompt?.metadata?.estimatedTime || 5 }
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
              {safePrompt.text || 'No prompt text'}
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
              onClick={onRemove}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Icon type="phosphor" name="TRASH_SIMPLE" className="h-4 w-4" />
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
                      {isSaving && <Icon type="phosphor" name="SPINNER" className="h-4 w-4 animate-spin text-primary" />}
                      {lastSaved === 'success' && <Icon type="phosphor" name="CHECK" className="h-4 w-4 text-green-500" />}
                      {lastSaved === 'error' && <Icon type="phosphor" name="X" className="h-4 w-4 text-destructive" />}
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
                      {isSaving && <Icon type="phosphor" name="SPINNER" className="h-4 w-4 animate-spin text-primary" />}
                      {lastSaved === 'success' && <Icon type="phosphor" name="CHECK" className="h-4 w-4 text-green-500" />}
                      {lastSaved === 'error' && <Icon type="phosphor" name="X" className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                  <Input
                    value={safePrompt.media || ''}
                    onChange={(e) => handleFieldChange('media', e.target.value)}
                    placeholder="Enter media URL"
                  />
                  {safePrompt.media && renderMediaPreview(safePrompt.media)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Narration</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Icon type="phosphor" name="SPINNER" className="h-4 w-4 animate-spin text-primary" />}
                      {lastSaved === 'success' && <Icon type="phosphor" name="CHECK" className="h-4 w-4 text-green-500" />}
                      {lastSaved === 'error' && <Icon type="phosphor" name="X" className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                  <Input
                    value={safePrompt.narration || ''}
                    onChange={(e) => handleFieldChange('narration', e.target.value)}
                    placeholder="Enter narration text"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Say Text</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Icon type="phosphor" name="SPINNER" className="h-4 w-4 animate-spin text-primary" />}
                      {lastSaved === 'success' && <Icon type="phosphor" name="CHECK" className="h-4 w-4 text-green-500" />}
                      {lastSaved === 'error' && <Icon type="phosphor" name="X" className="h-4 w-4 text-destructive" />}
                    </div>
                  </div>
                  <Input
                    value={safePrompt.saytext || ''}
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
}; 