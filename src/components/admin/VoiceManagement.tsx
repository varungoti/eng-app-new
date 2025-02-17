"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Mic, Play, Pause, Save, Trash2, Star } from "lucide-react";
import supabase from '@/lib/supabase/client';
import speechService from '@/lib/fish-speech';

interface Voice {
  id: string;
  name: string;
  description: string;
  language: string;
  gender: 'male' | 'female';
  sampleUrl: string;
  isDefault: boolean;
  schoolId: string;
}

interface VoiceManagementProps {
  schoolId: string;
  userRole: 'super_admin' | 'SCHOOL_LEADER' | 'SCHOOL_PRINCIPAL';
  isAdmin?: boolean;
}

export function VoiceManagement({ schoolId, userRole, isAdmin = false }: VoiceManagementProps) {
  const { toast } = useToast();
  const [voices, setVoices] = useState<Voice[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newVoice, setNewVoice] = useState({
    name: '',
    description: '',
    language: 'English',
    gender: 'female' as 'male' | 'female',
  });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Load voices from database
  const loadVoices = useCallback(async () => {
    try {
      let query = supabase
        .from('voices')
        .select('*');

      // If not super_admin, filter by school
      if (!isAdmin) {
        query = query.eq('school_id', schoolId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVoices(data || []);

      // Load default voice if exists
      const defaultVoice = data?.find(voice => voice.isDefault);
      if (defaultVoice) {
        const { data: sampleData, error: sampleError } = await supabase.storage
          .from('voice-samples')
          .download(defaultVoice.sampleUrl);

        if (sampleError) throw sampleError;
        const sampleBuffer = await sampleData.arrayBuffer();
        await speechService.setVoice(sampleBuffer);
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      toast({
        title: "Error",
        description: "Failed to load voices. Please try again.",
        variant: "destructive",
      });
    }
  }, [schoolId, isAdmin, toast]);

  useEffect(() => {
    loadVoices();
  }, [loadVoices]);

  // Handle voice recording
  const handleRecord = async () => {
    try {
      if (isRecording) {
        // Stop recording
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
      } else {
        // Start recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          try {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            audioChunksRef.current = []; // Clear chunks for next recording

            // Upload to storage
            const filename = `voices/${schoolId}/${Date.now()}-${newVoice.name.toLowerCase().replace(/\s+/g, '-')}.wav`;
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('voice-samples')
              .upload(filename, audioBlob);

            if (uploadError) throw uploadError;

            // Create voice record
            const voiceData = {
              name: newVoice.name,
              description: newVoice.description,
              language: newVoice.language,
              gender: newVoice.gender,
              sample_url: uploadData.path,
              school_id: schoolId,
              is_default: voices.length === 0, // First voice becomes default
            };

            const { error: dbError } = await supabase
              .from('voices')
              .insert([voiceData]);

            if (dbError) throw dbError;

            toast({
              title: "Success",
              description: "Voice recorded and saved successfully.",
            });

            // Reset form
            setNewVoice({
              name: '',
              description: '',
              language: 'English',
              gender: 'female' as 'male' | 'female',
            });

            // Reload voices
            loadVoices();
          } catch (error) {
            console.error('Error saving recorded voice:', error);
            toast({
              title: "Error",
              description: "Failed to save recorded voice. Please try again.",
              variant: "destructive",
            });
          }
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Error recording voice:', error);
      toast({
        title: "Error",
        description: "Failed to record voice. Please check your microphone.",
        variant: "destructive",
      });
    }
  };

  // Handle voice playback
  const handlePlayback = async (voice: Voice) => {
    try {
      if (isPlaying === voice.id) {
        // Stop playback logic
        setIsPlaying(null);
        return;
      }

      const { data: sampleData, error: sampleError } = await supabase.storage
        .from('voice-samples')
        .download(voice.sampleUrl);

      if (sampleError) throw sampleError;
      const sampleBuffer = await sampleData.arrayBuffer();
      await speechService.playAudio(sampleBuffer);
      setIsPlaying(voice.id);
    } catch (error) {
      console.error('Error playing voice:', error);
      toast({
        title: "Error",
        description: "Failed to play voice sample. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Set default voice
  const setDefaultVoice = async (voiceId: string) => {
    try {
      const { error } = await supabase
        .from('voices')
        .update({ is_default: true })
        .eq('id', voiceId)
        .eq('school_id', schoolId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Default voice updated successfully.",
      });

      loadVoices();
    } catch (error) {
      console.error('Error setting default voice:', error);
      toast({
        title: "Error",
        description: "Failed to set default voice. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete voice
  const deleteVoice = async (voiceId: string) => {
    try {
      const { error } = await supabase
        .from('voices')
        .delete()
        .eq('id', voiceId)
        .eq('school_id', schoolId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Voice deleted successfully.",
      });

      loadVoices();
    } catch (error) {
      console.error('Error deleting voice:', error);
      toast({
        title: "Error",
        description: "Failed to delete voice. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">
          {isAdmin ? 'Global Voice Management' : 'School Voice Management'}
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={handleRecord}
            variant={isRecording ? "destructive" : "default"}
            className="flex items-center gap-2"
            disabled={!newVoice.name} // Disable if no name is provided
          >
            <Mic className="h-4 w-4" />
            {isRecording ? "Stop Recording" : "Record New Voice"}
          </Button>
        </div>
      </div>

      {/* New Voice Form */}
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <label htmlFor="voice-name" className="block text-sm font-medium text-gray-700">
              Voice Name
            </label>
            <Input
              id="voice-name"
              placeholder="Enter voice name"
              value={newVoice.name}
              onChange={(e) => setNewVoice({ ...newVoice, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="voice-description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <Input
              id="voice-description"
              placeholder="Enter voice description"
              value={newVoice.description}
              onChange={(e) => setNewVoice({ ...newVoice, description: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="voice-language" className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                id="voice-language"
                value={newVoice.language}
                onChange={(e) => setNewVoice({ ...newVoice, language: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300"
                aria-label="Select voice language"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="voice-gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="voice-gender"
                value={newVoice.gender}
                onChange={(e) => setNewVoice({ ...newVoice, gender: e.target.value as 'male' | 'female' })}
                className="mt-1 block w-full rounded-md border-gray-300"
                aria-label="Select voice gender"
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>
          </div>
          {isRecording && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <span className="animate-pulse">●</span> Recording in progress...
            </div>
          )}
        </div>
      </Card>

      {/* Voice List */}
      <div className="grid gap-4">
        {voices.map((voice) => (
          <Card key={voice.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{voice.name}</h3>
                <p className="text-sm text-muted-foreground">{voice.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className="px-2 py-1 bg-primary/10 rounded-md text-xs">
                    {voice.language}
                  </span>
                  <span className="px-2 py-1 bg-primary/10 rounded-md text-xs">
                    {voice.gender}
                  </span>
                  {voice.isDefault && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded-md text-xs">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePlayback(voice)}
                >
                  {isPlaying === voice.id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                {!voice.isDefault && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDefaultVoice(voice.id)}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                {(isAdmin || userRole === 'SCHOOL_LEADER') && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteVoice(voice.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 