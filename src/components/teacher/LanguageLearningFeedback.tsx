"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Wand2,
  BookOpen,
  GraduationCap,
  Languages,
  Ear,
  Speech,
  Keyboard,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LanguageLearningFeedbackProps {
  targetAudio?: string;
  targetText?: string;
  practiceMode?: 'pronunciation' | 'speaking' | 'listening' | 'conversation';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onFeedbackComplete?: (feedback: LanguageFeedback) => void;
  gameMode?: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
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

interface LanguageFeedback extends AudioFeedback {
  languageMetrics: {
    pronunciation: {
      phonemeAccuracy: number;
      stressPatterns: number;
      vowelQuality: number;
      consonantClarity: number;
    };
    grammar: {
      sentenceStructure: number;
      verbTenses: number;
      articleUsage: number;
      prepositions: number;
    };
    vocabulary: {
      wordChoice: number;
      idiomaticExpressions: number;
      contextualUsage: number;
      range: number;
    };
    fluency: {
      speakingRate: number;
      pausePatterns: number;
      fillers: number;
      selfCorrections: number;
    };
  };
  detailedSuggestions: {
    category: string;
    suggestions: string[];
    examples: string[];
    priority: 'high' | 'medium' | 'low';
  }[];
}

interface VisualizationStyle {
  name: string;
  render: (ctx: CanvasRenderingContext2D, data: Float32Array, frequencyData: Uint8Array, canvas: HTMLCanvasElement) => void;
}

const visualizationStyles: VisualizationStyle[] = [
  {
    name: 'waveform',
    render: (ctx, data, _, canvas) => {
      ctx.fillStyle = 'rgb(23, 23, 23)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(124, 58, 237)';
      ctx.beginPath();

      const sliceWidth = canvas.width / data.length;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const v = data[i] * 100;
        const y = (canvas.height / 2) + (v * canvas.height / 2);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    }
  },
  {
    name: 'frequency',
    render: (ctx, _, frequencyData, canvas) => {
      ctx.fillStyle = 'rgb(23, 23, 23)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / frequencyData.length) * 2.5;
      let barX = 0;

      for (let i = 0; i < frequencyData.length; i++) {
        const barHeight = (frequencyData[i] / 255) * canvas.height;
        const hue = (i / frequencyData.length) * 360;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
        ctx.fillRect(barX, canvas.height - barHeight, barWidth, barHeight);
        barX += barWidth + 1;
      }
    }
  },
  {
    name: 'circular',
    render: (ctx, data, frequencyData, canvas) => {
      ctx.fillStyle = 'rgb(23, 23, 23)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.2)';
      ctx.stroke();

      const segments = 128;
      const angleStep = (2 * Math.PI) / segments;

      for (let i = 0; i < segments; i++) {
        const amplitude = frequencyData[i] / 255;
        const r = radius + (amplitude * 50);
        const angle = i * angleStep;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        ctx.strokeStyle = `hsla(${(i / segments) * 360}, 100%, 50%, 0.8)`;
        ctx.stroke();
      }
    }
  }
];

const practiceExercises = {
  pronunciation: [
    {
      type: 'minimal-pairs',
      title: 'Minimal Pairs',
      description: 'Practice similar sounding words',
      pairs: [['ship', 'sheep'], ['bit', 'beat'], ['full', 'fool']]
    },
    {
      type: 'tongue-twisters',
      title: 'Tongue Twisters',
      description: 'Improve pronunciation clarity',
      examples: [
        'She sells seashells by the seashore',
        'Peter Piper picked a peck of pickled peppers'
      ]
    }
  ],
  speaking: [
    {
      type: 'role-play',
      title: 'Role Play',
      description: 'Practice real-life conversations',
      scenarios: ['At a restaurant', 'Job interview', 'Making plans']
    },
    {
      type: 'story-retelling',
      title: 'Story Retelling',
      description: 'Practice narrative skills',
      stories: ['A recent vacation', 'A memorable experience', 'A funny incident']
    }
  ],
  listening: [
    {
      type: 'dictation',
      title: 'Dictation',
      description: 'Write what you hear',
      levels: ['word', 'phrase', 'sentence', 'paragraph']
    },
    {
      type: 'comprehension',
      title: 'Listening Comprehension',
      description: 'Answer questions about what you hear',
      categories: ['main idea', 'details', 'inference', 'tone']
    }
  ]
};

export function LanguageLearningFeedback({
  targetAudio,
  targetText,
  practiceMode = 'pronunciation',
  difficulty = 'intermediate',
  onFeedbackComplete,
  gameMode = false
}: LanguageLearningFeedbackProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  const [feedback, setFeedback] = useState<LanguageFeedback | null>(null);
  const [visualizationStyle, setVisualizationStyle] = useState<string>('waveform');
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [practiceProgress, setPracticeProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const animationFrameRef = useRef<number>();

  const startVisualization = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    const frequencyData = new Uint8Array(bufferLength);

    const draw = () => {
      if (!isRecording) return;
      animationFrameRef.current = requestAnimationFrame(draw);

      analyserRef.current!.getFloatTimeDomainData(dataArray);
      analyserRef.current!.getByteFrequencyData(frequencyData);
      setAudioData(dataArray);

      const style = visualizationStyles.find(s => s.name === visualizationStyle);
      if (style) {
        style.render(ctx, dataArray, frequencyData, canvas);
      }
    };

    draw();
  };

  const processAudio = async (blob: Blob) => {
    try {
      // Simulate AI analysis with detailed language metrics
      const simulatedFeedback: LanguageFeedback = {
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
        ],
        languageMetrics: {
          pronunciation: {
            phonemeAccuracy: Math.random() * 100,
            stressPatterns: Math.random() * 100,
            vowelQuality: Math.random() * 100,
            consonantClarity: Math.random() * 100
          },
          grammar: {
            sentenceStructure: Math.random() * 100,
            verbTenses: Math.random() * 100,
            articleUsage: Math.random() * 100,
            prepositions: Math.random() * 100
          },
          vocabulary: {
            wordChoice: Math.random() * 100,
            idiomaticExpressions: Math.random() * 100,
            contextualUsage: Math.random() * 100,
            range: Math.random() * 100
          },
          fluency: {
            speakingRate: Math.random() * 100,
            pausePatterns: Math.random() * 100,
            fillers: Math.random() * 100,
            selfCorrections: Math.random() * 100
          }
        },
        detailedSuggestions: [
          {
            category: 'Pronunciation',
            suggestions: [
              'Focus on the /θ/ sound in "think" and "thank"',
              'Practice the schwa sound in unstressed syllables'
            ],
            examples: ['think vs. sink', 'about → /əˈbaʊt/'],
            priority: 'high'
          },
          {
            category: 'Grammar',
            suggestions: [
              'Pay attention to article usage before nouns',
              'Review past perfect tense formation'
            ],
            examples: ['the book vs. a book', 'had gone vs. went'],
            priority: 'medium'
          }
        ]
      };

      setFeedback(simulatedFeedback);
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
      <Tabs defaultValue="practice" className="w-full">
        <TabsList>
          <TabsTrigger value="practice">Practice</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="practice">
          {/* Practice Mode UI */}
          <Card>
            <CardHeader>
              <CardTitle>
                {practiceMode.charAt(0).toUpperCase() + practiceMode.slice(1)} Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {practiceMode !== 'conversation' && practiceExercises[practiceMode]?.map((exercise, index) => (
                  <Card
                    key={index}
                    className={cn(
                      "cursor-pointer hover:shadow-lg transition-all",
                      currentExercise?.type === exercise.type && "border-primary"
                    )}
                    onClick={() => setCurrentExercise(exercise)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {exercise.type === 'minimal-pairs' && <Ear className="h-5 w-5 text-primary" />}
                        {exercise.type === 'tongue-twisters' && <Speech className="h-5 w-5 text-primary" />}
                        {exercise.type === 'role-play' && <Users className="h-5 w-5 text-primary" />}
                        {exercise.type === 'dictation' && <Keyboard className="h-5 w-5 text-primary" />}
                        <div>
                          <h3 className="font-medium">{exercise.title}</h3>
                          <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualization">
          {/* Enhanced Visualization UI */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Audio Visualization</CardTitle>
                <div className="flex gap-2">
                  {visualizationStyles.map(style => (
                    <Button
                      key={style.name}
                      variant={visualizationStyle === style.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => setVisualizationStyle(style.name)}
                    >
                      {style.name.charAt(0).toUpperCase() + style.name.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Canvas and recording controls */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          {/* Detailed Language Feedback UI */}
          {feedback && (
            <div className="space-y-6">
              {/* Language Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Language Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(feedback.languageMetrics).map(([category, metrics]) => (
                      <div key={category} className="space-y-4">
                        <h3 className="font-medium capitalize">{category}</h3>
                        <div className="space-y-2">
                          {Object.entries(metrics).map(([metric, value]) => (
                            <div key={metric} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">{metric.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span>{Math.round(value)}%</span>
                              </div>
                              <Progress value={value} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {feedback.detailedSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-4 rounded-lg border",
                          suggestion.priority === 'high' && "border-red-200 bg-red-50",
                          suggestion.priority === 'medium' && "border-yellow-200 bg-yellow-50",
                          suggestion.priority === 'low' && "border-green-200 bg-green-50"
                        )}
                      >
                        <h4 className="font-medium flex items-center gap-2">
                          <Wand2 className="h-4 w-4" />
                          {suggestion.category}
                        </h4>
                        <ul className="mt-2 space-y-2">
                          {suggestion.suggestions.map((item, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <Sparkles className="h-4 w-4 mt-0.5" />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 p-2 bg-white/50 rounded-md">
                          <p className="text-sm font-medium">Examples:</p>
                          <ul className="mt-1 space-y-1">
                            {suggestion.examples.map((example, i) => (
                              <li key={i} className="text-sm">{example}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 