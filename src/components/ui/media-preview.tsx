"use client";

import React, { useState } from 'react';
import { cn } from "@/lib/utils";

interface MediaPreviewProps {
  url: string;
  type?: 'image' | 'gif' | 'video';
  className?: string;
  onError?: (error: Error) => void;
  alt?: string;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  url,
  type = 'image',
  alt = 'Media preview',
  className,
  onError
}) => {
  const [error, setError] = useState<string | null>(null);

  const getProxiedUrl = (url: string) => {
    try {
      new URL(url); // Validate URL
      return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
    } catch {
      return null;
    }
  };

  const handleError = (e: any) => {
    const error = new Error('Failed to load media');
    setError('Media not available');
    if (onError) {
      onError(error);
    }
  };

  if (error || !url || !getProxiedUrl(url)) {
    return (
      <div className={cn("flex items-center justify-center bg-muted h-full", className)}>
        <span className="text-sm text-muted-foreground">
          {error || 'Invalid media URL'}
        </span>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <video
        src={url}
        controls
        className={cn("w-full h-full object-cover", className)}
        onError={handleError}
      />
    );
  }

  return (
    <img 
      src={getProxiedUrl(url) ?? ''}
      alt={alt}
      className={cn("w-full h-full object-cover", className)}
      onError={handleError}
    />
  );
};