"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { logger } from '@/lib/logger';

// Utility functions defined outside the component to avoid dependency issues
const isExternalUrl = (url: string): boolean => {
  return url.startsWith('http') || url.startsWith('https');
};

const getDomain = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
};

const isDevelopment = process.env.NODE_ENV === 'development';

interface ImagePreviewProps {
imageUrl: string;
width?: number;
height?: number;
className?: string;
priority?: boolean;
alt?: string;
loading?: "lazy" | "eager";
onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
imageUrl,
width = 400,
height = 300,
className = '',
priority = false,
alt = "Preview",
loading,
onError
}) => {
const [processedUrl, setProcessedUrl] = useState<string>('');
const [isLoading, setIsLoading] = useState<boolean>(true);
const [error, setError] = useState<Error | null>(null);
const canvasRef = useRef<HTMLCanvasElement | null>(null);

// Process image using canvas to remove watermarks - memoize to prevent recreation on every render
const processImageWithCanvas = useCallback(async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
    if (!canvasRef.current) {
        const canvas = document.createElement('canvas');
        canvasRef.current = canvas;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
        reject(new Error('Cannot get canvas context'));
        return;
    }

    // Create image element for loading
    const imgElement = document.createElement('img');
    imgElement.crossOrigin = 'anonymous'; // Enable CORS for the image

    imgElement.onload = async () => {
        // Setup canvas
        const aspectRatio = imgElement.width / imgElement.height;
        canvas.width = width || 400;
        canvas.height = Math.floor(canvas.width / aspectRatio);

        // Draw original image
        ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

        // Process image to remove watermarks
        try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelData = imageData.data;

        // Basic watermark removal - detect and remove light areas that might be watermarks
        for (let i = 0; i < pixelData.length; i += 4) {
            // Calculate brightness
            const brightness = (pixelData[i] + pixelData[i + 1] + pixelData[i + 2]) / 3;

            // If very bright (potential watermark) or very dark (potential subtitle background)
            if (brightness > 240) {
            // Use neighboring pixel values if available
            if (i > 4) {
                pixelData[i] = pixelData[i - 4]; // Red
                pixelData[i + 1] = pixelData[i - 3]; // Green
                pixelData[i + 2] = pixelData[i - 2]; // Blue
            }
            }

            // Enhance image (slight contrast improvement)
            pixelData[i] = Math.min(255, pixelData[i] * 1.1);     // Red
            pixelData[i + 1] = Math.min(255, pixelData[i + 1] * 1.1); // Green
            pixelData[i + 2] = Math.min(255, pixelData[i + 2] * 1.1); // Blue
        }

        ctx.putImageData(imageData, 0, 0);

        // Convert to blob and upload to Supabase
        const processedBlob = await new Promise<Blob | null>((blobResolve) => {
            canvas.toBlob(
            (blob) => blobResolve(blob),
            'image/webp',
            0.85 // Compression quality
            );
        });

        if (!processedBlob) {
            throw new Error('Failed to create image blob');
        }

        // Generate unique filename
        const timestamp = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 10);
        const filename = `processed_${timestamp}_${randomString}.webp`;

        // Upload to Supabase storage
        const { data: _uploadData, error: uploadError } = await supabase.storage
            .from('images')
            .upload(`processed/${filename}`, processedBlob, {
            contentType: 'image/webp',
            cacheControl: '3600',
            upsert: false
            });

        if (uploadError) {
            console.warn('Failed to upload processed image:', uploadError);
            // Return canvas data URL as fallback
            resolve(canvas.toDataURL('image/webp', 0.85));
            return;
        }

        // Get public URL for the uploaded file
        const { data: publicUrlData } = supabase.storage
            .from('images')
            .getPublicUrl(`processed/${filename}`);

        resolve(publicUrlData?.publicUrl || canvas.toDataURL('image/webp', 0.85));
        } catch (err) {
        console.error('Image processing error:', err);
        // Fallback to canvas data URL
        resolve(canvas.toDataURL('image/webp', 0.85));
        }
    };

    imgElement.onerror = () => {
        console.warn('Failed to load image for processing:', imageUrl);
        reject(new Error('Failed to load image'));
    };

    // Handle CORS issues by using a proxy for external images
    if (isExternalUrl(imageUrl)) {
        // In development, use a CORS proxy or data URL
        if (isDevelopment) {
        // Try with cors-anywhere, imgproxy or another proxy of your choice
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
        imgElement.src = proxyUrl;
        } else {
        // In production, try a server-side proxy if available
        imgElement.src = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`;
        }
    } else {
        // Local or relative image
        imgElement.src = imageUrl;
    }
    });
}, [width, height]); // Only width and height are needed as dependencies now

// Handle image rendering with Next.js Image when possible
const renderRegularImage = () => {
  const imgSrc = processedUrl || imageUrl;
  const imgProps = {
    alt: alt || "Image",
    width,
    height,
    className,
    onError: (e: React.SyntheticEvent<HTMLImageElement>) => {
      logger.warn('Image load error:', {
        source: 'ImagePreview',
        context: { url: imgSrc }
      });
      if (onError) onError(e);
    }
  };

  // Use regular img tag only for data URLs or when Next.js Image can't be used
  if (imgSrc.startsWith('data:') || (isDevelopment && isExternalUrl(imgSrc))) {
    // eslint-disable-next-line @next/next/no-img-element -- Necessary for data URLs and external URLs in dev
    return <img src={imgSrc} alt={alt || "Image"} width={width} height={height} className={className} onError={imgProps.onError} />;
  }

  // Default to Next.js Image with unoptimized flag for external URLs
  try {
    return (
      <Image
        src={imgSrc}
        alt={alt || "Image"}
        width={width}
        height={height}
        className={className}
        loading={loading || (priority ? 'eager' : 'lazy')}
        unoptimized={true}
        onError={imgProps.onError}
      />
    );
  } catch (err) {
    // Fall back to regular img tag if Next.js Image fails
    // eslint-disable-next-line @next/next/no-img-element -- Fallback when Next.js Image fails
    return <img src={imgSrc} alt={alt || "Image"} width={width} height={height} className={className} onError={imgProps.onError} />;
  }
};

useEffect(() => {
    setIsLoading(true);
    setError(null);

    const processImage = async () => {
    try {
        // For external URLs in development mode with Next.js
        const _domain = getDomain(imageUrl);
        const isExternal = isExternalUrl(imageUrl);

        // Direct render (without processing) cases:
        // 1. In development with next/image for external URLs (CORS/config issues)
        if (isDevelopment && isExternal && typeof window !== 'undefined' && 'Image' in window) {
        logger.debug('Using direct image rendering for external URL in dev mode', {
            source: 'ImagePreview',
            context: { url: imageUrl }
        });
        setProcessedUrl(imageUrl);
        setIsLoading(false);
        return;
        }

        // Process the image
        const processed = await processImageWithCanvas(imageUrl);
        setProcessedUrl(processed);
    } catch (err) {
        logger.error('Image processing error:', {
        source: 'ImagePreview',
        context: { error: err, url: imageUrl }
        });
        setError(err as Error);
        setProcessedUrl(imageUrl); // Fallback to original
    } finally {
        setIsLoading(false);
    }
    };

    processImage();

    // Cleanup canvas ref when component unmounts
    return () => {
    canvasRef.current = null;
    };
}, [imageUrl, width, height, processImageWithCanvas]);

if (isLoading) {
    return <Skeleton className={className || `w-[${width}px] h-[${height}px]`} />;
}

// Handle different rendering based on environment and URL type
// Use regular img tag for:
// 1. External URLs in development (avoids Next.js config issues)
// 2. When we have a data URL from canvas
// 3. When there was an error processing
if (
    (isDevelopment && isExternalUrl(imageUrl)) ||
    processedUrl?.startsWith('data:') ||
    error
) {
    return renderRegularImage();
}

// For other cases, use Next Image if not in development
if (!isDevelopment) {
    try {
    return (
        <Image
            src={processedUrl || imageUrl}
            alt={alt || "Image"}
            width={width}
            height={height}
            className={className}
            loading={loading || (priority ? 'eager' : 'lazy')}
            onError={(e) => {
            logger.warn('Next Image error:', {
                source: 'ImagePreview',
                context: { url: processedUrl || imageUrl }
            });
            if (onError) onError(e);
            }}
            unoptimized={isExternalUrl(processedUrl || imageUrl)}
        />
    );
    } catch (e) {
    // Fallback to regular img if Next Image fails
    return renderRegularImage();
    }
}

// Default to regular img tag
return renderRegularImage();
};
