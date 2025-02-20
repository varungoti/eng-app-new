"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {  Mic, Volume2, Play, Pause, Music, AudioWaveform as Waveform, ArrowRight, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RhythmAndIntonationProps {
  targetText: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onProgress: (progress: IntonationProgress) => void;
}

interface IntonationProgress {
  rhythmAccuracy: number;
  intonationAccuracy: number;
  stressPatternAccuracy: number;
  overallScore: number;
  areas: {
    strengths: string[];
    improvements: string[];
  };
}

interface SyllableVisualization {
  text: string;
  stress: number;
  pitch: number;
  duration: number;
  isCorrect: boolean;
}

export function RhythmAndIntonation({
  targetText,
  difficulty,
  onProgress
}: RhythmAndIntonationProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [syllables, setSyllables] = useState<SyllableVisualization[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);

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
        await analyzeIntonation(blob);
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
    };

    draw();
  };

  const analyzeIntonation = async (blob: Blob) => {
    // Here you would typically send the audio to your AI service
    // For now, we'll simulate the analysis
    const analysis = {
      syllables: targetText.split(' ').map(word => ({
        text: word,
        stress: Math.random(),
        pitch: Math.random() * 100,
        duration: Math.random() * 100,
        isCorrect: Math.random() > 0.3
      })),
      rhythmAccuracy: Math.random() * 100,
      intonationAccuracy: Math.random() * 100,
      stressPatternAccuracy: Math.random() * 100
    };

    setSyllables(analysis.syllables);
    updateFeedback(analysis);

    const overallScore = (
      analysis.rhythmAccuracy +
      analysis.intonationAccuracy +
      analysis.stressPatternAccuracy
    ) / 3;

    setCurrentScore(overallScore);

    onProgress({
      rhythmAccuracy: analysis.rhythmAccuracy,
      intonationAccuracy: analysis.intonationAccuracy,
      stressPatternAccuracy: analysis.stressPatternAccuracy,
      overallScore,
      areas: {
        strengths: analysis.syllables
          .filter(s => s.isCorrect)
          .map(s => s.text),
        improvements: analysis.syllables
          .filter(s => !s.isCorrect)
          .map(s => s.text)
      }
    });
  };

  const updateFeedback = (analysis: any) => {
    const newFeedback = [];

    if (analysis.rhythmAccuracy < 70) {
      newFeedback.push('Focus on maintaining consistent rhythm');
    }
    if (analysis.intonationAccuracy < 70) {
      newFeedback.push('Practice the rise and fall of your voice');
    }
    if (analysis.stressPatternAccuracy < 70) {
      newFeedback.push('Pay attention to word stress patterns');
    }

    setFeedback(newFeedback);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Music className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Rhythm & Intonation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Level: {difficulty}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span className="font-bold">{Math.round(currentScore)}% Accuracy</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Target Text Display */}
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Practice Text</h3>
          <p className="text-xl">{targetText}</p>
        </Card>

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
                <Volume2 className="mr-2 h-4 w-4" />
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

        {/* Visualization */}
        <Card className="p-6">
          <canvas
            ref={canvasRef}
            className="w-full h-40 bg-background rounded-lg"
            width={800}
            height={200}
          />
        </Card>

        {/* Syllable Analysis */}
        {syllables.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {syllables.map((syllable, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "p-4 text-center",
                  syllable.isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                )}>
                  <p className="font-medium mb-2">{syllable.text}</p>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Stress: {Math.round(syllable.stress * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Pitch: {Math.round(syllable.pitch)}%
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

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
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <ChevronRight className="h-5 w-5 text-primary mt-0.5" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
} 