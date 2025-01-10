"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { logger } from "@/lib/logger";
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
  const mounted = React.useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  if (!url) return null;

  if (type === 'video') {
    return (
      <video
        src={url}
        controls
        className={cn("w-full rounded-lg", className)}
        onError={(e) => {
          const error = new Error('Failed to load video');
          setError('Failed to load video');
          logger.error('Video load error', {
            context: { error, url },
            source: 'MediaPreview'
          });
          if (onError) {
            onError(error);
          }
        }}
      />
    );
  }

  return (
    <div className={cn("relative aspect-video w-full rounded-lg overflow-hidden", className)}>
      <Image
        src={url}
        alt={alt}
        fill
        className="object-cover"
        onError={(e) => {
          const error = new Error('Failed to load image');
          setError('Failed to load image');
          logger.error('Image load error', {
            context: { error, url },
            source: 'MediaPreview'
          });
          if (onError) {
            onError(error);
          }
        }}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
          {error}
        </div>
      )}
    </div>
  );
}; 