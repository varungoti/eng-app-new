import { Request, Response } from 'express';
import cors from 'cors';
import { supabase } from '@/lib/supabase';

// CORS configuration
const corsOptions = {
  origin: process.env.VITE_APP_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 3600
};

// Apply CORS middleware
const corsMiddleware = cors(corsOptions);

export const processImage = async (req: Request, res: Response) => {
  // Apply CORS
  await new Promise((resolve) => corsMiddleware(req, res, resolve));

  try {
    const { url, options } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Download image from Supabase or external URL
    let imageBlob: Blob;
    if (url.startsWith('http')) {
      const response = await fetch(url);
      imageBlob = await response.blob();
    } else {
      const cleanPath = url.replace(/^\/+/, '').replace(/^images\//, '');
      const { data: signedURL, error: signError } = await supabase
        .storage
        .from('images')
        .createSignedUrl(cleanPath, 60);

      if (signError || !signedURL) {
        return res.status(404).json({ error: 'Image not found' });
      }

      const response = await fetch(signedURL.signedUrl);
      imageBlob = await response.blob();
    }

    // Process image and upload to Supabase
    const fileName = `processed_${Date.now()}.webp`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('processed-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/webp',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get signed URL for processed image
    const { data: processedUrl } = await supabase
      .storage
      .from('processed-images')
      .createSignedUrl(fileName, 3600);

    return res.json({
      processedUrl: processedUrl?.signedUrl,
      success: true
    });

  } catch (error) {
    console.error('Image processing error:', error);
    return res.status(500).json({
      error: 'Failed to process image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 