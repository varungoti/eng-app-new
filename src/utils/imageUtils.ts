"use client";

import { useState, useEffect } from 'react';

export interface ImageInfo {
  format: string;
  width: number;
  height: number;
  size: number;
}

export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  preserveTransparency?: boolean;
}

const defaultProcessingOptions: ImageProcessingOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.85,
  format: 'webp',
  preserveTransparency: true,
};

export async function processImage(
  file: File,
  options: ImageProcessingOptions = {}
): Promise<{ data: Blob; info: ImageInfo }> {
  const settings = { ...defaultProcessingOptions, ...options };
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (settings.maxWidth && width > settings.maxWidth) {
        height = Math.round((height * settings.maxWidth) / width);
        width = settings.maxWidth;
      }
      if (settings.maxHeight && height > settings.maxHeight) {
        width = Math.round((width * settings.maxHeight) / height);
        height = settings.maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Fill with white background if not preserving transparency
      if (!settings.preserveTransparency) {
        ctx!.fillStyle = '#FFFFFF';
        ctx!.fillRect(0, 0, width, height);
      }
      
      // Apply image smoothing
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
      }
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to process image'));
            return;
          }
          
          const info: ImageInfo = {
            format: settings.format || 'jpeg',
            width,
            height,
            size: blob.size
          };
          
          resolve({ data: blob, info });
        },
        `image/${settings.format}`,
        settings.quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
}

export function generateImagePlaceholder(text: string, options: {
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
} = {}): string {
  const {
    width = 200,
    height = 200,
    backgroundColor = '#f3f4f6',
    textColor = '#6b7280',
    fontSize = 40,
    borderRadius = 0
  } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = width;
  canvas.height = height;
  
  if (ctx) {
    // Background with optional border radius
    ctx.fillStyle = backgroundColor;
    if (borderRadius > 0) {
      ctx.beginPath();
      ctx.moveTo(borderRadius, 0);
      ctx.lineTo(width - borderRadius, 0);
      ctx.quadraticCurveTo(width, 0, width, borderRadius);
      ctx.lineTo(width, height - borderRadius);
      ctx.quadraticCurveTo(width, height, width - borderRadius, height);
      ctx.lineTo(borderRadius, height);
      ctx.quadraticCurveTo(0, height, 0, height - borderRadius);
      ctx.lineTo(0, borderRadius);
      ctx.quadraticCurveTo(0, 0, borderRadius, 0);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, width, height);
    }
    
    // Text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Get initials
    const initials = text
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    ctx.fillText(initials, width / 2, height / 2);
  }
  
  return canvas.toDataURL('image/png');
}

// Hook for handling remote images
export function useRemoteImage(imageUrl: string | undefined) {
  const [localUrl, setLocalUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setLocalUrl('');
      setIsLoading(false);
      return;
    }

    // If it's already a data URL or local URL, use it directly
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('/')) {
      setLocalUrl(imageUrl);
      setIsLoading(false);
      return;
    }

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        setLocalUrl(objectUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load image');
        // Fallback to placeholder
        setLocalUrl(generateImagePlaceholder(imageUrl));
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();

    // Cleanup function to revoke object URL
    return () => {
      if (localUrl.startsWith('blob:')) {
        URL.revokeObjectURL(localUrl);
      }
    };
  }, [imageUrl]);

  return { localUrl, isLoading, error };
}

// Hook for handling image preview
export function useImagePreview(file: File | null) {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    return () => {
      reader.abort();
    };
  }, [file]);

  return preview;
}

// Hook for handling remote images with processing
export function useProcessedImage(imageUrl: string | undefined, options: ImageProcessingOptions = {}) {
  const { localUrl, isLoading, error } = useRemoteImage(imageUrl);
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [processError, setProcessError] = useState<string | null>(null);

  useEffect(() => {
    if (!localUrl || error) {
      setProcessedUrl('');
      return;
    }

    const processRemoteImage = async () => {
      try {
        const response = await fetch(localUrl);
        const blob = await response.blob();
        const file = new File([blob], 'image', { type: blob.type });
        const { data } = await processImage(file, options);
        const processedObjectUrl = URL.createObjectURL(data);
        setProcessedUrl(processedObjectUrl);
        setProcessError(null);
      } catch (err) {
        setProcessError(err instanceof Error ? err.message : 'Failed to process image');
        setProcessedUrl(localUrl); // Fallback to original image
      }
    };

    processRemoteImage();

    return () => {
      if (processedUrl.startsWith('blob:')) {
        URL.revokeObjectURL(processedUrl);
      }
    };
  }, [localUrl, error, options]);

  return {
    url: processedUrl || localUrl,
    isLoading,
    error: processError || error
  };
}

/*USAGE

<ImagePreview imageUrl={imageUrl} />

or

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<ImagePreview 
imageUrl="http://example.com/image.jpg"
width={16}
height={9}
priority
className="hover:scale-105 transition-transform"
/>
</div>


*/