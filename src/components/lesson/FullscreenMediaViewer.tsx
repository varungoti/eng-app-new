"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Minimize2, X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import SafeImage from '@/components/ui/safe-image';

interface FullscreenMediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: string;
  mediaTitle: string;
}

export function FullscreenMediaViewer({
  isOpen,
  onClose,
  mediaUrl,
  mediaType,
  mediaTitle
}: FullscreenMediaViewerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto-play when opened if it's a video
  useEffect(() => {
    if (isOpen && (mediaType === 'video' || mediaType === 'gif') && videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error("Error auto-playing video:", err);
      });
    }
  }, [isOpen, mediaType]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(true);
      setIsMuted(false);
    }
  }, [isOpen]);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <Minimize2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Media display */}
      <div className="w-[90%] h-[90%] max-w-6xl">
        {mediaType === 'image' ? (
          <div className="relative w-full h-full">
            <SafeImage
              src={mediaUrl}
              alt={mediaTitle}
              fill
              containerClassName="w-full h-full"
              className="object-contain"
              fallbackSrc="https://placehold.co/600x400?text=Image+Not+Available"
            />
          </div>
        ) : mediaType === 'video' || mediaType === 'gif' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={mediaUrl}
              controls
              className="w-full h-auto max-h-full"
              autoPlay
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Custom controls */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-4">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                onClick={togglePlayback}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 mr-2" />
                ) : (
                  <Play className="h-6 w-6 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-6 w-6 mr-2" />
                ) : (
                  <Volume2 className="h-6 w-6 mr-2" />
                )}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <p>Unsupported media type</p>
          </div>
        )}
      </div>
      
      {/* Title */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white">
        {mediaTitle}
      </div>
    </motion.div>
  );
} 