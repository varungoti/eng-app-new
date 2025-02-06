"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AIContentGeneratorProps {
  lessonType: string;
  grade: string;
  topic: string;
  onContentGenerated: (content: any) => void;
}

export function AIContentGenerator({
  lessonType,
  grade,
  topic,
  onContentGenerated
}: AIContentGeneratorProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState<string>('question');
  const [prompt, setPrompt] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('medium');

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      // This would be your actual API call to OpenAI or similar
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonType,
          grade,
          topic,
          contentType,
          prompt,
          difficulty
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        onContentGenerated(data);
        toast({
          title: "Content Generated!",
          description: "New content has been created and saved.",
        });
      } else {
        throw new Error(data.message || 'Failed to generate content');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2 text-primary">
        <Sparkles className="h-5 w-5" />
        <h2 className="text-lg font-semibold">AI Content Generator</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Content Type</label>
            <Select
              value={contentType}
              onValueChange={setContentType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="activity">Activity</SelectItem>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="story">Story</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Difficulty</label>
            <Select
              value={difficulty}
              onValueChange={setDifficulty}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Prompt (Optional)</label>
          <Textarea
            placeholder="Enter any specific requirements or context..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="h-24"
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setPrompt('')}
            disabled={isGenerating}
          >
            Clear
          </Button>
          <Button
            onClick={generateContent}
            disabled={isGenerating}
            className="min-w-[120px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Preview section would go here */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Generated Content Preview</h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-green-500 hover:text-green-600 hover:bg-green-50"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content preview would be rendered here */}
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground">
            Generated content will appear here...
          </p>
        </Card>
      </div>
    </Card>
  );
} 