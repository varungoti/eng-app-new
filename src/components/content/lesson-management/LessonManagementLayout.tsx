"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Icon } from '@/components/ui/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuestionForm } from './components/question-form';
import ErrorBoundaryWrapper from './ErrorBoundaryWrapper';
import { useLessonManagement } from '@/modules/lesson-management/hooks/useLessonManagement';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Grade, Topic, Lesson, LessonManagementData } from '@/modules/lesson-management/types';
import { animate } from 'framer-motion';

export function LessonManagementLayout() {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [activeTab, setActiveTab] = useState('questions');

  const {
    data = { grades: [], topics: [], lessons: [] } as LessonManagementData,
    isLoading,
    error
  } = useLessonManagement({
    gradeId: selectedGrade,
    topicId: selectedTopic
  });

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
  };

  const handleAddQuestion = () => {
    // TODO: Implement add question functionality
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error instanceof Error ? error.message : 'An error occurred'}</div>;
  }

  return (
    <ErrorBoundaryWrapper name="LessonManagementLayout">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lesson Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <Icon type="phosphor" name="ARROWS_CLOCKWISE" className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleAddQuestion}>
              <Icon type="phosphor" name="PLUS" className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Card className="col-span-4 p-4">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium mb-2">Content Management</h2>
                <p className="text-sm text-muted-foreground mb-4">Create and manage your lessons</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Icon type="phosphor" name="EYE_SLASH" className="h-4 w-4" />
                    View
                  </Button>
                  <Button className="gap-2">
                    <Icon type="phosphor" name="PENCIL_SIMPLE" className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Grade</label>
                  <Select value={selectedGrade || ''} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.grades.map((grade: Grade) => (
                        <SelectItem key={grade.id} value={grade.id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Topic</label>
                  <Select value={selectedTopic || ''} onValueChange={setSelectedTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.topics.map((topic: Topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full gap-2">
                  <Icon type="phosphor" name="PLUS" className="mr-2 h-4 w-4" />
                  Add New Topic
                </Button>
              </div>
            </div>
          </Card>

          {/* Main Content Area */}
          <div className="col-span-8">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Lesson Title</label>
                  <Input 
                    placeholder="Enter lesson title"
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                  />
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="questions">
                      <Icon type="phosphor" name="CHAT_SQUARE_TEXT" className="mr-2" />
                      Questions
                    </TabsTrigger>
                    <TabsTrigger value="activities">
                      <Icon type="phosphor" name="BOOK_OPEN" className="mr-2 h-4 w-4" />
                      Activities
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="questions" className="space-y-4">
                    <QuestionForm
                      question={{
                        type: 'speaking',
                        data: {
                          prompt: '',
                          teacherScript: ''
                        },
                        metadata: {
                          sampleAnswer: '',
                          storyPrompt: '',
                          keywords: [],
                          hints: [],
                          audioContent: '',
                          transcript: '',
                          questions: [],
                          phrases: [],
                          translations: [],
                          options: [],
                          correctAnswer: null,
                          grammarPoint: '',
                          example: '',
                          visualAids: [],
                          visualAidsInstructions: '',
                          idiom: '',
                          meaning: '',
                          usageNotes: '',
                          imageUrl: '',
                          audioUrl: '',
                          videoUrl: '',
                          documentUrl: '',
                          audioTranscript: '',
                          videoTranscript: '',
                          documentTranscript: '',
                          audioDuration: 0,
                          videoDuration: 0,
                          documentDuration: 0,
                          audioSize: 0,
                          videoSize: 0,
                          documentSize: 0
                        },
                        exercisePrompts: []
                      }}
                      index={0}
                      onUpdate={() => {}}
                      onRemove={() => {}}
                      onAddExercisePrompt={() => {}}
                      onRemoveExercisePrompt={() => {}}
                      onExercisePromptChange={() => {}}
                    />
                  </TabsContent>

                  <TabsContent value="activities">
                    Activities content coming soon...
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
} 