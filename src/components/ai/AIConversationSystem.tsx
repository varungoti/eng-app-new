"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Mic,
  Send,
  Volume2,
  VolumeX,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Star
} from "lucide-react";
import { 
  type AIConversationProps, 
  type AIResponse, 
  type GameProgress 
} from '@/types/ai';

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  feedback?: AIResponse['feedback'];
}

export function AIConversationSystem({
  mode,
  studentAge,
  skillLevel,
  onLoading
}: AIConversationProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [gameProgress, setGameProgress] = useState<GameProgress>({
    level: 1,
    score: 0,
    streak: 0,
    achievements: [],
    skillLevels: {
      pronunciation: 0,
      grammar: 0,
      vocabulary: 0,
      fluency: 0,
      comprehension: 0
    }
  });

  // Initialize conversation based on mode
  useEffect(() => {
    const initializeConversation = async () => {
      onLoading(true);
      try {
        const initialMessage: Message = {
          id: '1',
          role: 'system',
          content: mode === 'assessment' 
            ? "Hi! I'm your English assessment assistant. Let's check your language skills!"
            : "Hello! I'm your English learning buddy. Ready to play some fun language games?",
        };
        setMessages([initialMessage]);
      } catch (error) {
        console.error('Error initializing conversation:', error);
      } finally {
        onLoading(false);
      }
    };

    initializeConversation();
  }, [mode, onLoading]);

  // Helper function to get age-appropriate topics
  const getTopicForLevel = (level: number, age: number): string => {
    const topics = {
      beginner: {
        young: ['Colors', 'Animals', 'Family', 'Numbers', 'Food'],
        older: ['Hobbies', 'School', 'Friends', 'Weather', 'Sports']
      },
      intermediate: {
        young: ['Daily Routine', 'Favorite Books', 'Pets', 'Holidays', 'Seasons'],
        older: ['Movies', 'Music', 'Technology', 'Travel', 'Environment']
      },
      advanced: {
        young: ['Story Creation', 'Science Facts', 'World Culture', 'Space', 'Nature'],
        older: ['Current Events', 'Social Media', 'Future Goals', 'Global Issues', 'Technology Trends']
      }
    };

    const ageGroup = age <= 8 ? 'young' : 'older';
    const levelTopics = topics[skillLevel][ageGroup];
    return levelTopics[level % levelTopics.length];
  };

  // Handle user input submission
  const handleSubmit = async () => {
    if (!input.trim()) return;

    onLoading(true);
    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Process with AI and get response
      const aiResponse = await processWithAI(userMessage.content);
      
      // Add AI response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message,
        feedback: aiResponse.feedback
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update game progress if in game mode
      if (mode === 'game' && aiResponse.score) {
        updateGameProgress(aiResponse.score, aiResponse.feedback);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    } finally {
      onLoading(false);
    }
  };

  // Mock AI processing - Replace with actual AI integration
  const processWithAI = async (message: string): Promise<AIResponse> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      message: "I understand! Let's practice that together...",
      feedback: {
        pronunciation: 85,
        grammar: 90,
        vocabulary: 88,
        fluency: 87
      },
      score: 90
    };
  };

  // Update game progress based on performance
  const updateGameProgress = (score: number, feedback?: AIResponse['feedback']) => {
    setGameProgress(prev => {
      const newStreak = score >= 80 ? prev.streak + 1 : 0;
      const newLevel = Math.floor(prev.score / 1000) + 1;

      // Update skill levels if feedback is provided
      const newSkillLevels = { ...prev.skillLevels };
      if (feedback) {
        Object.entries(feedback).forEach(([skill, value]) => {
          const key = skill as keyof typeof prev.skillLevels;
          newSkillLevels[key] = Math.round((newSkillLevels[key] + value) / 2);
        });
      }

      return {
        level: newLevel,
        score: prev.score + score,
        streak: newStreak,
        achievements: prev.achievements,
        skillLevels: newSkillLevels
      };
    });
  };

  return (
    <div className="space-y-4">
      {mode === 'game' && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              Level {gameProgress.level} • Score: {gameProgress.score}
            </div>
            {gameProgress.streak > 0 && (
              <div className="flex items-center gap-1 text-orange-500">
                <Star className="h-4 w-4" />
                <span className="text-sm">Streak: {gameProgress.streak}</span>
              </div>
            )}
          </div>
          <Progress 
            value={gameProgress.score % 1000 / 10} 
            className="w-1/3" 
          />
        </div>
      )}

      <div className="h-[500px] overflow-y-auto space-y-4 p-4 rounded-lg border">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar
                name={message.role === 'user' ? 'You' : 'AI Assistant'}
                className={message.role === 'user' ? 'bg-primary' : 'bg-secondary'}
              />
              <div className={`flex flex-col gap-2 max-w-[80%] ${
                message.role === 'user' ? 'items-end' : ''
              }`}>
                <Card className={`${
                  message.role === 'user' ? 'bg-primary text-primary-foreground' : ''
                }`}>
                  <CardContent className="p-3">
                    <p>{message.content}</p>
                  </CardContent>
                </Card>
                {message.feedback && (
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    {Object.entries(message.feedback).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-1">
                        <span className="capitalize">{key}:</span>
                        <span className={`font-medium ${
                          value >= 90 ? 'text-green-500' :
                          value >= 70 ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>{value}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsRecording(!isRecording)}
          className={isRecording ? 'text-red-500' : ''}
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSpeaking(!isSpeaking)}
        >
          {isSpeaking ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <Button onClick={handleSubmit}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
} 