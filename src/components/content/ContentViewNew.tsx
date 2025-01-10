import React, { useState } from 'react';
import { useContentStore } from '../../lib/content/store';
import { useContentQuery } from '../../hooks/content/useContentQuery';
import { useContentMutation } from '../../hooks/content/useContentMutation';
import { useToast } from '../../hooks/useToast';
import ContentLoadingState from './ContentLoadingState';
import ContentErrorState from './ContentErrorState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import LoadingProgress from '../LoadingProgress';
import LessonEditor from '../LessonEditor';

interface ContentViewNewProps {
  mode?: 'view' | 'edit';
}

export const ContentViewNew: React.FC<ContentViewNewProps> = ({ mode = 'edit' }) => {
  const {
    selectedGrade,
    selectedTopic,
    selectedSubTopic,
    selectedLesson,
    setSelectedGrade,
    setSelectedTopic,
    setSelectedSubTopic,
    setSelectedLesson
  } = useContentStore();

  const [activeTab, setActiveTab] = useState(mode === 'edit' ? 'editor' : 'structure');
  const [loadProgress, setLoadProgress] = useState(0);
  const { showToast } = useToast();
  const [showAddTopicDialog, setShowAddTopicDialog] = useState(false);

  const { 
    grades, 
    topics, 
    subTopics, 
    lessons, 
    loading,
    progress,
    error,
    refresh 
  } = useContentQuery(selectedGrade, selectedTopic, selectedSubTopic, setLoadProgress);

  const { createContent, updateContent } = useContentMutation();

  if (loading) {
    return <ContentLoadingState progress={loadProgress} />;
  }

  if (error) {
    return <ContentErrorState error={error} onRetry={refresh} />;
  }

  const handleAddTopic = async (data: { title: string; description: string }) => {
    if (!selectedGrade) {
      showToast('Please select a grade first', { type: 'error' });
      return;
    }
    
    try {
      const result = await createContent({
        type: 'topics',
        data: {
          grade_id: selectedGrade,
          title: data.title,
          description: data.description,
          order: topics.filter(t => t.gradeId === selectedGrade).length
        }
      });
      
      // Set the newly created topic as selected
      if (result?.id) {
        setSelectedTopic(result.id);
      }

      showToast('Topic created successfully', { type: 'success' });
      setShowAddTopicDialog(false);
      await refresh();
    } catch (err) {
      showToast('Failed to create topic', { type: 'error' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <LoadingProgress isLoading={loading} progress={progress} />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="border-b border-gray-200 bg-white">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">Content Management</h1>
            <p className="mt-1 text-sm text-gray-500">Create and manage educational content</p>
          </div>
          <TabsList className="px-8">
            <TabsTrigger value="structure">Content Structure</TabsTrigger>
            <TabsTrigger value="editor">Content Editor</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
        <TabsContent value="structure" className="h-full">
          <div className="h-full flex divide-x divide-gray-200">
            {/* Grades List */}
            <div className="w-1/4 bg-gray-50">
              <div className="p-4 border-b">
                <h2 className="text-sm font-medium text-gray-700">Grade Levels</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-1 p-2">
                  {grades.map((grade) => (
                    <button
                      key={grade.id}
                      onClick={() => setSelectedGrade(grade.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md text-sm",
                        selectedGrade === grade.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {grade.name}
                      <ChevronRight className="float-right h-4 w-4 mt-0.5" />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Topics List */}
            <div className="w-1/4 bg-white">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-700">Topics</h2>
                {selectedGrade && (
                  <button 
                    onClick={() => setShowAddTopicDialog(true)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="Add new topic"
                  >
                    <Plus className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-1 p-2">
                  {topics
                    .filter(topic => topic.gradeId === selectedGrade)
                    .map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          setSelectedTopic(topic.id);
                          setSelectedSubTopic(undefined);
                          setSelectedLesson(undefined);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm group",
                          selectedTopic === topic.id
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {topic.title}
                        <div className="float-right space-x-1 opacity-0 group-hover:opacity-100">
                          <Edit className="inline h-4 w-4 text-gray-400 hover:text-gray-600" />
                          <Trash2 className="inline h-4 w-4 text-red-400 hover:text-red-600" />
                        </div>
                      </button>
                    ))}
                </div>
              </ScrollArea>
            </div>

            {/* Sub-topics List */}
            <div className="w-1/4 bg-gray-50">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-700">Sub-topics</h2>
                {selectedTopic && (
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Plus className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-1 p-2">
                  {subTopics
                    .filter(subTopic => subTopic.topicId === selectedTopic)
                    .map((subTopic) => (
                      <button
                        key={subTopic.id}
                        onClick={() => {
                          setSelectedSubTopic(subTopic.id);
                          setSelectedLesson(undefined);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm group",
                          selectedSubTopic === subTopic.id
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {subTopic.title}
                        <div className="float-right space-x-1 opacity-0 group-hover:opacity-100">
                          <Edit className="inline h-4 w-4 text-gray-400 hover:text-gray-600" />
                          <Trash2 className="inline h-4 w-4 text-red-400 hover:text-red-600" />
                        </div>
                      </button>
                    ))}
                </div>
              </ScrollArea>
            </div>

            {/* Lessons List */}
            <div className="w-1/4 bg-white">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-sm font-medium text-gray-700">Lessons</h2>
                {selectedSubTopic && (
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Plus className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="space-y-1 p-2">
                  {lessons
                    .filter(lesson => lesson.subTopicId === selectedSubTopic)
                    .map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson.id)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-md text-sm group",
                          selectedLesson === lesson.id
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-700 hover:bg-gray-100"
                        )}
                      >
                        {lesson.title}
                        <div className="float-right space-x-1 opacity-0 group-hover:opacity-100">
                          <Edit className="inline h-4 w-4 text-gray-400 hover:text-gray-600" />
                          <Trash2 className="inline h-4 w-4 text-red-400 hover:text-red-600" />
                        </div>
                      </button>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="editor" className="h-full">
          <div className="h-full p-6 bg-gray-50">
            {selectedLesson ? (
              <div className="bg-white rounded-lg shadow">
                <LessonEditor
                  lesson={lessons.find(l => l.id === selectedLesson)}
                  onSave={(lessonData) => updateContent({
                    type: 'lessons',
                    id: selectedLesson,
                    data: lessonData
                  })}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a lesson to edit</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="h-full">
          <div className="h-full p-6 bg-gray-50">
            {selectedLesson ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2>Content Preview</h2>
                {/* Add lesson preview here */}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a lesson to preview</p>
              </div>
            )}
          </div>
        </TabsContent>
        </div>
      </Tabs>

      {/* Add Topic Dialog */}
      {showAddTopicDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">Add New Topic</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleAddTopic({
                title: formData.get('title') as string,
                description: formData.get('description') as string
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddTopicDialog(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Add Topic
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};