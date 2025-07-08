// import { spawn } from 'child_process';
// import path from 'path';

import { LocalCache, MemoryCache, CACHE_KEYS, CACHE_TTL } from './cache';

// Remove FishSpeech import and use interface instead
interface VoiceConfig {
  id: string;
  sample: ArrayBuffer | string;
}

class SpeechService {
  private currentVoice: VoiceConfig | null = null;
  private audioContext: AudioContext | null = null;
  private baseUrl: string;
  private readonly CACHE_PREFIX = 'speech:';
  private readonly VOICE_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly TTS_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor() {
    // Get the base URL from environment variables or default to current origin
    this.baseUrl = import.meta.env.VITE_API_URL || window.location.origin;

    // Initialize Web Audio API context on first user interaction
    if (typeof window !== 'undefined') {
      document.addEventListener('click', () => {
        if (!this.audioContext) {
          this.audioContext = new AudioContext();
        }
      }, { once: true });
    }
  }

  // Method to get the audio context
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  // Set the current voice to use
  async setVoice(voiceSample: ArrayBuffer | string) {
    try {
      const voiceId = Date.now().toString();
      // Store voice configuration
      this.currentVoice = {
        id: voiceId,
        sample: voiceSample
      };

      // Cache the voice configuration
      const cacheKey = `${this.CACHE_PREFIX}voice:${voiceId}`;
      LocalCache.set(cacheKey, this.currentVoice, this.VOICE_CACHE_TTL);
      MemoryCache.set(cacheKey, this.currentVoice, this.VOICE_CACHE_TTL);
    } catch (error) {
      console.error('Error setting voice:', error);
      throw error;
    }
  }

  // Text to Speech with caching
  async textToSpeech(text: string, options?: {
    speed?: number;
    pitch?: number;
    language?: string;
  }): Promise<ArrayBuffer> {
    try {
      if (!this.currentVoice) {
        // If no voice is selected, create a default voice ID
        this.currentVoice = {
          id: 'default',
          sample: new ArrayBuffer(0)
        };
      }

      // Generate cache key based on text and options
      const cacheKey = `${this.CACHE_PREFIX}tts:${this.currentVoice.id}:${text}:${JSON.stringify(options)}`;
      
      // Try to get from cache first
      const cachedAudio = LocalCache.get<ArrayBuffer>(cacheKey) || MemoryCache.get<ArrayBuffer>(cacheKey);
      if (cachedAudio) {
        return cachedAudio;
      }

      // Make API call to backend TTS service
      const endpoint = `${this.baseUrl}/api/tts`;
      console.log(`Making TTS request to: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId: this.currentVoice.id,
          options: {
            speed: options?.speed || 1.0,
            pitch: options?.pitch || 1.0,
            language: options?.language || 'en'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('TTS request failed');
      }

      const audioBuffer = await response.arrayBuffer();

      // Cache the result
      LocalCache.set(cacheKey, audioBuffer, this.TTS_CACHE_TTL);
      MemoryCache.set(cacheKey, audioBuffer, this.TTS_CACHE_TTL);

      return audioBuffer;
    } catch (error) {
      console.error('Text to Speech Error:', error);
      throw error;
    }
  }

  // Speech to Text with caching
  async speechToText(audioBlob: Blob, language: string = 'en'): Promise<string> {
    try {
      // Generate cache key based on audio hash
      const audioHash = await this.hashAudioBlob(audioBlob);
      const cacheKey = `${this.CACHE_PREFIX}stt:${audioHash}:${language}`;

      // Try to get from cache first
      const cachedText = LocalCache.get<string>(cacheKey) || MemoryCache.get<string>(cacheKey);
      if (cachedText) {
        return cachedText;
      }

      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', language);

      const response = await fetch(`${this.baseUrl}/api/stt`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('STT request failed');
      }

      const { text } = await response.json();

      // Cache the result
      LocalCache.set(cacheKey, text, CACHE_TTL.CONTENT);
      MemoryCache.set(cacheKey, text, CACHE_TTL.CONTENT);

      return text;
    } catch (error) {
      console.error('Speech to Text Error:', error);
      throw error;
    }
  }

  // Helper method to generate a hash for audio blob
  private async hashAudioBlob(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Start recording
  async startRecording(onTranscribe?: (text: string) => void): Promise<MediaRecorder> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const text = await this.speechToText(audioBlob);
        onTranscribe?.(text);
      };

      mediaRecorder.start();
      return mediaRecorder;
    } catch (error) {
      console.error('Start Recording Error:', error);
      throw error;
    }
  }

  // Play audio
  async playAudio(audioBuffer: ArrayBuffer): Promise<AudioBufferSourceNode> {
    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      const audioSource = this.audioContext.createBufferSource();
      const decodedAudio = await this.audioContext.decodeAudioData(audioBuffer);
      audioSource.buffer = decodedAudio;
      audioSource.connect(this.audioContext.destination);
      
      audioSource.start(0);
      return audioSource;
    } catch (error) {
      console.error('Play Audio Error:', error);
      throw error;
    }
  }

  // Clone voice from sample with caching
  async cloneVoice(sampleAudio: ArrayBuffer | Blob): Promise<VoiceConfig> {
    try {
      // Convert Blob to ArrayBuffer if needed
      const audioBuffer = sampleAudio instanceof Blob 
        ? await sampleAudio.arrayBuffer()
        : sampleAudio;

      // Generate cache key based on audio hash
      const audioHash = await this.hashAudioBlob(new Blob([audioBuffer]));
      const cacheKey = `${this.CACHE_PREFIX}voice:${audioHash}`;

      // Try to get from cache first
      const cachedVoice = LocalCache.get<VoiceConfig>(cacheKey) || MemoryCache.get<VoiceConfig>(cacheKey);
      if (cachedVoice) {
        this.currentVoice = cachedVoice;
        return cachedVoice;
      }

      const formData = new FormData();
      formData.append('sample', new Blob([audioBuffer]));

      const response = await fetch(`${this.baseUrl}/api/voices/clone`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Voice cloning failed');
      }

      const { id } = await response.json();
      this.currentVoice = {
        id,
        sample: audioBuffer
      };

      // Cache the result
      LocalCache.set(cacheKey, this.currentVoice, this.VOICE_CACHE_TTL);
      MemoryCache.set(cacheKey, this.currentVoice, this.VOICE_CACHE_TTL);

      return this.currentVoice;
    } catch (error) {
      console.error('Voice Cloning Error:', error);
      throw error;
    }
  }

  // Get current voice info
  getCurrentVoice(): VoiceConfig | null {
    return this.currentVoice;
  }

  // Check if a voice is loaded
  isVoiceLoaded(): boolean {
    return this.currentVoice !== null;
  }

  // Clear all speech-related caches
  clearCache(): void {
    LocalCache.clearPattern(this.CACHE_PREFIX);
    MemoryCache.clearPattern(this.CACHE_PREFIX);
  }
}

// Create a singleton instance
const speechService = new SpeechService();
export default speechService; 