"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Toaster, toast } from 'sonner';
import { ContentHeader } from './components/layout/ContentHeader';
import { ContentSidebar } from './components/layout/ContentSidebar';
import { ContentBreadcrumbs } from './components/layout/ContentBreadcrumbs';
import { LessonEditor } from './components/lesson/LessonEditor';
import { QuestionList } from './components/questions/QuestionList';
import { ActivityList } from './components/activities/ActivityList';
import { ContentModals } from './components/layout/ContentModals';
import { KeyboardShortcutsDialog } from './components/shared/KeyboardShortcutsDialog';
import { ProgressIndicator } from './components/shared/ProgressIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ActivityIcon, MessageSquare } from 'lucide-react';
import { useContentState } from './hooks/useContentState';
import { useLessonEditor } from './hooks/useLessonEditor';
import { useQuestionManager } from './hooks/useQuestionManager';
import { useActivityManager } from './hooks/useActivityManager';
import { useContentModals } from './hooks/useContentModals';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAccessibilityAnnouncer } from './hooks/useAccessibilityAnnouncer';
import { useErrorBoundary } from 'react-error-boundary';
import { useLogger } from '@/hooks/useLogger';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/lib/supabase';

// Error types
interface ContentError extends Error {
  code?: string;
  details?: unknown;
  context?: string;
}

// Create error logger
const createError = (message: string, code?: string, details?: unknown): ContentError => {
  const error = new Error(message) as ContentError;
  error.code = code;
  error.details = details;
  error.name = 'ContentManagementError';
  return error;
};

