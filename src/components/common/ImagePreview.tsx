"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

interface ImagePreviewProps {
imageUrl: string;
width?: number;
height?: number;
className?: string;
priority?: boolean;
alt?: string;
loading?: "lazy" | "eager";
}


export const ImagePreview: React.FC<ImagePreviewProps> = ({
imageUrl,
width = 400,
height = 300,
className = '',
priority = false,
alt = "Preview",
loading
}) => {
const [processedUrl, setProcessedUrl] = useState<string>('');
const [isLoading, setIsLoading] = useState(true);

const processImageWithCanvas = async (blob: Blob): Promise<Blob> => {
const img = document.createElement('img');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

return new Promise((resolve) => {
    img.onload = () => {
    // Set canvas size maintaining aspect ratio
    const aspectRatio = img.width / img.height;
    canvas.width = width;
    canvas.height = width / aspectRatio;

    if (!ctx) return resolve(blob);

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Apply image processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Enhance image
    for (let i = 0; i < data.length; i += 4) {
        // Increase contrast
        data[i] = data[i] * 1.2;     // Red
        data[i + 1] = data[i + 1] * 1.2; // Green
        data[i + 2] = data[i + 2] * 1.2; // Blue

        // Detect and remove watermark (simple threshold-based approach)
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (brightness > 240) { // Assuming watermark is light colored
        data[i] = data[i - 4] || data[i];
        data[i + 1] = data[i - 3] || data[i + 1];
        data[i + 2] = data[i - 2] || data[i + 2];
        }
    }

    ctx.putImageData(imageData, 0, 0);

    // Convert to WebP with compression
    canvas.toBlob(
        (processedBlob) => {
        resolve(processedBlob || blob);
        },
        'image/webp',
        0.8 // Compression quality (0-1)
    );
    };

    img.src = URL.createObjectURL(blob);
});
};


useEffect(() => {
    const processImage = async () => {
    if (!imageUrl) {
        setIsLoading(false);
        return;
    }

    try {
        const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: {

            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: imageUrl,
            options: {
            width,
            height,
            quality: 0.8
            }
        })
        });

        if (!response.ok) {
        throw new Error('Failed to process image');
        }

        const { processedUrl } = await response.json();
        setProcessedUrl(processedUrl);

    } catch (error) {
        console.error('Error processing image:', error);
        setProcessedUrl(imageUrl); // Fallback to original URL
    } finally {
        setIsLoading(false);
    }
    };

    processImage();
}, [imageUrl, width, height]);

if (isLoading) {
    return <Skeleton className={`w-[${width}px] h-[${height}px] ${className}`} />;
}

return (
    <Image
        src={processedUrl || imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        loading={loading}
        crossOrigin="anonymous"
    />
);
};


// useEffect(() => {
// const processImage = async () => {
//     if (!imageUrl) {
//     setIsLoading(false);
//     return;
//     }

//     try {
//     let imageBlob: Blob;

//     if (imageUrl.startsWith('http')) {
//         // For external URLs, use a proxy or direct fetch if CORS allows
//         const response = await fetch(imageUrl, {
//         mode: 'cors',
//         credentials: 'same-origin'
//         });
//         imageBlob = await response.blob();
//     } else {
//         // Clean up the path - remove 'images/' prefix if it exists
//         const cleanPath = imageUrl
//         .replace(/^\/+/, '') // Remove leading slashes
//         .replace(/^images\//, ''); // Remove 'images/' prefix if present

//         // First try to get the signed URL
//         const { data: signedURL, error: signError } = await supabase
//         .storage
//         .from('images')
//         .createSignedUrl(cleanPath, 60); // 60 seconds expiry

//         if (signError || !signedURL) {
//         throw new Error('Failed to get signed URL');
//         }

//         const response = await fetch(signedURL.signedUrl, {
//         mode: 'cors',
//         credentials: 'same-origin'
//         });
        
//         if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         imageBlob = await response.blob();
//     }

//     // Process the image
//     const processedBlob = await processImageWithCanvas(imageBlob);

//     // Create temporary URL for display
//     const tempUrl = URL.createObjectURL(processedBlob);
//     setProcessedUrl(tempUrl);

//     // Optional: Upload to Supabase in background
//     const fileName = `processed_${Date.now()}.webp`;
//     supabase.storage
//         .from('processed-images')
//         .upload(fileName, processedBlob, {
//         contentType: 'image/webp',
//         cacheControl: '3600',
//         upsert: true
//         })
//         .then(({ error }) => {
//         if (error) console.error('Background upload failed:', error);
//         });

//     } catch (error) {
//     console.error('Error processing image:', error);
//     // Use signed URL as fallback
//     if (!imageUrl.startsWith('http')) {
//         try {
//         const cleanPath = imageUrl
//             .replace(/^\/+/, '')
//             .replace(/^images\//, '');
            
//         const { data: signedURL } = await supabase
//             .storage
//             .from('images')
//             .createSignedUrl(cleanPath, 60);

//         if (signedURL) {
//             setProcessedUrl(signedURL.signedUrl);
//         } else {
//             setProcessedUrl(imageUrl);
//         }
//         } catch (fallbackError) {
//         console.error('Fallback error:', fallbackError);
//         setProcessedUrl(imageUrl);
//         }
//     } else {
//         setProcessedUrl(imageUrl);
//     }
//     } finally {
//     setIsLoading(false);
//     }
// };

// processImage();

// return () => {
//     if (processedUrl && !processedUrl.startsWith('http')) {
//     URL.revokeObjectURL(processedUrl);
//     }
// };
// }, [imageUrl, width, height]);

// if (isLoading) {
// return <Skeleton className={`w-[${width}px] h-[${height}px] ${className}`} />;
// }

// return (
// <img
//     src={processedUrl || imageUrl}
//     alt="Preview"
//     width={width}
//     height={height}
//     className={className}
//     loading={priority ? 'eager' : 'lazy'}
//     crossOrigin="anonymous"
// />
// );
// };