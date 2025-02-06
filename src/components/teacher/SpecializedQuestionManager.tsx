"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { questionApi } from '@/lib/api/questions';
import {
  Mic,
  Volume2,
  Music,
  Sparkles,
  Star,
  Trophy,
  Crown,
  Medal,
  Gift,
  BookOpen,
  PenTool,
  Headphones,
  Eye,
  MessageSquare,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecializedQuestionManagerProps {
  lessonId: string;
  onQuestionCreated?: () => void;
}

interface QuestionTemplate {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: {
    name: string;
    type: 'text' | 'textarea' | 'audio' | 'video' | 'image';
    label: string;
    required?: boolean;
  }[];
}

const questionTemplates: QuestionTemplate[] = [
  {
    type: 'phonics_practice',
    title: 'Phonics Practice',
    description: 'Practice specific phonemes and sounds',
    icon: <Volume2 className="h-6 w-6" />,
    fields: [
      { name: 'phoneme', type: 'text', label: 'Target Phoneme', required: true },
      { name: 'examples', type: 'textarea', label: 'Example Words' },
      { name: 'audioPrompt', type: 'audio', label: 'Audio Demonstration' }
    ]
  },
  {
    type: 'pronunciation_drill',
    title: 'Pronunciation Drill',
    description: 'Focus on specific pronunciation patterns',
    icon: <Mic className="h-6 w-6" />,
    fields: [
      { name: 'pattern', type: 'text', label: 'Pronunciation Pattern', required: true },
      { name: 'words', type: 'textarea', label: 'Practice Words' },
      { name: 'audioGuide', type: 'audio', label: 'Audio Guide' }
    ]
  },
  {
    type: 'rhythm_intonation',
    title: 'Rhythm & Intonation',
    description: 'Practice speech rhythm and intonation',
    icon: <Music className="h-6 w-6" />,
    fields: [
      { name: 'pattern', type: 'text', label: 'Rhythm Pattern', required: true },
      { name: 'example', type: 'audio', label: 'Example Recording' },
      { name: 'notes', type: 'textarea', label: 'Teaching Notes' }
    ]
  },
  {
    type: 'visual_speaking',
    title: 'Visual Speaking',
    description: 'Describe and discuss images',
    icon: <Eye className="h-6 w-6" />,
    fields: [
      { name: 'image', type: 'image', label: 'Visual Prompt', required: true },
      { name: 'prompts', type: 'textarea', label: 'Discussion Prompts' },
      { name: 'vocabulary', type: 'textarea', label: 'Key Vocabulary' }
    ]
  },
  {
    type: 'dialogue_practice',
    title: 'Dialogue Practice',
    description: 'Interactive conversation practice',
    icon: <MessageSquare className="h-6 w-6" />,
    fields: [
      { name: 'scenario', type: 'text', label: 'Conversation Scenario', required: true },
      { name: 'dialogue', type: 'textarea', label: 'Sample Dialogue' },
      { name: 'roles', type: 'textarea', label: 'Role Descriptions' }
    ]
  },
  {
    type: 'creative_speaking',
    title: 'Creative Speaking',
    description: 'Open-ended speaking activities',
    icon: <Lightbulb className="h-6 w-6" />,
    fields: [
      { name: 'topic', type: 'text', label: 'Speaking Topic', required: true },
      { name: 'prompts', type: 'textarea', label: 'Creative Prompts' },
      { name: 'guidelines', type: 'textarea', label: 'Speaking Guidelines' }
    ]
  }
];

export function SpecializedQuestionManager({ lessonId, onQuestionCreated }: SpecializedQuestionManagerProps) {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTemplateSelect = (template: QuestionTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!selectedTemplate) {
        toast({
          title: "Error",
          description: "No template selected",
          variant: "destructive"
        });
        return;
      }

      // Validate required fields
      const missingFields = selectedTemplate.fields
        .filter(f => f.required && !formData[f.name])
        .map(f => f.label);

      if (missingFields?.length) {
        toast({
          title: "Missing Required Fields",
          description: `Please fill in: ${missingFields.join(', ')}`,
          variant: "destructive"
        });
        return;
      }

      // Create question in database
      const questionData = {
        title: formData.title || selectedTemplate.title,
        type: selectedTemplate.type,
        lesson_id: lessonId,
        content: formData.content || '',
        points: 10, // Default points
        data: {
          prompt: formData.prompt || selectedTemplate.title,
          teacherScript: formData.teacherScript || '',
          sampleAnswer: formData.sampleAnswer,
          metadata: {
            prompt: formData.prompt,
            sampleAnswer: formData.sampleAnswer,
            audioContent: formData.audioContent,
            transcript: formData.transcript,
            keywords: formData.keywords?.split(',').map((k: string) => k.trim()),
            hints: formData.hints?.split(',').map((h: string) => h.trim())
          }
        },
        exercisePrompts: []
      };

      await questionApi.createQuestion(questionData);

      toast({
        title: "Question Created",
        description: "The specialized activity has been added to the lesson."
      });

      setSelectedTemplate(null);
      setFormData({});
      onQuestionCreated?.();

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create question. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!selectedTemplate ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionTemplates.map((template) => (
            <motion.div
              key={template.type}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{template.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {selectedTemplate.icon}
                </div>
                <div>
                  <CardTitle>{selectedTemplate.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate.description}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedTemplate(null)}
              >
                Change Template
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <Textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : field.type === 'text' ? (
                  <Input
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      {field.type === 'audio' && 'Audio upload will be implemented'}
                      {field.type === 'video' && 'Video upload will be implemented'}
                      {field.type === 'image' && 'Image upload will be implemented'}
                    </p>
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 