export default function ContentManagementPage() {
  // UI State
  const [showHelpTips, setShowHelpTips] = useState(true);
  const [isViewMode, setIsViewMode] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarLocked, setIsSidebarLocked] = useState(true);
  const [activeTab, setActiveTab] = useState<'questions' | 'activities'>('questions');
  const shortcutsButtonRef = useRef<HTMLButtonElement>(null);

  // Content Management State
  const {
    selectedGradeId,
    selectedTopicId,
    selectedSubtopicId,
    currentLessonId,
    grades,
    topics,
    subtopics,
    lessons,
    handleGradeSelect,
    handleTopicSelect,
    handleSubtopicSelect,
    setCurrentLessonId,
    refreshContent,
    fetchGrades,
    fetchTopics,
    fetchSubtopics,
    fetchLessons
  } = useContentState();

  // Lesson Editor State
  const {
    lessonTitle,
    contentHeading,
    lessonContent,
    isContentEditorOpen,
    isEditingTitle,
    isEditingHeading,
    saveProgress,
    setLessonTitle,
    setContentHeading,
    setLessonContent,
    setIsContentEditorOpen,
    setIsEditingTitle,
    setIsEditingHeading,
    loadLessonContent,
    saveLesson,
  } = useLessonEditor(currentLessonId);

  // Question Manager State
  const {
    questions,
    selectedQuestionType,
    questionSaveStatuses,
    expandedQuestion,
    setQuestions,
    setSelectedQuestionType,
    setExpandedQuestion,
    addQuestion,
    saveQuestion,
    updateQuestion,
    removeQuestion,
  } = useQuestionManager(currentLessonId);

  // Activity Manager State
  const {
    activities,
    activitySaveStatuses,
    expandedActivity,
    setActivities,
    setExpandedActivity,
    addActivity,
    updateActivity,
    removeActivity,
    saveActivity,
  } = useActivityManager(currentLessonId);

  // Modal Management
  const {
    modalState,
    openModal,
    closeModal,
    handlers: modalHandlers
  } = useContentModals({
    selectedGradeId,
    selectedTopicId,
    selectedSubtopicId,
    onSuccess: refreshContent
  });

  // Keyboard Shortcuts
  useKeyboardShortcuts({
    onSave: saveLesson,
    onToggleEditMode: () => setIsViewMode(!isViewMode),
    onToggleHelpTips: () => setShowHelpTips(!showHelpTips),
    onToggleShortcuts: () => shortcutsButtonRef.current?.click(),
    onToggleContentEditor: () => setIsContentEditorOpen(!isContentEditorOpen),
    onSaveContent: saveLesson,
    onCollapseSidebar: () => setIsSidebarCollapsed(true),
    onExpandSidebar: () => setIsSidebarCollapsed(false),
    onToggleSidebarLock: () => setIsSidebarLocked(!isSidebarLocked),
    onSwitchToQuestions: () => setActiveTab('questions'),
    onSwitchToActivities: () => setActiveTab('activities'),
    onAddNew: () => activeTab === 'questions' ? addQuestion() : addActivity(),
    isContentEditorOpen
  });

  // Accessibility
  const { announce } = useAccessibilityAnnouncer();
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (currentLessonId) {
      mainContentRef.current?.focus();
      announce(`Loaded lesson: ${lessonTitle || 'Untitled Lesson'}`);
    }
  }, [currentLessonId, lessonTitle, announce]);

  // Announce save status changes
  useEffect(() => {
    if (saveProgress === 'saving') {
      announce('Saving changes...', 'polite');
    } else if (saveProgress === 'saved') {
      announce('Changes saved successfully', 'polite');
    } else if (saveProgress === 'error') {
      announce('Error saving changes', 'assertive');
    }
  }, [saveProgress, announce]);

  // Announce tab changes
  useEffect(() => {
    announce(`Switched to ${activeTab} tab`);
  }, [activeTab, announce]);

  // Session state
  const { session } = useSession();

  // Add loading states
  const [isLoading, setIsLoading] = useState({
    grades: false,
    topics: false,
    subtopics: false,
    lessons: false,
    saving: false
  });

  // Error handling
  const { showBoundary } = useErrorBoundary();
  const logger = useLogger('ContentManagement');

  // Enhanced save function with error handling
  const handleSaveLesson = async () => {
    if (!currentLessonId || !selectedSubtopicId) {
      toast.error('Please select a subtopic and lesson first');
      return;
    }

    setIsLoading(prev => ({ ...prev, saving: true }));
    const loadingToast = toast.loading('Saving lesson...', {
      description: 'Please wait while we save your changes'
    });

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw createError(sessionError.message, 'AUTH_ERROR', { details: sessionError });
      
      if (!session?.user) {
        throw createError('Please sign in to save lessons', 'AUTH_REQUIRED');
      }

      // Get user's role from session
      const userRole = session.user.user_metadata?.role;
      logger.info('Saving lesson', {
        user: session.user.id,
        role: userRole,
        lessonId: currentLessonId
      });

      // Save lesson metadata
      const lessonData = {
        id: currentLessonId,
        title: lessonTitle,
        contentheading: contentHeading,
        updated_at: new Date().toISOString(),
        user_id: session.user.id,
        metadata: {
          lastEdited: new Date().toISOString(),
          version: 1,
          status: 'draft'
        }
      };

      const { error: lessonError } = await supabase
        .from('lessons')
        .upsert(lessonData);

      if (lessonError) throw lessonError;

      // Save lesson content
      const { data: existingContent } = await supabase
        .from('lesson_content')
        .select('id')
        .eq('lesson_id', currentLessonId)
        .single();

      const contentData = {
        id: existingContent?.id || crypto.randomUUID(),
        lesson_id: currentLessonId,
        content: [lessonContent],
        content_type: 'html',
        metadata: {
          lastEdited: new Date().toISOString(),
          version: 1,
          status: 'draft'
        },
        user_id: session.user.id,
        updated_at: new Date().toISOString()
      };

      const { error: contentError } = await supabase
        .from('lesson_content')
        .upsert(contentData);

      if (contentError) throw contentError;

      toast.success('Lesson saved successfully', {
        id: loadingToast,
        description: 'All changes have been saved'
      });

      logger.info('Lesson saved successfully', {
        lessonId: currentLessonId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      handleError(error, 'save_lesson');
      toast.error('Failed to save lesson', { id: loadingToast });
    } finally {
      setIsLoading(prev => ({ ...prev, saving: false }));
    }
  };

  // Error handling wrapper
  const handleError = useCallback(async (error: unknown, context: string) => {
    const contentError = error as ContentError;
    contentError.context = context;

    // Log error
    logger.error('Content management error:', {
      error: contentError,
      context,
      timestamp: new Date().toISOString(),
      user: session?.user?.id,
      location: {
        grade: selectedGradeId,
        topic: selectedTopicId,
        subtopic: selectedSubtopicId,
        lesson: currentLessonId
      }
    });

    // Show error toast
    toast.error(contentError.message || 'An error occurred', {
      description: context,
      action: {
        label: 'Try Again',
        onClick: () => {
          // Retry logic based on context
          switch (context) {
            case 'fetch_grades':
              fetchGrades();
              break;
            case 'fetch_topics':
              fetchTopics();
              break;
            case 'fetch_subtopics':
              fetchSubtopics();
              break;
            case 'fetch_lessons':
              fetchLessons();
              break;
            case 'save_lesson':
              handleSaveLesson();
              break;
            default:
              break;
          }
        }
      }
    });

    // Show error boundary for critical errors
    if (contentError.code === 'CRITICAL') {
      showBoundary(contentError);
    }
  }, [
    logger,
    session?.user?.id,
    selectedGradeId,
    selectedTopicId,
    selectedSubtopicId,
    currentLessonId,
    showBoundary,
    fetchGrades,
    fetchTopics,
    fetchSubtopics,
    fetchLessons,
    handleSaveLesson
  ]);

  // Breadcrumb items with proper state management
  const breadcrumbItems = useMemo(() => [
    {
      label: 'Grades',
      onClick: () => {
        handleGradeSelect('');
        setCurrentLessonId(null);
      },
      isActive: !selectedGradeId
    },
    selectedGradeId && {
      label: grades.find(g => g.id === selectedGradeId)?.name || 'Grade',
      onClick: () => {
        handleTopicSelect('');
        setCurrentLessonId(null);
      },
      isActive: selectedGradeId && !selectedTopicId
    },
    selectedTopicId && {
      label: topics.find(t => t.id === selectedTopicId)?.title || 'Topic',
      onClick: () => {
        handleSubtopicSelect('');
        setCurrentLessonId(null);
      },
      isActive: selectedTopicId && !selectedSubtopicId
    },
    selectedSubtopicId && {
      label: subtopics.find(s => s.id === selectedSubtopicId)?.title || 'Subtopic',
      onClick: () => {
        setCurrentLessonId(null);
      },
      isActive: selectedSubtopicId && !currentLessonId
    },
    currentLessonId && {
      label: lessonTitle || 'Lesson',
      onClick: () => {},
      isActive: true
    }
  ].filter(Boolean) as { label: string; onClick: () => void; isActive?: boolean }[], [
    selectedGradeId,
    selectedTopicId,
    selectedSubtopicId,
    currentLessonId,
    grades,
    topics,
    subtopics,
    lessonTitle,
    handleGradeSelect,
    handleTopicSelect,
    handleSubtopicSelect,
    setCurrentLessonId
  ]);

  return (
    <div 
      className="min-h-screen bg-background"
      role="application"
      aria-label="Content Management System"
    >
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4">
          <ContentHeader
            showHelpTips={showHelpTips}
            onToggleHelpTips={() => setShowHelpTips(!showHelpTips)}
            onRefresh={() => loadLessonContent(currentLessonId || '')}
            isViewMode={isViewMode}
            onToggleViewMode={() => setIsViewMode(!isViewMode)}
            saveProgress={saveProgress}
          >
            <KeyboardShortcutsDialog ref={shortcutsButtonRef} />
          </ContentHeader>

          <ContentBreadcrumbs items={breadcrumbItems} />
        </div>

        {/* Main Content */}
        <div className="flex gap-6 mt-6">
          {/* Sidebar */}
          <ContentSidebar
            grades={grades}
            topics={topics}
            subtopics={subtopics}
            lessons={lessons}
            selectedGradeId={selectedGradeId}
            selectedTopicId={selectedTopicId}
            selectedSubtopicId={selectedSubtopicId}
            currentLessonId={currentLessonId}
            isViewMode={isViewMode}
            onGradeSelect={handleGradeSelect}
            onTopicSelect={handleTopicSelect}
            onSubtopicSelect={handleSubtopicSelect}
            onLessonSelect={setCurrentLessonId}
            onAddGrade={() => openModal('addGrade')}
            onAddTopic={() => openModal('addTopic')}
            onAddSubtopic={() => openModal('addSubtopic')}
            onAddLesson={() => openModal('addLesson')}
            isCollapsed={isSidebarCollapsed}
            isLocked={isSidebarLocked}
            onCollapsedChange={setIsSidebarCollapsed}
            onLockedChange={setIsSidebarLocked}
          />

          {/* Content Area */}
          <main 
            ref={mainContentRef}
            tabIndex={-1}
            className="flex-1 focus:outline-none"
            aria-label="Main content area"
          >
            {isNavigating ? (
              <div 
                className="flex items-center justify-center h-[400px]"
                role="alert"
                aria-busy="true"
              >
                <div 
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
                  aria-hidden="true"
                />
                <span className="ml-3 sr-only">Loading content...</span>
                <span className="ml-3" aria-hidden="true">Loading...</span>
              </div>
            ) : !currentLessonId ? (
              <div 
                className="text-center py-20"
                role="status"
                aria-label="No lesson selected"
              >
                <h3 className="text-lg font-medium">Select a Lesson</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a lesson from the sidebar to start editing
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Lesson Editor */}
                <LessonEditor
                  lessonTitle={lessonTitle}
                  contentHeading={contentHeading}
                  lessonContent={lessonContent}
                  isContentEditorOpen={isContentEditorOpen}
                  isEditingTitle={isEditingTitle}
                  isEditingHeading={isEditingHeading}
                  saveProgress={saveProgress}
                  onTitleChange={setLessonTitle}
                  onHeadingChange={setContentHeading}
                  onContentChange={setLessonContent}
                  onContentSave={saveLesson}
                  setIsContentEditorOpen={setIsContentEditorOpen}
                  setIsEditingTitle={setIsEditingTitle}
                  setIsEditingHeading={setIsEditingHeading}
                  onSave={saveLesson}
                />

                {/* Questions and Activities Tabs */}
                <Tabs 
                  value={activeTab} 
                  onValueChange={(value: string) => setActiveTab(value as 'questions' | 'activities')}
                  className="rounded-lg border bg-card shadow-sm"
                >
                  <TabsList className="grid w-full grid-cols-2 p-1">
                    <TabsTrigger 
                      value="questions"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span>Questions</span>
                      <span className="ml-2 text-xs rounded-full bg-primary/10 px-2 py-0.5">
                        {questions.length}
                      </span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="activities"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <ActivityIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                      <span>Activities</span>
                      <span className="ml-2 text-xs rounded-full bg-primary/10 px-2 py-0.5">
                        {activities.length}
                      </span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent 
                    value="questions"
                    className="p-4 border-t"
                    role="tabpanel"
                    aria-label="Questions panel"
                  >
                    <QuestionList
                      questions={questions}
                      selectedQuestionType={selectedQuestionType}
                      questionSaveStatuses={questionSaveStatuses}
                      expandedQuestion={expandedQuestion}
                      onQuestionTypeChange={setSelectedQuestionType}
                      onAddQuestion={addQuestion}
                      onUpdateQuestion={updateQuestion}
                      onRemoveQuestion={removeQuestion}
                      onSaveQuestion={saveQuestion}
                      onExpandQuestion={setExpandedQuestion}
                    />
                  </TabsContent>

                  <TabsContent 
                    value="activities"
                    className="p-4 border-t"
                    role="tabpanel"
                    aria-label="Activities panel"
                  >
                    <ActivityList
                      activities={activities}
                      activitySaveStatuses={activitySaveStatuses}
                      expandedActivity={expandedActivity}
                      onAddActivity={addActivity}
                      onUpdateActivity={updateActivity}
                      onRemoveActivity={removeActivity}
                      onSaveActivity={saveActivity}
                      onExpandActivity={setExpandedActivity}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modals */}
      <ContentModals
        modals={modalState}
        onClose={closeModal}
        onSubmit={modalHandlers}
      />

      {/* Progress Indicator */}
      <ProgressIndicator status={saveProgress} />

      <Toaster />
    </div>
  );
}