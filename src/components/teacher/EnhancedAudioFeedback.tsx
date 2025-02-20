"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Mic,
  Volume2,
  Music,
  Play,
  Pause,
  RefreshCw,
  Star,
  Trophy,
  Crown,
  Medal,
  Sparkles,
  AudioWaveform
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedAudioFeedbackProps {
  targetAudio?: string;
  onFeedbackComplete?: (feedback: AudioFeedback) => void;
  gameMode?: boolean;
}

interface AudioFeedback {
  accuracy: number;
  pitch: number;
  rhythm: number;
  intonation: number;
  fluency: number;
  suggestions: string[];
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

export function EnhancedAudioFeedback({
  targetAudio,
  onFeedbackComplete,
  gameMode = false
}: EnhancedAudioFeedbackProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [feedback, setFeedback] = useState<AudioFeedback | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showReward, setShowReward] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationFrameRef = useRef<number>();

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 2048;

    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      analyserRef.current!.getFloatTimeDomainData(dataArray);
      setAudioData(dataArray);

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

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Add frequency visualization
      const frequencyData = new Uint8Array(analyserRef.current!.frequencyBinCount);
      analyserRef.current!.getByteFrequencyData(frequencyData);

      const barWidth = (canvas.width / frequencyData.length) * 2.5;
      let barX = 0;

      ctx.fillStyle = 'rgba(124, 58, 237, 0.3)';
      for (let i = 0; i < frequencyData.length; i++) {
        const barHeight = (frequencyData[i] / 255) * canvas.height / 2;
        ctx.fillRect(barX, canvas.height - barHeight, barWidth, barHeight);
        barX += barWidth + 1;
      }
    };

    draw();
  };

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
        await processAudio(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startVisualization();

      if (gameMode) {
        // Start combo timer
        setCombo(0);
        const comboInterval = setInterval(() => {
          setCombo(prev => prev + 1);
        }, 1000);

        return () => clearInterval(comboInterval);
      }

    } catch (error) {
      toast({
        title: "Microphone Access Required",
        description: "Please enable microphone access to use this feature.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const processAudio = async (blob: Blob) => {
    try {
      // Here you would typically send the audio to your AI service
      // For now, we'll simulate the analysis
      const simulatedFeedback: AudioFeedback = {
        accuracy: Math.random() * 100,
        pitch: Math.random() * 100,
        rhythm: Math.random() * 100,
        intonation: Math.random() * 100,
        fluency: Math.random() * 100,
        suggestions: [
          "Try emphasizing the stressed syllables more",
          "Maintain a steady rhythm throughout",
          "Pay attention to rising intonation at the end of questions"
        ],
        achievements: [
          {
            id: "perfect_pitch",
            title: "Perfect Pitch",
            description: "Matched the target pitch perfectly",
            icon: <Music className="h-6 w-6" />,
            unlocked: Math.random() > 0.5
          },
          {
            id: "rhythm_master",
            title: "Rhythm Master",
            description: "Maintained perfect rhythm",
            icon: <Music className="h-6 w-6" />,
            unlocked: Math.random() > 0.5
          },
          {
            id: "fluency_star",
            title: "Fluency Star",
            description: "Spoke with natural fluency",
            icon: <Star className="h-6 w-6" />,
            unlocked: Math.random() > 0.5
          }
        ]
      };

      setFeedback(simulatedFeedback);
      
      // Calculate score based on all metrics
      const newScore = Math.round(
        (simulatedFeedback.accuracy +
         simulatedFeedback.pitch +
         simulatedFeedback.rhythm +
         simulatedFeedback.intonation +
         simulatedFeedback.fluency) / 5
      );
      
      setScore(newScore);

      if (gameMode && newScore > 80) {
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
      }

      onFeedbackComplete?.(simulatedFeedback);

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze audio. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Audio Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Audio Visualization</span>
            {gameMode && (
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Score: {score}</span>
                {combo > 0 && (
                  <span className="text-purple-500">
                    x{combo} Combo!
                  </span>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <canvas
              ref={canvasRef}
              className="w-full h-40 bg-background rounded-lg"
              width={800}
              height={200}
            />
            
            <div className="flex justify-center gap-4">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="w-40"
              >
                {isRecording ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Record
                  </>
                )}
              </Button>
              
              {targetAudio && (
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant="outline"
                  className="w-40"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Play Target
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Display */}
      {feedback && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Accuracy</label>
                <Progress value={feedback.accuracy} className="h-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pitch</label>
                <Progress value={feedback.pitch} className="h-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rhythm</label>
                <Progress value={feedback.rhythm} className="h-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Intonation</label>
                <Progress value={feedback.intonation} className="h-2" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fluency</label>
                <Progress value={feedback.fluency} className="h-2" />
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-2">
              <h3 className="font-medium">Suggestions</h3>
              <ul className="space-y-2">
                {feedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Sparkles className="h-4 w-4 mt-0.5 text-purple-500" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {feedback.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "p-4 rounded-lg text-center transition-all",
                    achievement.unlocked
                      ? "bg-purple-500/10 text-purple-500"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  <div className="flex flex-col items-center gap-2">
                    {achievement.icon}
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-xs">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Mode Reward Animation */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div className="bg-white p-8 rounded-lg text-center space-y-4">
              <Crown className="h-16 w-16 text-yellow-500 mx-auto" />
              <h2 className="text-2xl font-bold">Excellent!</h2>
              <p>Score: {score}</p>
              {combo > 5 && (
                <p className="text-purple-500 font-bold">
                  {combo}x Combo Bonus!
                </p>
              )}
              <div className="flex justify-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                <Star className="h-6 w-6 text-yellow-500" />
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 