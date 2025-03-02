"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Mic,
  Volume2,
  Play,
  Pause,
  AudioWaveform as Waveform,
  ArrowRight,
  ArrowDown,
  Circle,
  CheckCircle,
  XCircle,
  RefreshCw,

  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PronunciationTrainerProps {
  word: string;
  phonetics: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  syllables: string[];
  stressPattern: number[];
  audioUrl?: string;
  onProgress: (progress: PronunciationProgress) => void;
}

interface PronunciationProgress {
  accuracy: number;
  phonemeScores: { [key: string]: number };
  stressAccuracy: number;
  intonationAccuracy: number;
  fluencyScore: number;
  areas: {
    strengths: string[];
    improvements: string[];
  };
}

interface PhonemeVisualization {
  phoneme: string;
  correct: boolean;
  confidence: number;
  waveform: number[];
}

const PHONEME_COLORS = {
  vowels: {
    correct: 'bg-green-500',
    partial: 'bg-yellow-500',
    incorrect: 'bg-red-500'
  },
  consonants: {
    correct: 'bg-blue-500',
    partial: 'bg-purple-500',
    incorrect: 'bg-red-500'
  }
};

const STRESS_PATTERNS = {
  primary: '●',
  secondary: '○',
  unstressed: '·'
};

export function RealTimePronunciationTrainer({
  word,
  phonetics,
  difficulty,
  syllables,
  stressPattern,
  audioUrl,
  onProgress
}: PronunciationTrainerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhoneme, setCurrentPhoneme] = useState<PhonemeVisualization | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [visualizations, setVisualizations] = useState<PhonemeVisualization[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      if (!audioContextRef.current || !analyserRef.current) return;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await analyzePronunciation(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startVisualization();

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      requestAnimationFrame(draw);

      analyserRef.current!.getFloatTimeDomainData(dataArray);

      // Clear canvas
      ctx.fillStyle = 'rgb(23, 23, 23)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(124, 58, 237)';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] * 100;
        const y = (canvas.height / 2) + (v * canvas.height / 2);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Add real-time phoneme analysis visualization
      if (currentPhoneme) {
        const { phoneme, correct, confidence } = currentPhoneme;
        ctx.fillStyle = correct ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)';
        ctx.fillRect(0, 0, canvas.width * (confidence / 100), 4);
      }
    };

    draw();
  };

  const analyzePronunciation = async (blob: Blob) => {
    // Here you would typically send the audio to your AI service
    // For now, we'll simulate the analysis
    const analysis = {
      phonemes: syllables.map(syllable => ({
        phoneme: syllable,
        correct: Math.random() > 0.3,
        confidence: Math.random() * 100,
        waveform: Array.from({ length: 50 }, () => Math.random())
      })),
      stress: stressPattern.map(stress => ({
        correct: Math.random() > 0.2,
        confidence: Math.random() * 100
      })),
      intonation: Math.random() * 100,
      fluency: Math.random() * 100
    };

    setVisualizations(analysis.phonemes);
    updateFeedback(analysis);
    setAttempts(prev => prev + 1);

    const overallAccuracy = analysis.phonemes.reduce(
      (acc, p) => acc + (p.correct ? 1 : 0),
      0
    ) / analysis.phonemes.length * 100;

    if (overallAccuracy > 80) {
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    onProgress({
      accuracy: overallAccuracy,
      phonemeScores: analysis.phonemes.reduce((acc, p) => ({
        ...acc,
        [p.phoneme]: p.confidence
      }), {}),
      stressAccuracy: analysis.stress.reduce(
        (acc, s) => acc + (s.correct ? 1 : 0),
        0
      ) / analysis.stress.length * 100,
      intonationAccuracy: analysis.intonation,
      fluencyScore: analysis.fluency,
      areas: {
        strengths: analysis.phonemes
          .filter(p => p.confidence > 80)
          .map(p => p.phoneme),
        improvements: analysis.phonemes
          .filter(p => p.confidence < 60)
          .map(p => p.phoneme)
      }
    });
  };

  const updateFeedback = (analysis: any) => {
    const newFeedback = [];

    // Phoneme-level feedback
    const incorrectPhonemes = analysis.phonemes
      .filter((p: any) => !p.correct)
      .map((p: any) => p.phoneme);
    
    if (incorrectPhonemes.length > 0) {
      newFeedback.push(`Focus on these sounds: ${incorrectPhonemes.join(', ')}`);
    }

    // Stress pattern feedback
    const incorrectStress = analysis.stress
      .filter((s: any) => !s.correct)
      .length;
    
    if (incorrectStress > 0) {
      newFeedback.push('Pay attention to word stress pattern');
    }

    // Intonation feedback
    if (analysis.intonation < 70) {
      newFeedback.push('Try to follow the natural rise and fall of the word');
    }

    setFeedback(newFeedback);
  };

  return (
    <div className="space-y-6">
      {/* Word Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{word}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">/{phonetics}/</p>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-yellow-500">{streak}x Streak!</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 mb-6">
            {syllables.map((syllable, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="mb-2">
                  {stressPattern[index] === 2 && STRESS_PATTERNS.primary}
                  {stressPattern[index] === 1 && STRESS_PATTERNS.secondary}
                  {stressPattern[index] === 0 && STRESS_PATTERNS.unstressed}
                </div>
                <div className="text-xl font-medium">{syllable}</div>
                {visualizations[index] && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className={cn(
                      "h-1 mt-2 rounded-full",
                      visualizations[index].correct
                        ? "bg-green-500"
                        : visualizations[index].confidence > 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    )}
                    style={{
                      width: `${visualizations[index].confidence}%`
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Audio Controls */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={isRecording}
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Listen
                </>
              )}
            </Button>
            <Button
              size="lg"
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
            >
              {isRecording ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Stop
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Record
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card>
        <CardContent className="p-6">
          <canvas
            ref={canvasRef}
            className="w-full h-40 bg-background rounded-lg"
            width={800}
            height={200}
          />
        </CardContent>
      </Card>

      {/* Feedback */}
      <AnimatePresence mode="wait">
        {feedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {feedback.map((item, index) => (
                    <li key={index}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <ArrowRight className="h-5 w-5 text-primary mt-0.5" />
                        <span>{item}</span>
                      </motion.div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}