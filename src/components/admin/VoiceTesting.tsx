"use client";

import React from 'react';
import { Volume2, Pause } from 'lucide-react';
import { useVoiceTesting } from '@/hooks/useVoiceTesting';
import { useToast } from '@/components/ui/use-toast';

interface VoiceTestingProps {
  schoolId: string;
}

export function VoiceTesting({ schoolId }: VoiceTestingProps) {
  const { toast } = useToast();
  const {
    text,
    speed,
    pitch,
    isPlaying,
    selectedVoiceId,
    setText,
    setSpeed,
    setPitch,
    setSelectedVoice,
    testVoice
  } = useVoiceTesting();

  const handleTest = async () => {
    try {
      await testVoice();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to test voice",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="test-text" className="block text-sm font-medium text-gray-700">
          Test Text
        </label>
        <textarea
          id="test-text"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter text to test the voice..."
          aria-label="Text to test the voice"
        />
      </div>

      <div>
        <label htmlFor="voice-speed" className="block text-sm font-medium text-gray-700">
          Speed ({speed.toFixed(1)}x)
        </label>
        <input
          id="voice-speed"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="mt-1 block w-full"
          aria-label="Voice speed adjustment"
        />
      </div>

      <div>
        <label htmlFor="voice-pitch" className="block text-sm font-medium text-gray-700">
          Pitch ({pitch.toFixed(1)}x)
        </label>
        <input
          id="voice-pitch"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="mt-1 block w-full"
          aria-label="Voice pitch adjustment"
        />
      </div>

      <button
        type="button"
        onClick={handleTest}
        disabled={!text || isPlaying}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        aria-label="Test voice with current settings"
      >
        {isPlaying ? (
          <>
            <Pause className="h-4 w-4 mr-2" />
            Playing...
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4 mr-2" />
            Test Voice
          </>
        )}
      </button>
    </div>
  );
} 