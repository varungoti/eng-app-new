import React from 'react';
import { QuestionForm } from './components/question-form';
import { QuestionTypeSelect } from './components/question-type-select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { QUESTION_TYPES, QuestionType, isQuestionType } from './constants';
import type { Question } from './types';
import { useToast } from '@/hooks/useToast';
import { logger } from '@/lib/logger';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

const LessonManagement: React.FC = () => {
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<QuestionType>('speaking');
  const { showToast } = useToast();
  const mounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleAddQuestion = async (type: string) => {
    try {
      setLoading(true);

      if (!isQuestionType(type)) {
        throw new Error('Invalid question type');
      }

      const newQuestion: Question = {
        type,
        data: {
          prompt: '',
          teacherScript: '',
          ...QUESTION_TYPES[type].defaultData
        },
        exercisePrompts: []
      };

      if (mounted.current) {
        setQuestions(prev => [...prev, newQuestion]);
      }
      showToast('Question added successfully', { type: 'success' });
      
      logger.info('Question added successfully', {
        context: { type },
        source: 'LessonManagement'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add question';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'LessonManagement'
      });
    } finally {
      if (mounted.current) {
        setLoading(false);
      }
    }
  };

  const handleUpdateQuestion = async (index: number, updatedQuestion: Question) => {
    try {
      const newQuestions = [...questions];
      newQuestions[index] = updatedQuestion;
      setQuestions(newQuestions);
      
      logger.info('Question updated successfully', {
        context: { index },
        source: 'LessonManagement'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update question';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'LessonManagement'
      });
    }
  };

  const handleRemoveQuestion = async (index: number) => {
    try {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      showToast('Question removed successfully', { type: 'success' });
      
      logger.info('Question removed successfully', {
        context: { index },
        source: 'LessonManagement'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove question';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'LessonManagement'
      });
    }
  };

  const handleAddExercisePrompt = async (questionIndex: number) => {
    try {
      const newQuestions = [...questions];
      newQuestions[questionIndex].exercisePrompts.push({
        text: '',
        media: '',
        type: 'image',
        narration: '',
        sayText: ''
      });
      setQuestions(newQuestions);
      showToast('Exercise prompt added successfully', { type: 'success' });
      
      logger.info('Exercise prompt added successfully', {
        context: { questionIndex },
        source: 'LessonManagement'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add exercise prompt';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'LessonManagement'
      });
    }
  };

  const handleRemoveExercisePrompt = async (questionIndex: number, promptIndex: number) => {
    try {
      const newQuestions = [...questions];
      newQuestions[questionIndex].exercisePrompts.splice(promptIndex, 1);
      setQuestions(newQuestions);
      showToast('Exercise prompt removed successfully', { type: 'success' });
      
      logger.info('Exercise prompt removed successfully', {
        context: { questionIndex, promptIndex },
        source: 'LessonManagement'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove exercise prompt';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'LessonManagement'
      });
    }
  };

  const handleExercisePromptChange = async (
    questionIndex: number,
    promptIndex: number,
    updatedPrompt: any
  ) => {
    try {
      const newQuestions = [...questions];
      newQuestions[questionIndex].exercisePrompts[promptIndex] = updatedPrompt;
      setQuestions(newQuestions);
      
      logger.info('Exercise prompt updated successfully', {
        context: { questionIndex, promptIndex },
        source: 'LessonManagement'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update exercise prompt';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'LessonManagement'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading question..." />;
  }

  return (
    <ErrorBoundary source="LessonManagement">
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Lesson Management</h1>
            <p className="text-muted-foreground">Create and manage lesson content</p>
          </div>
          <div className="flex items-center gap-2">
            <QuestionTypeSelect
              value={selectedType}
              onValueChange={handleAddQuestion}
            />
            <Button onClick={() => handleAddQuestion('speaking')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionForm
              key={index}
              question={question}
              index={index}
              onUpdate={handleUpdateQuestion}
              onRemove={handleRemoveQuestion}
              onAddExercisePrompt={handleAddExercisePrompt}
              onRemoveExercisePrompt={handleRemoveExercisePrompt}
              onExercisePromptChange={handleExercisePromptChange}
            />
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default LessonManagement;