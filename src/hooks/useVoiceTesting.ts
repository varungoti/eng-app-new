import { useState, useCallback } from 'react';
import speechService from '@/lib/fish-speech';

interface VoiceTestingState {
  text: string;
  speed: number;
  pitch: number;
  isPlaying: boolean;
  selectedVoiceId: string | null;
}

export function useVoiceTesting() {
  const [state, setState] = useState<VoiceTestingState>({
    text: '',
    speed: 1.0,
    pitch: 1.0,
    isPlaying: false,
    selectedVoiceId: null,
  });

  const setText = useCallback((text: string) => {
    setState(prev => ({ ...prev, text }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed }));
  }, []);

  const setPitch = useCallback((pitch: number) => {
    setState(prev => ({ ...prev, pitch }));
  }, []);

  const setSelectedVoice = useCallback((voiceId: string) => {
    setState(prev => ({ ...prev, selectedVoiceId: voiceId }));
  }, []);

  const testVoice = useCallback(async () => {
    try {
      if (!state.selectedVoiceId || !state.text) {
        throw new Error('Please select a voice and enter text to test');
      }

      setState(prev => ({ ...prev, isPlaying: true }));

      // Generate audio using Fish Speech
      const audio = await speechService.textToSpeech(state.text, {
        speed: state.speed,
        pitch: state.pitch
      });

      // Play the audio
      await speechService.playAudio(audio);

      setState(prev => ({ ...prev, isPlaying: false }));
    } catch (error) {
      console.error('Error testing voice:', error);
      setState(prev => ({ ...prev, isPlaying: false }));
      throw error;
    }
  }, [state.selectedVoiceId, state.text, state.speed, state.pitch]);

  return {
    text: state.text,
    speed: state.speed,
    pitch: state.pitch,
    isPlaying: state.isPlaying,
    selectedVoiceId: state.selectedVoiceId,
    setText,
    setSpeed,
    setPitch,
    setSelectedVoice,
    testVoice,
  };
} 