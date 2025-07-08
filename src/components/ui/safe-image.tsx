"use client";

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

// Fallback image to use when the main image fails to load
const FALLBACK_IMAGE = 'https://placehold.co/600x400?text=Image+Not+Available';

export interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  containerClassName?: string;
}

/**
 * A wrapper for Next.js Image component that handles errors and external domains gracefully
 */
export function SafeImage({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGE,
  className,
  containerClassName,
  fill = false,
  width,
  height,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(typeof src === 'string' ? src : null);
  const [isError, setIsError] = useState(false);

  // Handle image load error by switching to fallback image
  const handleError = () => {
    console.warn(`Image failed to load: ${imgSrc}`);
    setImgSrc(fallbackSrc);
    setIsError(true);
  };

  // Always set unoptimized to true for external domains
  // This bypasses Next.js Image optimization which requires domain configuration
  const isExternalUrl = typeof imgSrc === 'string' && (
    imgSrc.startsWith('http://') || 
    imgSrc.startsWith('https://') || 
    imgSrc.startsWith('//')
  );

  // Determine if we're using fill mode or explicit dimensions
  if (fill) {
    return (
      <div className={cn("relative", containerClassName)}>
        <Image
          src={imgSrc || fallbackSrc}
          alt={alt}
          className={cn(isError ? "opacity-80" : "", className)}
          fill
          onError={handleError}
          unoptimized={isExternalUrl}
          {...props}
        />
      </div>
    );
  }

  // Regular image with width and height
  return (
    <Image
      src={imgSrc || fallbackSrc}
      alt={alt}
      width={width || 300}
      height={height || 200}
      className={cn(isError ? "opacity-80" : "", className)}
      onError={handleError}
      unoptimized={isExternalUrl}
      {...props}
    />
  );
}

export default SafeImage; 