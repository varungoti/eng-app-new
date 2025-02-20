import { ChangeEvent, useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Button } from './button';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

export interface FileUploadProps {
  value?: string;
  type: 'image' | 'gif' | 'video';
  onChange?: (url: string) => void;
  onUploadComplete?: (url: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  accept?: string;
  maxSize?: number;
}

export function FileUpload({ 
  value = '', 
  type,
  onChange,
  onUploadComplete,
  onError,
  accept = 'image/*,video/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  className 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  // Update local state when prop changes
  useEffect(() => {
    if (mounted.current) {
      setUrlInput(value);
    }
  }, [value]);

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    try {
      if (mounted.current) {
        setUrlInput(newUrl);
        onChange?.(newUrl);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update URL');
      logger.error('URL change error', {
        context: { error },
        source: 'FileUpload'
      });
      if (onError) {
        onError(error);
      }
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onUploadComplete?.(urlInput.trim());
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter media URL"
          value={urlInput}
          onChange={handleUrlChange}
          className="flex-1"
        />
        <Button 
          onClick={handleUrlSubmit}
          disabled={isUploading || !urlInput.trim()}
        >
          Save
        </Button>
      </div>
    </div>
  );
} 