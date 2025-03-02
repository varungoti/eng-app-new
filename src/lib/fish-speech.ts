// import { spawn } from 'child_process';
// import path from 'path';

// Remove FishSpeech import and use interface instead
interface VoiceConfig {
  id: string;
  sample: ArrayBuffer | string;
}

class SpeechService {
  private currentVoice: VoiceConfig | null = null;
  private audioContext: AudioContext | null = null;
  private baseUrl: string;

  constructor() {
    // Get the base URL from environment variables
    this.baseUrl = import.meta.env.VITE_API_URL || '';

    // Initialize Web Audio API context on first user interaction
    if (typeof window !== 'undefined') {
      document.addEventListener('click', () => {
        if (!this.audioContext) {
          this.audioContext = new AudioContext();
        }
      }, { once: true });
    }
  }

  // Set the current voice to use
  async setVoice(voiceSample: ArrayBuffer | string) {
    try {
      // Store voice configuration
      this.currentVoice = {
        id: Date.now().toString(),
        sample: voiceSample
      };
    } catch (error) {
      console.error('Error setting voice:', error);
      throw error;
    }
  }

  // Text to Speech
  async textToSpeech(text: string, options?: {
    speed?: number;
    pitch?: number;
    language?: string;
  }): Promise<ArrayBuffer> {
    try {
      if (!this.currentVoice) {
        throw new Error('No voice selected');
      }

      // Make API call to backend TTS service
      const response = await fetch(`${this.baseUrl}/api/tts`, {
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

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Text to Speech Error:', error);
      throw error;
    }
  }

  // Speech to Text
  async speechToText(audioBlob: Blob, language: string = 'en'): Promise<string> {
    try {
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
      return text;
    } catch (error) {
      console.error('Speech to Text Error:', error);
      throw error;
    }
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

  // Clone voice from sample
  async cloneVoice(sampleAudio: ArrayBuffer | Blob): Promise<VoiceConfig> {
    try {
      // Convert Blob to ArrayBuffer if needed
      const audioBuffer = sampleAudio instanceof Blob 
        ? await sampleAudio.arrayBuffer()
        : sampleAudio;

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
}

// Create a singleton instance
const speechService = new SpeechService();
export default speechService; 