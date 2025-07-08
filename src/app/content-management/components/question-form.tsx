"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { logger } from '@/lib/logger';
import { Plus, Trash as Trash2, ChevronDown, ChevronRight, X } from 'lucide-react';

import { ExercisePromptCard } from './exercise-prompt-card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/ui/icons';
//import { ImageIcon } from 'lucide-react';
import { Question, QuestionType, QuestionFormProps, TextBlock } from "@/app/content-management/types";
import { QUESTION_TYPES } from "@/app/content-management/constants";
//import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from '@/components/ui/select';
import { RichTextEditor, RichTextEditorProps } from '@/components/editor/RichTextEditor';
import { QuestionTypeIcon } from "@/components/ui/question-type-icons";

interface QuestionMetadata {
    // Common fields
    prompt?: string;
    teacherScript?: string;
    sampleAnswer?: string;
        
    // Storytelling
    storyPrompt?: string;
    keywords?: string[];
    hints?: string[];
    
    // Listening
    audioContent?: string;
    transcript?: string;
    questions?: string[];
    
    // Listen and Repeat
    phrases?: string[];
    translations?: string[];
    
    // Multiple Choice
    options?: string[];
    correctAnswer?: number | null;
    
    // Grammar Speaking
    grammarPoint?: string;
    example?: string;
  
    // Debate
    topic?: string;
    position?: string;
    keyPoints?: string[];
    
    // Presentation
    duration?: string;
    structure?: Array<{
      title: string;
      points: string[];
    }>;
    visualAids?: Array<{
      url: string;
      description: string;
    }>;
    visualAidsInstructions?: string;

    // Matching
    matching?: Array<{
      text: string;
      correct: boolean;
    }>;

    //fill in the blank
    fillInTheBlank?: Array<{
      sentence: string;
      blanks: string[];
    }>;
      
    //fill in the blank with multiple choices
    fillInTheBlankWithMultipleChoices?: Array<{
      sentence: string;
      blanks: string[];
      options: string[];
      correctAnswer: number;
      }>;
    //True or False
    trueOrFalse?: Array<{
      sentence: string;
      correctAnswer: boolean;
    }>;

    //Reading Comprehension
    readingComprehension?: Array<{
      passage: string;
      questions: string[];
    }>;

    //Speaking and Writing
    speakingAndWriting?: Array<{
      speakingPrompt: string;
      writingPrompt: string;
    }>;

    //Listening and Speaking
    listeningAndSpeaking?: Array<{
      listeningPrompt: string;
      speakingPrompt: string;
    }>;

    //reading and speaking
    readingAndSpeaking?: Array<{
      readingPrompt: string;
      speakingPrompt: string;
    }>;

    //Speaking with a partner
    speakingWithAPartner?: Array<{
      speakingPrompt: string;
      partnerPrompt: string;
    }>;

    //Action and Reaction
    actionAndReaction?: Array<{
      action: string;
      reaction: string;
    }>;

    // Action and Speaking
    actionAndSpeaking?: Array<{
      action: string;
      speakingPrompt: string;
    }>;

    //Vocabulary Practice
    vocabularyPractice?: Array<{
      word: string;
      spelling: string;
      definition: string;
      sentences: string[];
    }>;

    //spelling practice
    spellingPractice?: Array<{
      word: string;
      spelling: string;
      sentences: string[];
    }>;

    //Watch and Speak
    watchAndSpeak?: Array<{
      videoUrl: string;
      discussionPoints: string[];
      instructions: string;
    }>;

    //Look and Speak
    lookAndSpeak?: Array<{
      imageUrl: string;
      imageCaption: string;
      helpfulVocabulary: string[];
      instructions: string;
    }>;

    //idiom_practice
    idiomPractice?: Array<{
      idiom: string;
      meaning: string;
      example: string;
      usageNotes: string;
    }>; 

      
    items?: string[];
    sentence?: string;
    blanks?: string[];
    statement?: string;
    passage?: string | { text: TextBlock[] }[];
    answer?: string;
    response?: string | { text: TextBlock[] }[];
    speakingPrompt?: string;
    
    writingPrompt?: string;
    listeningPrompt?: string;
    partnerPrompt?: string;
    actionPrompt?: string;
    speakingPrompt2?: string;
  
    wordlistPrompt?: Array<{
      word: string;
      definition: string;
      correctPronunciation: string;
      phoneticGuide: string;
      pronunciationAudio: string;
      example: string;
      usageNotes: string;
      synonyms: string[];
      antonyms: string[];
    }>;

    vocabularyAndSpeaking?: Array<{
      speakingPrompt: string;
      vocabulary: string[];
    }>;

    sentenceFormation?: Array<{
      originalSentence: string;
      hints: string[];
      correctAnswer: string;
    }>;

    vocabularyAndGrammar?: Array<{
      grammarPoint: string;
      vocabulary: string[];
    }>;

    sentenceTransformation?: Array<{
      originalSentence: string;
      tenseToTransform: string;
      hints: string[];
      correctAnswer: string;
    }>;

    sentenceTransformationAndCompletion?: Array<{
      originalSentence: string;
      tenseToTransform: string;
      hints: string[];
      correctAnswer: string;
    }>;

    objectAndSpeaking?: Array<{
      speakingPrompt: string;
      objectPrompt: string;
    }>;

    objectActionAndSpeaking?: Array<{
      speakingPrompt: string;
      objectPrompt: string;
      actionPrompt: string;
    }>;
}

export interface QuestionData {
  data?: {
    prompt?: string;
    teacherScript?: string;
    followup_prompt?: string[];
    sampleAnswer?: string;
    answer?: string;
  };
  sampleAnswer?: string;
  type?: string;
}

