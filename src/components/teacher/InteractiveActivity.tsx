"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ImagePreview } from "@/components/common/ImagePreview";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, ArrowRight, Sparkles, Volume2, Mic, GripVertical, Pencil, Image as ImageIcon, Type, SplitSquareHorizontal, Play, Pause, Star, Trophy, Gift, Timer, Brain, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InteractiveActivityProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  onActivityComplete: (result: ActivityResult) => void;
}

interface ActivityResult {
  score: number;
  accuracy: number;
  timeSpent: number;
  completedTasks: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function InteractiveActivity({
  difficulty,
  onActivityComplete
}: InteractiveActivityProps) {
  const { toast } = useToast();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [writingResponse, setWritingResponse] = useState('');
  const [translationInput, setTranslationInput] = useState('');
  const [currentScore, setCurrentScore] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState(0);

  // Update content state type
  const [content] = useState<{
    items: any[];
    correctAnswer: string;
    correctTranslation: string;
    pairs: Record<string, string>;
    correctOrder: string[];
    question: string;
    questions: any[];
    passage: string;
    word: string;
    options: string[];
    sourceText: string;
    sentence: string;
    words: string[];
    instruction: string;
    imageUrl: string;
    text: string;
  }>({
    items: [],
    correctAnswer: '',
    correctTranslation: '',
    pairs: {},
    correctOrder: [],
    question: '',
    questions: [],
    passage: '',
    word: '',
    options: [],
    sourceText: '',
    sentence: '',
    words: [],
    instruction: '',
    imageUrl: '',
    text: ''
  });

  const [dragItems, setDragItems] = useState(content.items || []);

  // Add type state
  const [type, setType] = useState<'multiple-choice' | 'fill-blank' | 'matching' | 'drag-drop' | 'speaking' | 'listening' | 'word-bank' | 'sentence-arrangement' | 'picture-description' | 'comprehension' | 'grammar-correction' | 'vocabulary-quiz' | 'translation'>('multiple-choice');

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === content.correctAnswer;
    
    toast({
      title: isCorrect ? "Correct!" : "Try Again",
      description: isCorrect ? "Great job! Let's move on." : "Keep trying, you can do it!"
    });

    if (isCorrect) {
      setScore(prev => prev + 10);
      setTimeout(onNext, 1500);
    }
  };

  const handleFillBlank = () => {
    const isCorrect = userInput.toLowerCase() === content.correctAnswer.toLowerCase();
    handleAnswer(userInput);
  };

  const handleMatching = (item: string, match: string) => {
    setMatchedPairs(prev => ({
      ...prev,
      [item]: match
    }));

    // Check if all pairs are matched correctly
    const allMatched = Object.entries(matchedPairs).every(
      ([item, match]) => content.pairs[item] === match
    );

    if (allMatched) {
      setScore(prev => prev + 20);
      onNext();
    }
  };

  const handleDragEnd = () => {
    const isCorrect = dragItems.every((item: any, index: number) => 
      item.id === content.correctOrder[index]
    );

    if (isCorrect) {
      setScore(prev => prev + 15);
      onNext();
    }
  };

  const handleWritingSubmit = () => {
    // Here you would typically send the writing for AI analysis
    toast({
      title: "Writing Submitted",
      description: "Your response has been saved for review."
    });
    setScore(prev => prev + 15);
    setTimeout(onNext, 1000);
  };

  const handleTranslation = () => {
    const isCorrect = translationInput.toLowerCase() === content.correctTranslation.toLowerCase();
    toast({
      title: isCorrect ? "Excellent Translation!" : "Try Again",
      description: isCorrect ? "Your translation is accurate." : "Review and try again."
    });
    if (isCorrect) {
      setScore(prev => prev + 20);
      setTimeout(onNext, 1500);
    }
  };

  const startActivity = () => {
    setIsPlaying(true);
    setProgress(0);
    // Initialize activity-specific state
  };

  const pauseActivity = () => {
    setIsPlaying(false);
  };

  const completeActivity = () => {
    const result: ActivityResult = {
      score: currentScore,
      accuracy: Math.random() * 100, // Replace with actual accuracy calculation
      timeSpent: 120, // Replace with actual time tracking
      completedTasks: 5, // Replace with actual completed tasks count
      achievements
    };
    onActivityComplete(result);
  };

  const unlockAchievement = (achievement: Achievement) => {
    setAchievements(prev => [...prev, achievement]);
  };