const hasSubType = (question: Question): question is Question & { sub_type: string } => {
  return 'sub_type' in question;
};

export function QuestionForm({
  question,
  index,
  onUpdate,
  onRemove,
  onAddExercisePrompt,
  onRemoveExercisePrompt,
  onExercisePromptChange
}: QuestionFormProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<'success' | 'error' | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleFieldChange = async (field: string, value: string) => {
    setIsSaving(true);
    setLastSaved(null);
    try {
      await onUpdate(index, {
        ...question,
        data: { ...question.data, [field]: value } as any
      });
      if (mounted.current) {
        setLastSaved('success');
      }
    } catch (error) {
      if (mounted.current) {
        setLastSaved('error');
        logger.error({
          message: 'Failed to update question field',
          context: { error, field, index },
          source: 'QuestionForm'
        });
      }
    } finally {
      if (mounted.current) {
        setIsSaving(false);
        setTimeout(() => {
          if (mounted.current) {
            setLastSaved(null);
          }
        }, 2000);
      }
    }
  };

  const handleMetadataChange = (field: keyof QuestionMetadata, value: any) => {
    onUpdate(index, {
      ...question,
      metadata: {
        ...question.metadata,
        [field]: value
      }
    });
  };

  const _handleQuestionTypeChange = (_type: string, defaultData: any) => {
    const updatedQuestion: Question = {
      ...question,
      data: {
        ...defaultData,
        prompt: question.data?.prompt || '',
        teacher_script: question.data?.teacher_script || '',
        sample_answer: question.data?.sample_answer || ''
      }
    };
    onUpdate(index, updatedQuestion);
  };

  const renderQuestionFields = (question: Question) => {
    const metadata = question?.metadata || {};
    
    switch (question?.type) {
      case 'speaking':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sample Answer</Label>
              <Input
                value={metadata?.sampleAnswer || ''}
                onChange={(e) => handleMetadataChange('sampleAnswer', e.target.value)}
              />
            </div>
          </div>
        );
      case 'multipleChoice':
        return (
          <div className="space-y-2">
            <Label>Options</Label>
            {metadata.options?.map((option: string, index: number) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => {
                  const newOptions = [...(metadata.options || [])];
                  newOptions[index] = e.target.value;
                  handleMetadataChange('options', newOptions);
                }}
              />
            ))}
            <button onClick={() => handleMetadataChange('options', [...(metadata.options || []), ''])}>
              Add Option
            </button>
          </div>
        );
      case 'matching':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Items to Match</Label>
              {metadata.items?.map((item: string, idx: number) => (
                <Input
                  key={`item-${idx}`}
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(metadata.items || [])];
                    newItems[idx] = e.target.value;
                    handleMetadataChange('items', newItems);
                  }}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetadataChange('items', [...(metadata.items || []), ''])}
              >
                Add Item
              </Button>
            </div>
          </div>
        );

      case 'fillInTheBlank':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sentence with Blanks</Label>
              <Textarea
                value={metadata.sentence || ''}
                onChange={(e) => handleMetadataChange('sentence', e.target.value)}
                placeholder="Enter sentence with ___ for blanks"
              />
            </div>
            <div className="space-y-2">
              <Label>Correct Answers</Label>
              {metadata.blanks?.map((blank: string, idx: number) => (
                <Input
                  key={`blank-${idx}`}
                  value={blank}
                  onChange={(e) => {
                    const newBlanks = [...(metadata.blanks || [])];
                    newBlanks[idx] = e.target.value;
                    handleMetadataChange('blanks', newBlanks);
                  }}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetadataChange('blanks', [...(metadata.blanks || []), ''])}
              >
                Add Answer
              </Button>
            </div>
          </div>
        );

      case 'trueOrFalse':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Statement</Label>
              <Textarea
                value={metadata.statement || ''}
                onChange={(e) => handleMetadataChange('statement', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <div className="flex gap-4">
                <Button
                  variant={metadata.correctAnswer?.toString() === 'true' ? 'default' : 'outline'}
                  onClick={() => handleMetadataChange('correctAnswer', 'true')}
                >
                  True
                </Button>
                <Button
                  variant={metadata.correctAnswer?.toString() === 'false' ? 'default' : 'outline'}
                  onClick={() => handleMetadataChange('correctAnswer', 'false')}
                >
                  False
                </Button>
              </div>
            </div>
          </div>
        );

      case 'reading':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reading Passage</Label>
              <RichTextEditor
                value={typeof metadata.passage === 'string' 
                  ? metadata.passage 
                  : JSON.stringify(metadata.passage) || ''}
                onChange={(value) => handleMetadataChange('passage', value)}
                placeholder="Enter reading passage..."
                className="min-h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Comprehension Questions</Label>
              {metadata.questions?.map((q: string, idx: number) => (
                <Input
                  key={`question-${idx}`}
                  value={q}
                  onChange={(e) => {
                    const newQuestions = [...(metadata.questions || [])];
                    newQuestions[idx] = e.target.value;
                    handleMetadataChange('questions', newQuestions);
                  }}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetadataChange('questions', [...(metadata.questions || []), ''])}
              >
                Add Question
              </Button>
            </div>
          </div>
        );

      case 'writing':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Writing Prompt</Label>
              <RichTextEditor
                value={metadata.writingPrompt || ''}
                onChange={(value) => handleMetadataChange('writingPrompt', value)}
              />
            </div>
          </div>
        );

      case 'speakingAndSpeaking':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>First Speaking Prompt</Label>
              <Textarea
                value={metadata.speakingPrompt || ''}
                onChange={(e) => handleMetadataChange('speakingPrompt', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Second Speaking Prompt</Label>
              <Textarea
                value={metadata.speakingPrompt2 || ''}
                onChange={(e) => handleMetadataChange('speakingPrompt2', e.target.value)}
              />
            </div>
          </div>
        );

      case 'speakingAndListening':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Speaking Prompt</Label>
              <Textarea
                value={metadata.speakingPrompt || ''}
                onChange={(e) => handleMetadataChange('speakingPrompt', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Listening Prompt</Label>
              <Textarea
                value={metadata.listeningPrompt || ''}
                onChange={(e) => handleMetadataChange('listeningPrompt', e.target.value)}
              />
            </div>
          </div>
        );

      case 'readingAndSpeaking':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reading Passage</Label>
              <RichTextEditor
                value={typeof metadata.passage === 'string' 
                  ? metadata.passage 
                  : JSON.stringify(metadata.passage) || ''}
                onChange={(value) => handleMetadataChange('passage', value)}
                placeholder="Enter reading passage..."
                className="min-h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Speaking Prompt</Label>
              <Textarea
                value={metadata.speakingPrompt || ''}
                onChange={(e) => handleMetadataChange('speakingPrompt', e.target.value)}
              />
            </div>
          </div>
        );

      case 'speakingWithAPartner':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Speaking Prompt</Label>
              <Textarea
                value={metadata.speakingPrompt || ''}
                onChange={(e) => handleMetadataChange('speakingPrompt', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Partner Prompt</Label>
              <Textarea
                value={metadata.partnerPrompt || ''}
                onChange={(e) => handleMetadataChange('partnerPrompt', e.target.value)}
              />
            </div>
          </div>
        );
      case 'actionAndSpeaking':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Speaking Prompt</Label>
              <Textarea
                value={metadata.speakingPrompt || ''}
                onChange={(e) => handleMetadataChange('speakingPrompt', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Action Prompt</Label>
              <Textarea
                value={metadata.actionPrompt || ''}
                onChange={(e) => handleMetadataChange('actionPrompt', e.target.value)}
              />
            </div>
          </div>
        );

      case 'storytelling':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Story Prompt</Label>
              <Textarea
                value={metadata.storyPrompt || ''}
                onChange={(e) => handleMetadataChange('storyPrompt', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Keywords</Label>
              {metadata.keywords?.map((keyword: string, idx: number) => (
                <Input
                  key={`keyword-${idx}`}
                  value={keyword}
                  onChange={(e) => {
                    const newKeywords = [...(metadata.keywords || [])];
                    newKeywords[idx] = e.target.value;
                    handleMetadataChange('keywords', newKeywords);
                  }}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetadataChange('keywords', [...(metadata.keywords || []), ''])}
              >
                Add Keyword
              </Button>
            </div>
          </div>
        );

      case 'listening':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Audio Content URL</Label>
              <Input
                value={metadata.audioContent || ''}
                onChange={(e) => handleMetadataChange('audioContent', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Transcript</Label>
              <Textarea
                value={metadata.transcript || ''}
                onChange={(e) => handleMetadataChange('transcript', e.target.value)}
              />
            </div>
          </div>
        );

      case 'listenAndRepeat':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Phrases</Label>
              {metadata.phrases?.map((phrase: string, idx: number) => (
                <Input
                  key={`phrase-${idx}`}
                  value={phrase}
                  onChange={(e) => {
                    const newPhrases = [...(metadata.phrases || [])];
                    newPhrases[idx] = e.target.value;
                    handleMetadataChange('phrases', newPhrases);
                  }}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetadataChange('phrases', [...(metadata.phrases || []), ''])}
              >
                Add Phrase
              </Button>
            </div>
          </div>
        );

      case 'grammarSpeaking':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Grammar Point</Label>
              <Input
                value={metadata.grammarPoint || ''}
                onChange={(e) => handleMetadataChange('grammarPoint', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Example</Label>
              <Textarea
                value={metadata.example || ''}
                onChange={(e) => handleMetadataChange('example', e.target.value)}
              />
            </div>
          </div>
        );

      case 'idiomPractice':
        return (
          <div className="space-y-4">
            {metadata.idiomPractice?.map((item, idx) => (
              <div key={`idiom-${idx}`} className="space-y-2 p-4 border rounded">
                <Label>Idiom</Label>
                <Input
                  value={item.idiom}
                  onChange={(e) => {
                    const newIdioms = [...(metadata.idiomPractice || [])];
                    newIdioms[idx] = { ...item, idiom: e.target.value };
                    handleMetadataChange('idiomPractice', newIdioms);
                  }}
                />
                <Label>Meaning</Label>
                <Textarea
                  value={item.meaning}
                  onChange={(e) => {
                    const newIdioms = [...(metadata.idiomPractice || [])];
                    newIdioms[idx] = { ...item, meaning: e.target.value };
                    handleMetadataChange('idiomPractice', newIdioms);
                  }}
                />
                <Label>Usage Notes</Label>
                <Textarea
                  value={item.usageNotes}
                  onChange={(e) => {
                    const newIdioms = [...(metadata.idiomPractice || [])];
                    newIdioms[idx] = { ...item, usageNotes: e.target.value };
                    handleMetadataChange('idiomPractice', newIdioms);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMetadataChange('idiomPractice', [
                ...(metadata.idiomPractice || []),
                { idiom: '', meaning: '', example: '', usageNotes: '' }
              ])}
            >
              Add Idiom
            </Button>
          </div>
        );

      case 'lookAndSpeak':
        return (
          <div className="space-y-4">
            {metadata.lookAndSpeak?.map((item, idx) => (
              <div key={`look-speak-${idx}`} className="space-y-2 p-4 border rounded">
                <Label>Image URL</Label>
                <Input
                  value={item.imageUrl}
                  onChange={(e) => {
                    const newItems = [...(metadata.lookAndSpeak || [])];
                    newItems[idx] = { ...item, imageUrl: e.target.value };
                    handleMetadataChange('lookAndSpeak', newItems);
                  }}
                />
                <Label>Image Caption</Label>
                <Input
                  value={item.imageCaption}
                  onChange={(e) => {
                    const newItems = [...(metadata.lookAndSpeak || [])];
                    newItems[idx] = { ...item, imageCaption: e.target.value };
                    handleMetadataChange('lookAndSpeak', newItems);
                  }}
                />
                <Label>Instructions</Label>
                <Input
                  value={item.instructions}
                  onChange={(e) => {
                    const newItems = [...(metadata.lookAndSpeak || [])];
                    newItems[idx] = { ...item, instructions: e.target.value };
                    handleMetadataChange('lookAndSpeak', newItems);
                  }}
                />
                <Label>Helpful Vocabulary</Label>
                {item.helpfulVocabulary.map((word, vocabIdx) => (
                  <Input
                    key={`vocab-${vocabIdx}`}
                    value={word}
                    onChange={(e) => {
                      const newItems = [...(metadata.lookAndSpeak || [])];
                      newItems[idx].helpfulVocabulary[vocabIdx] = e.target.value;
                      handleMetadataChange('lookAndSpeak', newItems);
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newItems = [...(metadata.lookAndSpeak || [])];
                    newItems[idx].helpfulVocabulary.push('');
                    handleMetadataChange('lookAndSpeak', newItems);
                  }}
                >
                  Add Vocabulary
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMetadataChange('lookAndSpeak', [
                ...(metadata.lookAndSpeak || []),
                { imageUrl: '', imageCaption: '', helpfulVocabulary: [], instructions: '' }
              ])}
            >
              Add Look and Speak Item
            </Button>
          </div>
        );

      case 'watchAndSpeak':
        return (
          <div className="space-y-4">
            {metadata.watchAndSpeak?.map((item, idx) => (
              <div key={`watch-speak-${idx}`} className="space-y-2 p-4 border rounded">
                <Label>Video URL</Label>
                <Input
                  value={item.videoUrl}
                  onChange={(e) => {
                    const newItems = [...(metadata.watchAndSpeak || [])];
                    newItems[idx] = { ...item, videoUrl: e.target.value };
                    handleMetadataChange('watchAndSpeak', newItems);
                  }}
                />
                <Label>Instructions</Label>
                <Input
                  value={item.instructions}
                  onChange={(e) => {
                    const newItems = [...(metadata.watchAndSpeak || [])];
                    newItems[idx] = { ...item, instructions: e.target.value };
                    handleMetadataChange('watchAndSpeak', newItems);
                  }}
                />
                <Label>Discussion Points</Label>
                {item.discussionPoints.map((point, pointIdx) => (
                  <Input
                    key={`point-${pointIdx}`}
                    value={point}
                    onChange={(e) => {
                      const newItems = [...(metadata.watchAndSpeak || [])];
                      newItems[idx].discussionPoints[pointIdx] = e.target.value;
                      handleMetadataChange('watchAndSpeak', newItems);
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newItems = [...(metadata.watchAndSpeak || [])];
                    newItems[idx].discussionPoints.push('');
                    handleMetadataChange('watchAndSpeak', newItems);
                  }}
                >
                  Add Discussion Point
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMetadataChange('watchAndSpeak', [
                ...(metadata.watchAndSpeak || []),
                { videoUrl: '', discussionPoints: [], instructions: '' }
              ])}
            >
              Add Watch and Speak Item
            </Button>
          </div>
        );

      case 'debate':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input
                value={metadata.topic || ''}
                onChange={(e) => handleMetadataChange('topic', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Input
                value={metadata.position || ''}
                onChange={(e) => handleMetadataChange('position', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Key Points</Label>
              {metadata.keyPoints?.map((point: string, idx: number) => (
                <Input
                  key={`point-${idx}`}
                  value={point}
                  onChange={(e) => {
                    const newPoints = [...(metadata.keyPoints || [])];
                    newPoints[idx] = e.target.value;
                    handleMetadataChange('keyPoints', newPoints);
                  }}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetadataChange('keyPoints', [...(metadata.keyPoints || []), ''])}
              >
                Add Key Point
              </Button>
            </div>
          </div>
        );

      case 'presentation':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Topic</Label>
              <Input
                value={metadata.topic || ''}
                onChange={(e) => handleMetadataChange('topic', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration</Label>
              <Input
                value={metadata.duration || ''}
                onChange={(e) => handleMetadataChange('duration', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Structure</Label>
              {metadata.structure?.map((section: { title: string; points: string[] }, idx: number) => (
                <div key={`section-${idx}`} className="space-y-2 p-4 border rounded">
                  <Input
                    value={section.title}
                    onChange={(e) => {
                      const newStructure = [...(metadata.structure || [])];
                      newStructure[idx] = { ...section, title: e.target.value };
                      handleMetadataChange('structure', newStructure);
                    }}
                    placeholder="Section Title"
                  />
                  {section.points.map((point: string, pointIdx: number) => (
                    <Input
                      key={`point-${pointIdx}`}
                      value={point}
                      onChange={(e) => {
                        const newStructure = [...(metadata.structure || [])];
                        newStructure[idx].points[pointIdx] = e.target.value;
                        handleMetadataChange('structure', newStructure);
                      }}
                      placeholder="Point"
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newStructure = [...(metadata.structure || [])];
                      newStructure[idx].points.push('');
                      handleMetadataChange('structure', newStructure);
                    }}
                  >
                    Add Point
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetadataChange('structure', [...(metadata.structure || []), { title: '', points: [] }])}
              >
                Add Section
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Visual Aids</Label>
              {metadata.visualAids?.map((aid: { url: string; description: string }, idx: number) => (
                <div key={`aid-${idx}`} className="space-y-2 p-4 border rounded">
                  <Input
                    value={aid.url}
                    onChange={(e) => {
                      const newAids = [...(metadata.visualAids || [])];
                      newAids[idx] = { ...aid, url: e.target.value };
                      handleMetadataChange('visualAids', newAids);
                    }}
                    placeholder="URL"
                  />
                  <Input
                    value={aid.description}
                    onChange={(e) => {
                      const newAids = [...(metadata.visualAids || [])];
                      newAids[idx] = { ...aid, description: e.target.value };
                      handleMetadataChange('visualAids', newAids);
                    }}
                    placeholder="Description"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetadataChange('visualAids', [...(metadata.visualAids || []), { url: '', description: '' }])}
              >
                Add Visual Aid
              </Button>
            </div>
          </div>
        );

      case 'vocabularyAndSpeaking':
        return (
          <div className="space-y-4">
            {metadata.vocabularyAndSpeaking?.map((item, idx) => (
              <div key={`vocab-speak-${idx}`} className="space-y-2 p-4 border rounded">
                <Label>Speaking Prompt</Label>
                <Textarea
                  value={item.speakingPrompt}
                  onChange={(e) => {
                    const newItems = [...(metadata.vocabularyAndSpeaking || [])];
                    newItems[idx] = { ...item, speakingPrompt: e.target.value };
                    handleMetadataChange('vocabularyAndSpeaking', newItems);
                  }}
                />
                <Label>Vocabulary</Label>
                {item.vocabulary?.map((word, vocabIdx) => (
                  <Input
                    key={`vocab-${vocabIdx}`}
                    value={word}
                    onChange={(e) => {
                      const newItems = [...(metadata.vocabularyAndSpeaking || [])];
                      newItems[idx].vocabulary[vocabIdx] = e.target.value;
                      handleMetadataChange('vocabularyAndSpeaking', newItems);
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newItems = [...(metadata.vocabularyAndSpeaking || [])];
                    if (!newItems[idx].vocabulary) newItems[idx].vocabulary = [];
                    newItems[idx].vocabulary.push('');
                    handleMetadataChange('vocabularyAndSpeaking', newItems);
                  }}
                >
                  Add Vocabulary
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMetadataChange('vocabularyAndSpeaking', [
                ...(metadata.vocabularyAndSpeaking || []),
                { speakingPrompt: '', vocabulary: [] }
              ])}
            >
              Add Vocabulary and Speaking Item
            </Button>
          </div>
        );

      case 'vocabularyAndWordlist':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Wordlist</Label>
              {metadata.wordlistPrompt?.map((word: {
                word: string;
                definition: string;
                correctPronunciation: string;
                phoneticGuide: string;
                pronunciationAudio: string;
                example: string;
                usageNotes: string;
                synonyms: string[];
                antonyms: string[];
              }, idx: number) => (
                <div key={`word-${idx}`} className="space-y-2 p-4 border rounded">
                  <Input
                    value={word.word}
                    onChange={(e) => {
                      const newWordlist = [...(metadata.wordlistPrompt || [])];
                      newWordlist[idx] = { ...word, word: e.target.value };
                      handleMetadataChange('wordlistPrompt', newWordlist);
                    }}
                    placeholder="Word"
                  />
                  <Input
                    value={word.definition}
                    onChange={(e) => {
                      const newWordlist = [...(metadata.wordlistPrompt || [])];
                      newWordlist[idx] = { ...word, definition: e.target.value };
                      handleMetadataChange('wordlistPrompt', newWordlist);
                    }}
                    placeholder="Definition"
                  />
                  <Input
                    value={word.correctPronunciation}
                    onChange={(e) => {
                      const newWordlist = [...(metadata.wordlistPrompt || [])];
                      newWordlist[idx] = { ...word, correctPronunciation: e.target.value };
                      handleMetadataChange('wordlistPrompt', newWordlist);
                    }}
                    placeholder="Correct Pronunciation"
                  />
                  <Input
                    value={word.phoneticGuide}
                    onChange={(e) => {
                      const newWordlist = [...(metadata.wordlistPrompt || [])];
                      newWordlist[idx] = { ...word, phoneticGuide: e.target.value };
                      handleMetadataChange('wordlistPrompt', newWordlist);
                    }}
                    placeholder="Phonetic Guide"
                  />
                  <Input
                    value={word.pronunciationAudio}
                    onChange={(e) => {
                      const newWordlist = [...(metadata.wordlistPrompt || [])];
                      newWordlist[idx] = { ...word, pronunciationAudio: e.target.value };
                      handleMetadataChange('wordlistPrompt', newWordlist);
                    }}
                    placeholder="Pronunciation Audio URL"
                  />
                  <Textarea
                    value={word.example}
                    onChange={(e) => {
                      const newWordlist = [...(metadata.wordlistPrompt || [])];
                      newWordlist[idx] = { ...word, example: e.target.value };
                      handleMetadataChange('wordlistPrompt', newWordlist);
                    }}
                    placeholder="Example"
                  />
                  <Textarea
                    value={word.usageNotes}
                    onChange={(e) => {
                      const newWordlist = [...(metadata.wordlistPrompt || [])];
                      newWordlist[idx] = { ...word, usageNotes: e.target.value };
                      handleMetadataChange('wordlistPrompt', newWordlist);
                    }}
                    placeholder="Usage Notes"
                  />
                  <div className="space-y-2">
                    <Label>Synonyms</Label>
                    {word.synonyms.map((synonym: string, synIdx: number) => (
                      <Input
                        key={`synonym-${synIdx}`}
                        value={synonym}
                        onChange={(e) => {
                          const newWordlist = [...(metadata.wordlistPrompt || [])];
                          newWordlist[idx].synonyms[synIdx] = e.target.value;
                          handleMetadataChange('wordlistPrompt', newWordlist);
                        }}
                      />
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newWordlist = [...(metadata.wordlistPrompt || [])];
                        newWordlist[idx].synonyms.push('');
                        handleMetadataChange('wordlistPrompt', newWordlist);
                      }}
                    >
                      Add Synonym
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Antonyms</Label>
                    {word.antonyms.map((antonym: string, antIdx: number) => (
                      <Input
                        key={`antonym-${antIdx}`}
                        value={antonym}
                        onChange={(e) => {
                          const newWordlist = [...(metadata.wordlistPrompt || [])];
                          newWordlist[idx].antonyms[antIdx] = e.target.value;
                          handleMetadataChange('wordlistPrompt', newWordlist);
                        }}
                      />
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newWordlist = [...(metadata.wordlistPrompt || [])];
                        newWordlist[idx].antonyms.push('');
                        handleMetadataChange('wordlistPrompt', newWordlist);
                      }}
                    >
                      Add Antonym
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetadataChange('wordlistPrompt', [...(metadata.wordlistPrompt || []), {
                  word: '',
                  definition: '',
                  correctPronunciation: '',
                  phoneticGuide: '',
                  pronunciationAudio: '',
                  example: '',
                  usageNotes: '',
                  synonyms: [],
                  antonyms: []
                }])}
              >
                Add Word
              </Button>
            </div>
          </div>
        );

      case 'objectAndSpeaking':
        return (
          <div className="space-y-4">
            {(metadata.objectAndSpeaking || []).map((item, idx) => (
              <div key={idx} className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Speaking Prompt</Label>
                  <Textarea
                    value={item.speakingPrompt || ''}
                    onChange={(e) => {
                      const newItems = [...(metadata.objectAndSpeaking || [])];
                      newItems[idx] = { ...newItems[idx], speakingPrompt: e.target.value };
                      handleMetadataChange('objectAndSpeaking', newItems);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Object Prompt</Label>
                  <Textarea
                    value={item.objectPrompt || ''}
                    onChange={(e) => {
                      const newItems = [...(metadata.objectAndSpeaking || [])];
                      newItems[idx] = { ...newItems[idx], objectPrompt: e.target.value };
                      handleMetadataChange('objectAndSpeaking', newItems);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMetadataChange('objectAndSpeaking', [...(metadata.objectAndSpeaking || []), {
                speakingPrompt: '',
                objectPrompt: ''
              }])}
            >
              Add Object and Speaking
            </Button>
          </div>
        );

      case 'objectActionAndSpeaking':
        return (
          <div className="space-y-4">
            {(metadata.objectActionAndSpeaking || []).map((item, idx) => (
              <div key={idx} className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Speaking Prompt</Label>
                  <Textarea
                    value={item.speakingPrompt || ''}
                    onChange={(e) => {
                      const newItems = [...(metadata.objectActionAndSpeaking || [])];
                      newItems[idx] = { ...newItems[idx], speakingPrompt: e.target.value };
                      handleMetadataChange('objectActionAndSpeaking', newItems);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Object Prompt</Label>
                  <Textarea
                    value={item.objectPrompt || ''}
                    onChange={(e) => {
                      const newItems = [...(metadata.objectActionAndSpeaking || [])];
                      newItems[idx] = { ...newItems[idx], objectPrompt: e.target.value };
                      handleMetadataChange('objectActionAndSpeaking', newItems);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Action Prompt</Label>
                  <Textarea
                    value={item.actionPrompt || ''}
                    onChange={(e) => {
                      const newItems = [...(metadata.objectActionAndSpeaking || [])];
                      newItems[idx] = { ...newItems[idx], actionPrompt: e.target.value };
                      handleMetadataChange('objectActionAndSpeaking', newItems);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMetadataChange('objectActionAndSpeaking', [...(metadata.objectActionAndSpeaking || []), {
                speakingPrompt: '',
                objectPrompt: '',
                actionPrompt: ''
              }])}
            >
              Add Object Action and Speaking
            </Button>
          </div>
        );

      case 'sentenceFormation':
        return (
          <div className="space-y-4">
            {metadata.sentenceFormation?.map((item: {
              originalSentence: string;
              hints: string[];
              correctAnswer: string;
            }, idx: number) => (
              <div key={`sentence-${idx}`} className="space-y-2 p-4 border rounded">
                <Label>Original Sentence</Label>
                <Input
                  value={item.originalSentence}
                  onChange={(e) => {
                    const newItems = [...(metadata.sentenceFormation || [])];
                    newItems[idx] = { ...item, originalSentence: e.target.value };
                    handleMetadataChange('sentenceFormation', newItems);
                  }}
                />
                <Label>Hints</Label>
                {item.hints?.map((hint, hintIdx) => (
                  <Input
                    key={`hint-${hintIdx}`}
                    value={hint}
                    onChange={(e) => {
                      const newItems = [...(metadata.sentenceFormation || [])];
                      if (!newItems[idx].hints) newItems[idx].hints = [];
                      newItems[idx].hints[hintIdx] = e.target.value;
                      handleMetadataChange('sentenceFormation', newItems);
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newItems = [...(metadata.sentenceFormation || [])];
                    if (!newItems[idx].hints) newItems[idx].hints = [];
                    newItems[idx].hints.push('');
                    handleMetadataChange('sentenceFormation', newItems);
                  }}
                >
                  Add Hint
                </Button>
                <Label>Correct Answer</Label>
                <Input
                  value={item.correctAnswer}
                  onChange={(e) => {
                    const newItems = [...(metadata.sentenceFormation || [])];
                    newItems[idx] = { ...item, correctAnswer: e.target.value };
                    handleMetadataChange('sentenceFormation', newItems);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMetadataChange('sentenceFormation', [
                ...(metadata.sentenceFormation || []),
                { originalSentence: '', hints: [], correctAnswer: '' }
              ])}
            >
              Add Sentence Formation
            </Button>
          </div>
        );

      case 'sentenceTransformation':
        return (
          <div className="space-y-4">
            {metadata.sentenceTransformation?.map((item, idx) => (
              <div key={`transform-${idx}`} className="space-y-2 p-4 border rounded">
                <Label>Original Sentence</Label>
                <Input
                  value={item.originalSentence}
                  onChange={(e) => {
                    const newItems = [...(metadata.sentenceTransformation || [])];
                    newItems[idx] = { ...item, originalSentence: e.target.value };
                    handleMetadataChange('sentenceTransformation', newItems);
                  }}
                />
                <Label>Tense to Transform</Label>
                <Input
                  value={item.tenseToTransform}
                  onChange={(e) => {
                    const newItems = [...(metadata.sentenceTransformation || [])];
                    newItems[idx] = { ...item, tenseToTransform: e.target.value };
                    handleMetadataChange('sentenceTransformation', newItems);
                  }}
                />
                <Label>Hints</Label>
                {item.hints?.map((hint, hintIdx) => (
                  <Input
                    key={`hint-${hintIdx}`}
                    value={hint}
                    onChange={(e) => {
                      const newItems = [...(metadata.sentenceTransformation || [])];
                      if (!newItems[idx].hints) newItems[idx].hints = [];
                      newItems[idx].hints[hintIdx] = e.target.value;
                      handleMetadataChange('sentenceTransformation', newItems);
                    }}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newItems = [...(metadata.sentenceTransformation || [])];
                    if (!newItems[idx].hints) newItems[idx].hints = [];
                    newItems[idx].hints.push('');
                    handleMetadataChange('sentenceTransformation', newItems);
                  }}
                >
                  Add Hint
                </Button>
                <Label>Correct Answer</Label>
                <Input
                  value={item.correctAnswer}
                  onChange={(e) => {
                    const newItems = [...(metadata.sentenceTransformation || [])];
                    newItems[idx] = { ...item, correctAnswer: e.target.value };
                    handleMetadataChange('sentenceTransformation', newItems);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMetadataChange('sentenceTransformation', [
                ...(metadata.sentenceTransformation || []),
                { originalSentence: '', tenseToTransform: '', hints: [], correctAnswer: '' }
              ])}
            >
              Add Sentence Transformation
            </Button>
          </div>
        );

      case 'sentenceCompletion':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sentence</Label>
              <Input
                value={metadata.sentence || ''}
                onChange={(e) => handleMetadataChange('sentence', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Hints</Label>
              {metadata.hints?.map((hint: string, idx: number) => (
                <Input
                  key={`hint-${idx}`}
                  value={hint}
                  onChange={(e) => {
                    const newHints = [...(metadata.hints || [])];
                    newHints[idx] = e.target.value;
                    handleMetadataChange('hints', newHints);
                  }}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleMetadataChange('hints', [...(metadata.hints || []), ''])}
              >
                Add Hint
              </Button>
            </div>
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <Input
                value={metadata.correctAnswer || ''}
                onChange={(e) => handleMetadataChange('correctAnswer', e.target.value)}
              />
            </div>
          </div>
        );

      case 'sentenceTransformationAndCompletion':
        return (
          <div className="space-y-4">
            {(metadata.sentenceTransformationAndCompletion || []).map((item, idx) => (
              <div key={idx} className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Original Sentence</Label>
                  <Input
                    value={item.originalSentence || ''}
                    onChange={(e) => {
                      const newItems = [...(metadata.sentenceTransformationAndCompletion || [])];
                      newItems[idx] = { ...newItems[idx], originalSentence: e.target.value };
                      handleMetadataChange('sentenceTransformationAndCompletion', newItems);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tense to Transform</Label>
                  <Input
                    value={item.tenseToTransform || ''}
                    onChange={(e) => {
                      const newItems = [...(metadata.sentenceTransformationAndCompletion || [])];
                      newItems[idx] = { ...newItems[idx], tenseToTransform: e.target.value };
                      handleMetadataChange('sentenceTransformationAndCompletion', newItems);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hints</Label>
                  {(item.hints || []).map((hint, hintIdx) => (
                    <Input
                      key={`hint-${hintIdx}`}
                      value={hint}
                      onChange={(e) => {
                        const newItems = [...(metadata.sentenceTransformationAndCompletion || [])];
                        const newHints = [...(newItems[idx].hints || [])];
                        newHints[hintIdx] = e.target.value;
                        newItems[idx] = { ...newItems[idx], hints: newHints };
                        handleMetadataChange('sentenceTransformationAndCompletion', newItems);
                      }}
                    />
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newItems = [...(metadata.sentenceTransformationAndCompletion || [])];
                      const newHints = [...(newItems[idx].hints || []), ''];
                      newItems[idx] = { ...newItems[idx], hints: newHints };
                      handleMetadataChange('sentenceTransformationAndCompletion', newItems);
                    }}
                  >
                    Add Hint
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Correct Answer</Label>
                  <Input
                    value={item.correctAnswer || ''}
                    onChange={(e) => {
                      const newItems = [...(metadata.sentenceTransformationAndCompletion || [])];
                      newItems[idx] = { ...newItems[idx], correctAnswer: e.target.value };
                      handleMetadataChange('sentenceTransformationAndCompletion', newItems);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newItems = [...(metadata.sentenceTransformationAndCompletion || []), {
                  originalSentence: '',
                  tenseToTransform: '',
                  hints: [],
                  correctAnswer: ''
                }];
                handleMetadataChange('sentenceTransformationAndCompletion', newItems);
              }}
            >
              Add Sentence Transformation and Completion
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Unsupported question type</Label>
              <p className="text-sm text-gray-500">
                This question type ({question.type}) is not yet supported.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={cn(
      "border-l-4 transition-colors duration-200",
      isExpanded ? "border-l-primary" : "border-l-primary/40 hover:border-l-primary"
    )}>
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="flex-shrink-0 px-2 py-1 bg-primary/10 rounded-md text-sm font-semibold text-primary">
              Q {index + 1}
            </span>
            <div className="flex items-center gap-2">
              <QuestionTypeIcon type={question.type} className="text-primary" />
              <span className="text-sm text-muted-foreground truncate">
                {QUESTION_TYPES[question.type]?.label}
                {hasSubType(question) && question.sub_type !== question.type && (
                  <span className="ml-2 text-xs text-muted-foreground/60">
                    ({question.sub_type?.replace?.(/_/g, ' ') ?? question.sub_type})
                  </span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="hover:bg-accent"
            >
              {isExpanded ? 
                <ChevronDown className="h-4 w-4 text-primary" /> : 
                <ChevronRight className="h-4 w-4 text-primary" />
              }
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(index)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Question Text</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Icon 
                        type="phosphor"
                        name="SPINNER"
                        className="h-4 w-4 animate-spin text-primary"
                      />}
                      {lastSaved === 'success' && <Icon 
                        type="phosphor"
                        name="CHECK"
                        className="h-4 w-4 text-green-500"
                      />}
                      {lastSaved === 'error' && <Icon 
                        type="phosphor"
                        name="X"
                        className="h-4 w-4 text-destructive"
                      />}
                    </div>
                  </div>
                  <Textarea
                    value={question.data?.prompt || ''}
                    onChange={(e) => handleFieldChange('prompt', e.target.value)}
                    placeholder="Enter the question text"
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Teacher Script (Optional)</Label>
                    <div className="flex items-center gap-2">
                      {isSaving && <Icon 
                        type="phosphor"
                        name="SPINNER"
                        className="h-4 w-4 animate-spin text-primary"
                      />}
                      {lastSaved === 'success' && <Icon 
                        type="phosphor"
                        name="CHECK"
                        className="h-4 w-4 text-green-500"
                      />}
                      {lastSaved === 'error' && <Icon 
                        type="phosphor"
                        name="X"
                        className="h-4 w-4 text-destructive"
                      />}
                    </div>
                  </div>
                  <Textarea
                    value={question.data?.teacher_script || ''}
                    onChange={(e) => handleFieldChange('teacher_script', e.target.value)}
                    placeholder="Enter the teacher script"
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFieldChange('sampleAnswer', question.data?.sample_answer ? '' : 'Sample answer here...')}
                    className="gap-2"
                  >
                    {question.data?.sample_answer ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {question.data?.sample_answer ? 'Remove Sample Answer' : 'Add Sample Answer'}
                  </Button>
                </div>

                {question.data?.sample_answer && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Sample Answer</Label>
                      <div className="flex items-center gap-2">
                        {isSaving && <Icon 
                          type="phosphor"
                          name="SPINNER"
                          className="h-4 w-4 animate-spin text-primary"
                        />}
                        {lastSaved === 'success' && <Icon 
                          type="phosphor"
                          name="CHECK"
                          className="h-4 w-4 text-green-500"
                        />}
                        {lastSaved === 'error' && <Icon 
                          type="phosphor"
                          name="X"
                          className="h-4 w-4 text-destructive"
                        />}
                      </div>
                    </div>
                    <Textarea
                      value={question.data?.sample_answer || ''}
                      onChange={(e) => handleFieldChange('sample_answer', e.target.value)}
                      placeholder="Enter a sample answer"
                      className="min-h-[100px]"
                    />
                  </div>
                )}

                {/* Exercise Prompts */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Exercise Prompts</Label>
                  </div>
                  
                  {question.exercisePrompts.map((prompt, promptIndex) => (
                    <ExercisePromptCard
                      key={promptIndex}
                      prompt={prompt}
                      promptIndex={promptIndex}
                      onUpdate={(updatedPrompt) => onExercisePromptChange(index, promptIndex, updatedPrompt)}
                      onRemove={() => onRemoveExercisePrompt(index, promptIndex)}
                    />
                  ))}
                </div>

                {renderQuestionFields(question)}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Add Prompt Button */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 right-8 z-50"
        >
          <Button
            onClick={() => onAddExercisePrompt(index)}
            className="rounded-full shadow-lg gap-2"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Add Prompt
          </Button>
        </motion.div>
      )}
    </Card>
  );
} 