  const onNext = () => {
    // Reset states for next question
    setSelectedAnswer(null);
    setUserInput('');
    setMatchedPairs({});
    setProgress(prev => Math.min(prev + 20, 100));
    
    if (progress >= 100) {
      completeActivity();
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'multiple-choice':
        return (
          <div className="space-y-6">
            <motion.h3
              variants={itemVariants}
              className="text-xl font-medium text-center"
            >
              {content.question}
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.options.map((option: string, index: number) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full py-8 text-lg",
                      selectedAnswer === option && "border-2",
                      selectedAnswer === option && option === content.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : selectedAnswer === option
                        ? "border-red-500 bg-red-50"
                        : ""
                    )}
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'fill-blank':
        return (
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="text-xl font-medium text-center"
              dangerouslySetInnerHTML={{ 
                __html: content.text.replace('___', 
                  `<input type="text" class="border-b-2 border-primary w-32 text-center mx-2 focus:outline-none" value="${userInput}" />`
                )
              }}
            />
            <div className="flex justify-center">
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-64 text-center"
                placeholder="Type your answer..."
              />
            </div>
            <div className="flex justify-center">
              <Button onClick={handleFillBlank}>
                Check Answer
              </Button>
            </div>
          </div>
        );

      case 'matching':
        return (
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              {Object.keys(content.pairs).map((item) => (
                <motion.div
                  key={item}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-primary/10 rounded-lg"
                >
                  {item}
                </motion.div>
              ))}
            </div>
            <div className="space-y-4">
              {Object.values(content.pairs).map((match) => (
                <motion.div
                  key={match}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-secondary/10 rounded-lg cursor-pointer"
                  onClick={() => handleMatching(Object.keys(content.pairs)[0], match)}
                >
                  {match}
                </motion.div>

              ))}
            </div>
          </div>
        );

      case 'drag-drop':
        return (
          <Reorder.Group
            axis="y"
            values={dragItems}
            onReorder={setDragItems}
            className="space-y-4"
          >
            {dragItems.map((item: any) => (
              <Reorder.Item
                key={item.id}
                value={item}
                className="p-4 bg-white rounded-lg shadow cursor-move"
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <span>{item.text}</span>
                </div>
              </Reorder.Item>

            ))}
          </Reorder.Group>
        );

      case 'speaking':
        return (
          <div className="space-y-6 text-center">
            <motion.div
              variants={itemVariants}
              className="text-xl font-medium"
            >
              {content.questions[0].prompt}
            </motion.div>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setIsRecording(!isRecording)}
                variant={isRecording ? "destructive" : "secondary"}
                className="w-40"
              >
                {isRecording ? (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Record
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      case 'listening':
        return (
          <div className="space-y-6 text-center">
            <Button
              size="lg"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-40"
            >
              {isPlaying ? (
                <>
                  <Volume2 className="mr-2 h-5 w-5" />
                  Stop
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-5 w-5" />
                  Play
                </>
              )}
            </Button>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {content.questions.map((q: any, index: number) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="space-y-2"
                >
                  <p className="font-medium">{q.question}</p>
                  <Input
                    placeholder="Your answer..."
                    className="w-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'word-bank':
        return (
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="text-xl font-medium text-center"
            >
              {content.sentence}
            </motion.div>
            <div className="flex flex-wrap gap-2 justify-center">
              {content.words.map((word: string, index: number) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-primary/10 rounded-lg cursor-pointer"
                >
                  {word}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'sentence-arrangement':
        return (
          <div className="space-y-6">
            <motion.h3
              variants={itemVariants}
              className="text-xl font-medium text-center"
            >
              {content.instruction}
            </motion.h3>
            <Reorder.Group
              axis="y"
              values={dragItems}
              onReorder={setDragItems}
              className="space-y-2"
            >
              {dragItems.map((item: any) => (
                <Reorder.Item
                  key={item.id}
                  value={item}
                  className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg shadow cursor-move"
                >
                  <div className="flex items-center gap-4">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <span>{item.text}</span>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        );

      case 'picture-description':
        return (
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="aspect-video relative rounded-lg overflow-hidden"
            >
              <ImagePreview
                imageUrl={content.imageUrl}
                width={800}
                height={450}
                className="object-cover"
              />
            </motion.div>
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Describe this picture:</h3>
              <textarea
                value={writingResponse}
                onChange={(e) => setWritingResponse(e.target.value)}
                className="w-full h-32 p-4 rounded-lg border focus:ring-2 focus:ring-primary"
                placeholder="Write your description here..."
              />
              <Button onClick={handleWritingSubmit} className="w-full">
                Submit Description
              </Button>
            </div>
          </div>
        );

      case 'comprehension':
        return (
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content.passage }}
            />
            <div className="space-y-4">
              {content.questions.map((q: any, index: number) => (
                <Card key={index} className="p-4">
                  <h4 className="font-medium mb-2">{q.question}</h4>
                  <div className="space-y-2">
                    {q.options.map((option: string, optIndex: number) => (
                      <Button
                        key={optIndex}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleAnswer(option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'grammar-correction':
        return (
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="text-xl font-medium text-center"
            >
              {content.instruction}
            </motion.div>
            <Card className="p-4">
              <p className="text-lg mb-4">{content.sentence}</p>
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full"
                placeholder="Type the corrected sentence..."
              />
              <Button
                onClick={() => handleAnswer(userInput)}
                className="mt-4"
              >
                Check Correction
              </Button>
            </Card>
          </div>
        );

      case 'vocabulary-quiz':
        return (
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="text-xl font-medium text-center"
            >
              {content.word}
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {content.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  className="p-6 text-lg"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'translation':
        return (
          <div className="space-y-6">
            <Card className="p-4 bg-primary/5">
              <p className="text-lg font-medium">{content.sourceText}</p>
            </Card>
            <div className="space-y-4">
              <textarea
                value={translationInput}
                onChange={(e) => setTranslationInput(e.target.value)}
                className="w-full h-32 p-4 rounded-lg border focus:ring-2 focus:ring-primary"
                placeholder="Type your translation here..."
              />
              <Button
                onClick={handleTranslation}
                className="w-full"
              >
                Check Translation
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Gamepad2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Interactive Activity</CardTitle>
              <p className="text-sm text-muted-foreground">
                Difficulty: {difficulty}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="font-bold">{currentScore} pts</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant={isPlaying ? "destructive" : "default"}
              onClick={isPlaying ? pauseActivity : startActivity}
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">02:00</span>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        {/* Activity Content */}
        <AnimatePresence mode="wait">
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {renderContent()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    {achievement.icon}
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 